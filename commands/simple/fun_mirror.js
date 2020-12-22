const commando = require('discord.js-commando');

class FunMirrorCommand extends commando.Command {
    constructor(bot) {
        super(bot, {
            name: 'funmirror',
            group: 'simple',
            memberName: 'funmirror',
            description: 'Looks at your reflection in a mirror!'
        })
    }

    //TODO: probably remove
    async run(message, args) {
        message.reply(message.author.avatarURL());
    }
}

module.exports = FunMirrorCommand;