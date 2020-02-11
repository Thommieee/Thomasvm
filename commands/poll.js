const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Je hebt geen toegang om dit command te gebruiken!");

    var poll = args.join(" ");
    if (!poll) return message.channel.send("Een poll maken doe je zo: ;poll en dan je poll");

    var pollEmbed = new discord.RichEmbed()
        .setTitle("Nieuwe poll")
        .setColor("#ff0000")
        .addField("Poll", poll)
        .addField("Aangemaakt door: ", message.author);

    var pollChannel = message.guild.channels.find("name", "poll");
    if (!pollChannel) return message.channel.send("Kan het kanaal niet vinden.");

    pollChannel.send(pollEmbed).then(embedMessage => {
        embedMessage.react("🇦")
            .then(() => embedMessage.react('🇧'))
            .then(() => embedMessage.react('🇨'))
            .then(() => embedMessage.react('🇩'))
            .then(() => embedMessage.react('🇪'))
            .then(() => embedMessage.react('🇫'))
            .then(() => embedMessage.react('🇬'))
            .then(() => embedMessage.react('🇭'))
            .then(() => embedMessage.react('🇮'))
            .then(() => embedMessage.react('🇯'))
            .then(() => embedMessage.react('🇰'))
            .then(() => embedMessage.react('🇱'))
            .then(() => embedMessage.react('🇲'))
            .then(() => embedMessage.react('🇳'))
            .then(() => embedMessage.react('🇴'));
    });

}

module.exports.help = {
    name: "poll",
    description: "Hiermee maak je een poll aan. Let op: Alleen voor Admins."
}