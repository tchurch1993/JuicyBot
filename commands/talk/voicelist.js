const commando = require('discord.js-commando');
const config = require('../../config.json')

class VoiceListCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'voicelist',
            group: 'talk',
            memberName: 'voicelist',
            description: 'lists the text to speech voices that can be set using the SetVoice command'
        })
    }

    async run(message, args){
        var voiceListString = ""
        var number = 1
        for(var voice in config.voicelist){
            voiceListString += number + '. ' + voice + "\n";
            number++;
        }
        message.channel.send(voiceListString);
    }
}

module.exports = VoiceListCommand;