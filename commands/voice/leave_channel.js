const { Command } = require("@sapphire/framework");

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

  async run(message, args) {
    try {
      message.member.voice.channel.leave();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = LeaveChannelCommand;
