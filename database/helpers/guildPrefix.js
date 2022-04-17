const GuildModel = require("../models/GuildModel");

const DEFAULT_PREFIX = "!";

class GuildPrefix {
  static UpdatePrefix(guildId, newPrefix, callback) {
    try {
      GuildModel.findOne()
        .where("GuildId")
        .equals(guildId)
        .then((doc) => {
          if (!doc) {
            var newGuild = new GuildModel({
              GuildId: guildId,
              Prefix: newPrefix,
            });
            newGuild.save((err) => {
              if (err) {
                console.error(err);
              } else {
                console.log("Added new Guild: " + newGuild.GuildId);
                return callback(newGuild);
              }
            });
          } else {
            doc.Prefix = newPrefix;
            doc.save((err) => {
              if (err) {
                console.error(err);
              } else {
                return callback(doc);
              }
            });
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  static async GetPrefix(guildId) {
    try {
      return new Promise((resolve, reject) => {
        GuildModel.findOne()
          .where(guildId)
          .then((doc) => {
            if (doc) {
              resolve(doc.Prefix);
            } else {
              console.log("using default prefix for guildId: " + guildId);
              resolve(DEFAULT_PREFIX);
            }
          });
      });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = GuildPrefix;
