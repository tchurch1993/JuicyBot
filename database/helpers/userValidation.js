const UserModel = require('../models/UserModel');

module.exports = function ValidateAndAddUser(member, callback) {
    try {
        UserModel.findOne()
          .where("GuildId").equals(member.guild.id)
          .where("UserId").equals(member.id)
          .then((doc) => {
            if (!doc) {
                var newUser = new UserModel({
                    UserId: member.id,
                    GuildId: member.guild.id,
                  })
                newUser.save(function(err){
                    if(err){
                        console.error(err)
                    } else {
                        console.log('Added new User: ' + newUser.UserId + "with GuildId: " + newUser.GuildId);
                        return callback(newUser)
                    }
                });
            } else {
                return callback(doc)
            }
          });
    } catch(err){
        console.error(err)
    }
  }