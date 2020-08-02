const commando = require('discord.js-commando');
const voicelist = require('../../helpers/talk/googleTTSVoiceList')

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
        message.channel.send(JSON.stringify(voicelist));
    }
}

module.exports = SayCommand;