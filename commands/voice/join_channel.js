const { Command } = require("@sapphire/framework");
const YTDL = require("ytdl-core");

function Play(connection, message) {
  var server = servers[message.guild.id];
  // This will probably need to change to connection.play()
  server.dipatcher = connection.playStream(
    YTDL(server.queue[0], { filter: "audioonly" })
  );
  server.queue.shift();
  server.dipatcher.on("end", function () {
    if (server.queue[0]) {
      Play(connection, message);
    } else {
      connection.disconnect();
    }
  });
}

class JoinChannelCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "join",
      group: "voice",
      memberName: "join",
      description: "Joins the channel of the commander",
      ownerOnly: true,
      guildOnly: true,
    });
  }

  async run(message, args) {
    if (message.member.voice.channel) {
      if (!message.guild.voiceConnection) {
        message.member.voice.channel.join();
      }
    } else {
      message.reply("You must be in a voice channel to summon me!");
    }
  }
}

module.exports = JoinChannelCommand;
