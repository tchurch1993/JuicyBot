const { Command } = require("@sapphire/framework");
const GuildVolume = require("../../database/helpers/guildVolume");
const parsedArgs = require("../../helpers/parsers/extractargs");

class VolumeCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "volume",
      group: "music",
      memberName: "volume",
      description: "changes the volume from 1-100",
      ownerOnly: true,
    });
  }

  async messageRun(message, args) {
    let guildId = message.guild.id;
    let serverQueue = global.queue.get(guildId);

    if (serverQueue) {
      if (this.isNumber(args) && args >= 1 && args <= 100) {
        if (serverQueue.connection) {
          let connection = serverQueue.connection;
          let dispatcher = connection.dispatcher;

          GuildVolume.UpdateVolume(guildId, args, (guild) => {
            serverQueue.volume = guild.Volume;
            dispatcher.setVolumeLogarithmic(guild.Volume / 100);
            //TODO: pretty up volume message
            message.channel.send("volume set to: " + guild.Volume);
          });
        }
      } else {
        message.channel.send(
          "please use a number between 1-100\ncurrent volume: " +
            serverQueue.volume
        );
      }
    } else {
      message.channel.send("no song playing");
    }

    //    {
    //     textChannel: message.channel,
    //     voiceChannel: voiceChannel,
    //     connection: null,
    //     songs: [],
    //     volume: 5,
    //     playing: true
    //   };
  }

  isNumber(evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

module.exports = VolumeCommand;
