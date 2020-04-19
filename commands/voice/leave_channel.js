const commando = require('discord.js-commando');

class LeaveChannelCommand extends commando.Command {
    constructor(bot) {
        super(bot, {
            name: 'leave',
            group: 'voice',
            memberName: 'leave',
            description: 'leaves the channel of the commander'
        })
    }

    async run(message, args) {
        if (message.guild.voiceConnection) {
            message.guild.voiceConnection.disconnect();
        } else {
            message.reply("I am not in a voice channel to leave!");
        }
    }
}

module.exports = LeaveChannelCommand;