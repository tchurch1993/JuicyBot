const commando = require('discord.js-commando');
const ytdl = require('ytdl-core');

class PlayCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'play',
            group: 'music',
            memberName: 'play',
            description: 'plays music from a youtube link!',
            guildOnly: true,
        })
    }

    async run(message, args){
        try {
            let serverQueue = global.queue.get(message.guild.id)
            const voiceChannel = message.member.voice.channel
            if(!voiceChannel){
                return message.channel.send("You ain't in no voice channel, yo")
            }

            const permissions = voiceChannel.permissionsFor(message.client.user);
            if(!permissions.has("CONNECT") || !permissions.has("SPEAK")){
                return message.channel.send("I ain't got permissions to join and/or speak, yo")
            }

            let argArray = args.split(' ');

            if(!this.validURL(argArray[0])){
                return message.channel.send("yo, this aint no URL. wtf man");
            }
            const songInfo = await ytdl.getInfo(argArray[0]);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url
            };

            if (!serverQueue) {
                const queueContruct = {
                  textChannel: message.channel,
                  voiceChannel: voiceChannel,
                  connection: null,
                  songs: [],
                  volume: 5,
                  playing: true
                };
            
                global.queue.set(message.guild.id, queueContruct);
            
                queueContruct.songs.push(song);
            
                try {
                  var connection = await voiceChannel.join();
                  queueContruct.connection = connection;
                  this.play(message.guild, queueContruct.songs[0]);
                } catch (err) {
                  console.log(err);
                  global.queue.delete(message.guild.id);
                  return message.channel.send(err);
                }
              } else {
                serverQueue.songs.push(song);
                return message.channel.send(`${song.title} has been added to the queue!`);
              }
        } catch (error) {
            console.log(error);
        }
    }

    play(guild, song) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
          serverQueue.voiceChannel.leave();
          queue.delete(guild.id);
          return;
        }
      
        const dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on("finish", () => {
            serverQueue.songs.shift();
            this.play(guild, serverQueue.songs[0]);
          })
          .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
      }

      validURL(str) {
		let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return !!pattern.test(str);
	}
}

module.exports = PlayCommand;