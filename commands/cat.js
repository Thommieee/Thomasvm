const discord = require("discord.js");
const superAgent = require("superagent");

module.exports.run = async(bot, message, args) => {

    var cat;

    cat = await superAgent
        .get("http://aws.random.cat/meow");


    while (cat.body.file.endsWith(".webm") || cat.body.file.endsWith(".mp4")) {
        cat = await superAgent
            .get("http://aws.random.cat/meow");
        console.log(cat.body)
    }

    var catEmbed = new discord.RichEmbed()
        .setColor("#880000")
        .setTitle("Cat :cat:")
        .setImage(cat.body.file);

    message.channel.send(catEmbed);

}

module.exports.help = {
    name: "kat",
    description: "Laat een random plaatje van een kat zien"
}