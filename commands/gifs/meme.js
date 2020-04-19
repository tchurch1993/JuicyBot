const commando = require('discord.js-commando');
const Gyfcat = require('gfycat-sdk');
const config = require('../../config.json');

class MemeCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'meme',
            group: 'gifs',
            memberName: 'meme',
            description: 'sends random meme!'
        })
    }

    async run(message, args){
        var gfycat = new Gyfcat(config.gfycat);

        gfycat.authenticate((err, data) => {
            console.log('token', gfycat.token);
            let options = {
                search_text: args,
                count: 50,
                first: 1
            };
            gfycat.search(options).then(data => {
                console.log(data.gfycats.length)
                if(data.gfycats.length > 0){
                    if(args === ('furry' || 'furries')){
                        message.channel.sendMessage("get out of here with that gay shit");
                        return;
                    }
                    var diceRoll = Math.floor(Math.random() * data.gfycats.length);
                    message.channel.sendMessage(data.gfycats[diceRoll].max2mbGif.toString());
                } else{
                    message.channel.sendMessage("ain't no memes here kiddo")
                }
            });
            
        });
    }
}

module.exports = MemeCommand;