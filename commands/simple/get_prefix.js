const { Command } = require("@sapphire/framework");
const GuildPrefix = require("../../database/helpers/guildPrefix");
const extractArgs = require("../../helpers/parsers/extractargs");

class GetPrefixCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "GetPrefix",
      group: "simple",
      memberName: "GetPrefix",
      description: "Gets the prefix for the bot",
    });
  }

  async messageRun(message, args) {
    GuildPrefix.GetPrefix(message.guild.id, (guild) => {
      message.channel.send("prefix is: " + guild.Prefix);
    });
  }
}

module.exports = GetPrefixCommand;
