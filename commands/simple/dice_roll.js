const commando = require('discord.js-commando');

class DiceRollCommand extends commando.Command {
    constructor(bot) {
        super(bot, {
            name: 'roll',
            group: 'simple',
            memberName: 'roll',
            description: 'Roll a 6 sided dice'
        })
    }

    async run(message, args) {
        var diceRoll = Math.floor(Math.random() * 6) + 1;
        message.reply("Your dice landed on " + diceRoll);
    }
}

module.exports = DiceRollCommand;