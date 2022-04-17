const { Command } = require("@sapphire/framework");
const extractArgs = require("../../helpers/parsers/extractargs");

class SayCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "say",
      group: "simple",
      memberName: "say",
      description: "Repeats what you typed back at you!",
    });
  }

  //TODO: delete from bot but keep as a template for future commands
  async messageRun(message, args) {
    var parsedAgrs = extractArgs(args);
    if (parsedAgrs.length > 0) {
      message.channel.send(parsedAgrs);
    } else {
      return;
    }
  }
}

module.exports = SayCommand;
