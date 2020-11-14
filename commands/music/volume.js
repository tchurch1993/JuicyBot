const commando = require('discord.js-commando');

class VolumeCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'volume',
            group: 'music',
            memberName: 'volume',
            description: 'changes the volume from 1-100'
        })
    }

    async run(message, args){
        let serverQueue = global.queue.get(message.guild.id)


        if(serverQueue){
            if(this.isNumber(args) && (args >= 1 && args <= 100)){
                message.channel.send(args);
            } else {
                message.channel.send("please use a number between 1-100\ncurrent volume: " + serverQueue.volume)
            }
        } else {
            message.channel.send("no song playing");
        }
        

        
    }

    isNumber(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}

module.exports = VolumeCommand;