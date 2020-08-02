const commando = require('discord.js-commando');
const voiceList = require('../../helpers/talk/googleTTSVoiceList');
const ValidateAndAddUser = require('../../database/helpers/userValidation')

class SetTalkVoiceCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'setvoice',
            group: 'talk',
            memberName: 'setvoice',
            description: 'sets the voice for the talk command',
            guildOnly: true,
        })
    }

    async run(message, args){

        if(voiceList[args] != undefined){
            ValidateAndAddUser(message.member, (user) => {
                var voice = voiceList[args]
                user.TalkVoice = voice
                user.save();
                message.channel.send(`Talk voice set to : ${args}`)
            })
        } else {
            message.channel.send("sound not found")
        }
    }
}

module.exports = SetTalkVoiceCommand;