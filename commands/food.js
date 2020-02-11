const randomPuppy = require("random-puppy");

module.exports.run = async (bot, message, args) => {

    let reddit = [
        "food",
        "FoodPorn"
    ]

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

    message.channel.startTyping();

    randomPuppy(subreddit).then(async url => {
            await message.channel.send({
                files: [{
                    attachment: url,
                    name: 'food.png'
                }]
            }).then(() => message.channel.stopTyping());
    }).catch(err => console.error(err));

};

module.exports.help = {
    name: 'food',
    description: "Laat een random food plaatje zien van r/food en r/foodporn"
}