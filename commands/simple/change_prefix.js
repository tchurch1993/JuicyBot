const { Command } = require("@sapphire/framework");
const GuildPrefix = require("../../database/helpers/guildPrefix");
const extractArgs = require("../../helpers/parsers/extractargs");

class ChangePrefixCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "ChangePrefix",
      group: "simple",
      memberName: "ChangePrefix",
      description: "Changes the prefix for the bot",
    });
  }

  async messageRun(message, args) {
    var parsedAgrs = extractArgs(args);

    if (parsedAgrs) {
      GuildPrefix.UpdatePrefix(message.guild.id, parsedAgrs, (guild) => {
        message.channel.send("prefix changed to: " + guild.Prefix);
      });
    }
  }
}

module.exports = ChangePrefixCommand;
