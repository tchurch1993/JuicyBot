const { Command } = require("@sapphire/framework");
const parsedArgs = require("../../helpers/parsers/extractargs");

class PauseCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "pause",
      group: "music",
      memberName: "pause",
      description: "Pauses the song that is currently playing",
      guildOnly: true,
    });
  }

  async messageRun(message, args) {
    var subscription = global.subscriptions.get(message.guildId);
    if (subscription) {
      subscription.audioPlayer.pause();
      await message.reply({ content: `Paused!`, ephemeral: true });
    } else {
      await message.reply("Not playing in this server!");
    }
  }
}

module.exports = PauseCommand;
