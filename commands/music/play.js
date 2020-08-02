const commando = require('discord.js-commando');

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
        message.channel.send(args);
    }
}

module.exports = PlayCommand;