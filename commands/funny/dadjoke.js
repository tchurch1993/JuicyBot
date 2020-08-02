const commando = require('discord.js-commando');
const fetch = require('node-fetch')

class DadJokeCommand extends commando.Command {
    constructor(bot) {
        super(bot, {
            name: 'dadjoke',
            group: 'funny',
            memberName: 'dadjoke',
            description: 'tells hilarious dad jokes. you are welcome'
        })
    }

    async run(message, args) {

        try {
            var result = await fetch('https://icanhazdadjoke.com/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            var text = await result.json();

            message.channel.send(text.joke);
        } catch {
            message.channel.send("aww shit, somebody took a big ol' poopy")

        }
    }
}

module.exports = DadJokeCommand;