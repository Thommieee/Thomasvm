const discord = require("discord.js");
const botConfig = require("./botconfig.json");
const levelFile = require("./data/levels.json");

const fs = require("fs");

const bot = new discord.Client();
bot.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    var jsFiles = files.filter(f => f.split(".").pop() === "js");

    if (jsFiles.length <= 0) {
        console.log("Kon geen files vinden");
        return;
    }

    jsFiles.forEach((f, i) => {

        var fileGet = require(`./commands/${f}`);
        console.log(`De file ${f} is geladen`);

        bot.commands.set(fileGet.help.name, fileGet);

    })

});


bot.on("ready", async () => {

    console.log(`${bot.user.username} is online!`)

    bot.user.setActivity("Thomas helpen", { Type: "PLAYING" });

});

bot.on("guildMemberAdd", member => {

    var role = member.guild.roles.find("name", "Nieuwe Member");

    if (!role) return;

    member.addRole(role);

    const channel = member.guild.channels.find("name", "join");

    if (!channel) return;

    channel.send(`Welkom in onze server ${member}! Geef in dit kanaal de role die je wilt door aan ons (aloy en ik). Als je die role hebt gekregen lees dan eerst #regels en daarna #informatie. Veel plezier in de server!`);

});

bot.on("guildMemberRemove", member => {

    const channel = member.guild.channels.find("name", "botlogs");
    if (!channel) console.log("Kan het kanaal niet vinden.");

    var leaveEmbed = new discord.RichEmbed()
        .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL)
        .setColor("#FF0000")
        .setTimestamp()
        .setFooter("Gebruiker Geleaved.");

    channel.send(leaveEmbed);

});



bot.on("message", async message => {

    if (message.channel.type === "dm") return;

    var prefixes = JSON.parse(fs.readFileSync("./prefixes.json"));

    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefixes: botConfig.prefix
        };
    }

    var prefix = prefixes[message.guild.id].prefixes;

    // var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    var args = messageArray.slice(1);


    var randomXp = Math.floor(Math.random(1) * 15) + 1;

    var idUser = message.author.id;

    if (!levelFile[idUser]) {

        levelFile[idUser] = {

            xp: 0,
            level: 0

        }

    }

    levelFile[idUser].xp += randomXp;

    var levelUser = levelFile[idUser].level;
    var xpUser = levelFile[idUser].xp;
    var nextLevelXp = levelUser * 300;

    if (nextLevelXp === 0) nextLevelXp = 100;

    if (xpUser >= nextLevelXp) {

        levelFile[idUser].level += 1;

        fs.writeFile("./data/levels.json", JSON.stringify(levelFile), err => {

            if (err) console.log(err);

        });

        var embedLevel = new discord.RichEmbed()
            .setDescription("***Level hoger***")
            .setColor("#ff0000")
            .addField("Nieuw level: ", levelFile[idUser].level);

        var levelChannel = message.guild.channels.find(c => c.name == "levels-admins");
        if (!levelChannel) return message.guild.send("Kan het level kanaal niet vinden!");

        levelChannel.send(embedLevel);

    }

    if (!commands) {

        var swearWords = JSON.parse(fs.readFileSync("./data/swearWords.json"));

        var sentenceUser = "";

        var amountSwearWords = 0;


        for (var y = 0; y < messageArray.length; y++) {


            var changeWord = "";


            for (var i = 0; i < swearWords["vloekwoorden"].length; i++) {


                var word = messageArray[y].toLowerCase();

                if (word == swearWords["vloekwoorden"][i]) {


                    changeWord = word.replace(swearWords["vloekwoorden"][i], "^^");


                    sentenceUser = sentenceUser + " " + changeWord;

                    amountSwearWords++;

                }

            }

            if (!changeWord) {


                sentenceUser = sentenceUser + " " + messageArray[y];

            }

        }


        if (amountSwearWords != 0) {

            message.delete();
            message.channel.send(sentenceUser);
            message.channel.send(message.author + " Niet schelden A.U.B!");
            message.channel.send(";warn " + message.author + " Je hebt gescholden!");

        }

    }

    if (!message.content.startsWith(prefix)) return;

    var commands = bot.commands.get(command.slice(prefix.length));

    if (commands) commands.run(bot, message, args);

});

bot.login(process.env.token);