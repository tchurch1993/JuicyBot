const commando = require('discord.js-commando');
const config = require("./../../config.json");

function Play(connection, soundPath){
    try {
        const dispatcher = connection.play(soundPath);
        dispatcher.on("finish", finish => {
            connection.disconnect()
        });
    } catch (error) {
        console.log(error)
        connection.disconnect()
    }

}


class VoiceCommand extends commando.Command {
    constructor(bot) {
        super(bot, {
            name: 'voice',
            group: 'voice',
            memberName: 'voice',
            description: 'play sound in voice channel based on parameters',
            guildOnly: true,
        })
    }

    async run(message, args) {
        let soundPath = config.mp3Paths[args];
        if(soundPath != null){
            if (message.member.voice.channel) {
                if (!message.guild.voiceConnection) {
                    message.member.voice.channel.join()
                        .then(connection => {
                            Play(connection, soundPath)
                        })
                        .catch(console.error);
                }
            } else {
                message.reply("You must be in a voice channel to summon me!");
            }
        } else {
            message.reply("voice " + args + " was not found")
        }
    }
}

module.exports = VoiceCommand;