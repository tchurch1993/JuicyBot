const { Command } = require("@sapphire/framework");

class ResumeCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "resume",
      group: "music",
      memberName: "resume",
      description: "Resume playback of the current song",
      guildOnly: true,
    });
  }

  async messageRun(message, args) {
    var subscription = global.subscriptions.get(message.guildId);

    if (subscription) {
      const status = subscription.audioPlayer.state.status;

      if (status === "paused") {
        subscription.audioPlayer.unpause();
        await message.reply({ content: `Unpaused!`, ephemeral: true });
      } else if (status === "idle") {
        if (subscription.queue.length > 0) {
          subscription.processQueue();
          await message.reply({ content: `Unpaused!`, ephemeral: true });
        }
      } else {
        await message.reply("Nothing to resume!");
      }
    } else {
      await message.reply("Not playing in this server!");
    }
  }
}

module.exports = ResumeCommand;
