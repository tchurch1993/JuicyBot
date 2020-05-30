const commando = require('discord.js-commando');
const discord = require('discord.js');

function buildRichQuote(randoMessage){
    var date = randoMessage[0].createdAt
    var year = date.getFullYear().toString();
     year = setCharAt(year, 1, 'K')
    var myInfo = new discord.MessageEmbed()
            .addField(randoMessage, "-" + randoMessage[0].author.username + " " + year)
            .setColor(0xFF0000)
            .setThumbnail(randoMessage[0].author.avatarURL())
    return myInfo;
}


class RandomPinCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'pin',
            group: 'simple',
            memberName: 'pin',
            description: 'displays random pinned message'
        })
    }

    async run(message, args){
        message.channel.messages.fetchPinned()
            .then(messages => {
                if(messages.size > 0){
                    var randoMessage = messages.random(1);
                    var myInfo = buildRichQuote(randoMessage);
                    message.channel.send(myInfo)
                } else {
                    message.channel.send("there aint be any pinned messages homie")
                }
            })
    }
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
module.exports = RandomPinCommand;