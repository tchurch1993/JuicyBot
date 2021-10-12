const { Command } = require("@sapphire/framework");
const mongoose = require("mongoose");
const ValidateAndAddUser = require("../../database/helpers/userValidation");
const UserModel = require("../../database/models/UserModel");

class FishCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "fish",
      group: "games",
      memberName: "fish",
      description: "catch some fish!",
      ownerOnly: true,
    });
  }

  //TODO: delete fish command because i probably wont flesh this out
  async run(message, args) {
    ValidateAndAddUser(message.member, function (user) {
      console.log(user);

      if (user) {
        message.channel.send(user.get("UserId"));
      } else {
        message.channel.send("shit broke");
      }
    });
  }
}

module.exports = FishCommand;
