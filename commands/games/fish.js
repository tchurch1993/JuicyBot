const commando = require("discord.js-commando");
const mongoose = require("mongoose");
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
    this.ValidateAndAddUser(message.member, function(user){
        console.log(user)
        
        if(user){
            message.channel.send(user.get("UserId"));
        } else {
            message.channel.send("shit broke")
        }
    });
    
    

  }

  ValidateAndAddUser(member, callback) {
    try {
        UserModel.findOne()
          .where("GuildId").equals(member.guild.id)
          .where("UserId").equals(member.id)
          .then((doc) => {
              console.log('inside then')
            if (!doc) {
                console.log('found no doc')
                var newUser = new UserModel({
                    UserId: member.id,
                    GuildId: member.guild.id,
                  })
                newUser.save(function(err){
                    console.log('inside save of new doc')
                    if(err){
                        console.error(err)
                    } else {
                        console.log('returning new doc')
                        return callback(newUser)
                    }
                });
            } else {
                console.log('found and returning doc')
                return callback(doc)
            }
          });
    } catch(err){
        console.error(err)
    }
  }
}

module.exports = FishCommand;
