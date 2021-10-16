const { Command } = require("@sapphire/framework");
const parsedArgs = require("../../helpers/parsers/extractargs");

class LeaveChannelCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "leave",
      group: "voice",
      memberName: "leave",
      description: "leaves the channel of the commander",
      guildOnly: true,
    });
  }

  async messageRun(message, args) {
    try {
      message.member.voice.channel.leave();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = LeaveChannelCommand;
