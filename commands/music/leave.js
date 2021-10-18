const { Command } = require("@sapphire/framework");
const parsedArgs = require("../../helpers/parsers/extractargs");

class LeaveCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "leave",
      group: "music",
      memberName: "leave",
      description: "Leave the voice channel",
      guildOnly: true,
    });
  }

  async messageRun(message, args) {
    var subscription = global.subscriptions.get(message.guildId);
    if (subscription) {
      subscription.voiceConnection.destroy();
      subscriptions.delete(message.guildId);
      await message.reply({ content: `Left channel!`, ephemeral: true });
    } else {
      await message.reply("Not playing in this server!");
    }
  }
}

module.exports = LeaveCommand;
