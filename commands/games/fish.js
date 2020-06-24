const commando = require("discord.js-commando");
const mongoose = require("mongoose");
const ValidateAndAddUser = require("../../database/helpers/userValidation");
const UserModel = require('../../database/models/UserModel')

class FishCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: "fish",
      group: "games",
      memberName: "fish",
      description: "catch some fish!",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    ValidateAndAddUser(message.member, function(user){
        console.log(user)
        
        if(user){
            message.channel.send(user.get("UserId"));
        } else {
            message.channel.send("shit broke")
        }
    });
    
    

  }
}

module.exports = FishCommand;
