const commando = require('discord.js-commando');
const discord = require('discord.js');

class InfoAboutMeCommand extends commando.Command {
    constructor(bot) {
        super(bot, {
            name: 'info',
            group: 'simple',
            memberName: 'info',
            description: 'Learn a little more about me!'
        })
    }

    async run(message, args) {
        var myInfo = new discord.RichEmbed()
            .addField("About Me", "suck it")
            .setColor(0xFF0000)
            .setThumbnail(message.author.avatarURL)
            .setFooter("Thanks for reading. I hope you learned a little about me :D")
        message.channel.sendEmbed(myInfo);
    }
}

module.exports = InfoAboutMeCommand;