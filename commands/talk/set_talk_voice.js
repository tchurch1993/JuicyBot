const commando = require('discord.js-commando');
const config = require('../../config.json');
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

    //TODO: add a list of accents if their selection does not exist
    async run(message, args){

        if(config.voicelist[args] != undefined){
            ValidateAndAddUser(message.member, (user) => {
                var voice = config.voicelist[args]
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