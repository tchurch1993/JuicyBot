const commando = require('discord.js-commando');

class FishCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'fish',
            group: 'games',
            memberName: 'fish',
            description: 'catch some fish!'
        })
    }

    async run(message, args){
        message.channel.sendMessage(args);
    }
}

module.exports = FishCommand;