const { Command } = require("@sapphire/framework");

class ClearCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "clear",
      group: "music",
      memberName: "clear",
      description: "clears the song queue",
      guildOnly: true,
    });
  }

  async run(message, args) {
    try {
      let serverQueue = global.queue.get(message.guild.id);
      if (!serverQueue) return message.channel.send("no queue to clear bruv");

      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();

      message.channel.send("song list cleared my dude");
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = ClearCommand;
