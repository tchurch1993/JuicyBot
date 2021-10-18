const { Command } = require("@sapphire/framework");
const parsedArgs = require("../../helpers/parsers/extractargs");

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
      subscription.audioPlayer.unpause();
      await message.reply({ content: `Unpaused!`, ephemeral: true });
    } else {
      await message.reply("Not playing in this server!");
    }
  }
}

module.exports = ResumeCommand;
