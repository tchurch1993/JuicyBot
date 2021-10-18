const { Command } = require("@sapphire/framework");
const parsedArgs = require("../../helpers/parsers/extractargs");

class QueueCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "queue",
      group: "music",
      memberName: "queue",
      description: "See the music queue",
      guildOnly: true,
    });
  }

  async messageRun(message, args) {
    var subscription = global.subscriptions.get(message.guildId);
    // Print out the current queue, including up to the next 5 tracks to be played.
    if (subscription) {
      const current =
        subscription.audioPlayer.state.status === "idle"
          ? `Nothing is currently playing!`
          : `Playing **${subscription.audioPlayer.state.resource.metadata.title}**`;

      const queue = subscription.queue
        .slice(0, 5)
        .map((track, index) => `${index + 1}) ${track.title}`)
        .join("\n");

      await message.reply(`${current}\n\n${queue}`);
    } else {
      await message.reply("Not playing in this server!");
    }
  }
}

module.exports = QueueCommand;
