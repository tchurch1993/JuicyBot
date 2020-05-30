const commando = require('discord.js-commando');
const fetch = require('node-fetch');

class PussCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'puss',
            group: 'simple',
            memberName: 'puss',
            description: 'random picture of cat'
        })
    }

    async run(message, args){
        const { file } = await fetch('https://aws.random.cat/meow').then(Response => Response.json());
        message.channel.send(file);
    }
}

module.exports = PussCommand;