const commando = require('discord.js-commando');
const YTDL = require('ytdl-core');

function Play(connection, message) {
    var server = servers[message.guild.id];
    // This will probably need to change to connection.play()
    server.dipatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    server.queue.shift();
    server.dipatcher.on("end", function(){
        if(server.queue[0]){
            Play(connection, message);
        } else {
            connection.disconnect();
        }
    })
}

class JoinChannelCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'join',
            group: 'voice',
            memberName: 'join',
            description: 'Joins the channel of the commander',
            ownerOnly: true,
            guildOnly: true,
        })
    }

    async run(message, args){
        if(message.member.voice.channel){
            if(!message.guild.voiceConnection){
                if(!servers[message.guild.id]){
                    servers[message.guild.id] = {queue: []};
                }
                message.member.voice.channel.join()
                    .then(connection => {
                        var server = servers[message.guild.id];
                        message.reply("Successfully joined!");
                        console.log('args: ', args);
                        server.queue.push(args);
                        Play(connection, message);
                    });
            }
        } else {
            message.reply("You must be in a voice channel to summon me!");
        }
    }
}

module.exports = JoinChannelCommand;