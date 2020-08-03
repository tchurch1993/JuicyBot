const commando = require('discord.js-commando');
const ytdl = require('ytdl-core');

class PlayCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'play',
            group: 'music',
            memberName: 'play',
            description: 'plays music!',
            ownerOnly: true
        })
    }

    async run(message, args){
        try {
            let songInfo = await ytdl.getInfo(args);
            console.log(songInfo);
        } catch (error) {
            console.log(error);
        }

    }
}

module.exports = PlayCommand;