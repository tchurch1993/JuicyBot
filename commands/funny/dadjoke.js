const { Command } = require("@sapphire/framework");
const { Message } = require("discord.js");
const fetch = require("node-fetch");
const parsedArgs = require("../../helpers/parsers/extractargs");

class DadJokeCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "dadjoke",
      group: "funny",
      memberName: "dadjoke",
      description: "tells hilarious dad jokes. you are welcome",
    });
  }

  /**
   *
   * @param { Message } message
   * @param {string} args
   */
  async messageRun(message, args) {
    try {
      var result = await fetch("https://icanhazdadjoke.com/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      var text = await result.json();

      message.channel.send({ content: text.joke });
    } catch {
      message.channel.send({
        content: "aww shit, somebody took a big ol' poopy",
      });
    }
  }
}

module.exports = DadJokeCommand;
