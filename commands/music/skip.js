const { Command } = require("@sapphire/framework");
const parsedArgs = require("../../helpers/parsers/extractargs");

class SkipCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "skip",
      group: "music",
      memberName: "skip",
      description: "Skip to the next song in the queue",
      guildOnly: true,
    });
  }

  async messageRun(message, args) {
    var subscription = global.subscriptions.get(message.guildId);
    if (subscription) {
      // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
      // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
      // will be loaded and played.
      subscription.audioPlayer.stop();
      await message.reply("Skipped song!");
    } else {
      await message.reply("Not playing in this server!");
    }
  }
}

module.exports = SkipCommand;
