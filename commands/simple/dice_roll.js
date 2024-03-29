const { Command } = require("@sapphire/framework");
const parsedArgs = require("../../helpers/parsers/extractargs");

class DiceRollCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "roll",
      group: "simple",
      memberName: "roll",
      description: "Roll a 6 sided dice",
    });
  }
  //TODO: add more dice with different number of sides
  async messageRun(message, args) {
    var diceRoll = Math.floor(Math.random() * 6) + 1;
    message.reply("Your dice landed on " + diceRoll);
  }
}

module.exports = DiceRollCommand;
