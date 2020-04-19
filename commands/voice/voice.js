const commando = require('discord.js-commando');
const config = require("./../../config.json");

function Play(connection, soundPath){
    const dispatcher = connection.playFile(soundPath);
    dispatcher.on("end", end => {
        connection.disconnect()
    });
}


class VoiceCommand extends commando.Command {
    constructor(bot) {
        super(bot, {
            name: 'voice',
            group: 'voice',
            memberName: 'voice',
            description: 'play sound in voice channel based on parameters'
        })
    }

    async run(message, args) {
        let soundPath = config.mp3Paths[args];
        if(soundPath != null){
            if (message.member.voiceChannel) {
                if (!message.guild.voiceConnection) {
                    message.member.voiceChannel.join()
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