
const GuildModel = require('../models/GuildModel');

const DEFAULT_VOLUME = 50;


class GuildVolume {
    static UpdateVolume(guildId, newVolume, callback) {
        try {
            GuildModel.findOne()
              .where("GuildId").equals(guildId)
              .then((doc) => {
                if (!doc) {
                    var newGuild = new GuildModel({
                        GuildId: guildId,
                        Volume: newVolume
                      })
                    newGuild.save(function(err){
                        if(err){
                            console.error(err)
                        } else {
                            console.log('Added new Guild: ' + newGuild.GuildId);
                            return callback(newGuild);
                        }
                    });
                } else {
                    doc.Volume = newVolume;
                    doc.save((err) => {
                        if(err){
                            console.error(err);
                        } else{
                            return callback(doc);
                        }
                    })
                }
              });
        } catch(err){
            console.error(err)
        }
      }
    
      static async GetVolume(guildId) {
          try {
              return new Promise((resolve, reject) => {
                GuildModel.findOne()
                .where(guildId)
                .then((doc) => {
                    if(doc){
                        resolve(doc.Volume);
                    } else{
                        console.log("using default volume for guildId: " + guildId);
                        resolve(DEFAULT_VOLUME);
                    }
                })
              })
              
          } catch (err) {
              console.error(err);
          }
      }
    
}
 
  module.exports = GuildVolume;