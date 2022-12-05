const { Command } = require("@sapphire/framework");
const extractArgs = require("../../helpers/parsers/extractargs");
const { MessageEmbed, Permissions } = require("discord.js");

const EMBED_PERMS = new Permissions([Permissions.FLAGS.EMBED_LINKS]);
class HelpCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "help",
      group: "simple",
      memberName: "help",
      description: "help command to show all commands",
      enabled: false,
    });
    this.bot = bot;
  }

  async messageRun(message, args) {
    var commands = this.container.stores.get("commands");

    message.author.send(commands);
  }
}

module.exports = HelpCommand;
