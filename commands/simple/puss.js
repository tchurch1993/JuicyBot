const { Command } = require("@sapphire/framework");
const fetch = require("node-fetch");

class PussCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "puss",
      group: "simple",
      memberName: "puss",
      description: "random picture of cat",
    });
  }

  async run(message, args) {
    try {
      const { file } = await fetch("https://aws.random.cat/meow").then(
        (Response) => Response.json()
      );
      message.channel.send(file);
    } catch (error) {
      console.error(error);
      message.channel.send("sorry bruv, you get no puss");
    }
  }
}

module.exports = PussCommand;
