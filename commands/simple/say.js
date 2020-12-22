const commando = require('discord.js-commando');

class SayCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'say',
            group: 'simple',
            memberName: 'say',
            description: 'Repeats what you typed back at you!'
        })
    }

    //TODO: delete from bot but keep as a template for future commands
    async run(message, args){
        message.channel.send(args);
    }
}

module.exports = SayCommand;