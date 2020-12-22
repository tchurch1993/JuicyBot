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

    //TODO: find better API for gifs/memes
    async run(message, args){
        var gfycat = new Gyfcat(config.gfycat);

        gfycat.authenticate((err, data) => {
            let options = {
                search_text: args,
                count: 5,
                first: 1
            };

            if(args === ('furry' || 'furries')){
                message.channel.send("get out of here with that gay shit");
                return;
            }
            gfycat.search(options).then(data => {
                if(data.gfycats.length > 0){
                    var diceRoll = Math.floor(Math.random() * data.gfycats.length);
                    message.channel.send(data.gfycats[diceRoll].max2mbGif.toString());
                } else{
                    message.channel.send("ain't no memes here kiddo")
                }
            });
            
        });
    }
}

module.exports = MemeCommand;