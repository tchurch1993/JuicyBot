const { Command } = require("@sapphire/framework");
const { MessageEmbed } = require("discord.js");
const haloApi = require("../../helpers/halo/haloApi");
const parsedArgs = require("../../helpers/parsers/extractargs");

class HaloStatsCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "halostats",
      group: "games",
      memberName: "halostats",
      description: "Shows you your Halo Infinite stats!",
    });
  }

  async messageRun(message, args) {
    args = parsedArgs(args);
    try {
      let api = new haloApi(
        "Am8JUOH0QfBIt9FQWwAxFxWnzfNRcZcBzr6T13lUQkQZZqx2ipbCjFSUkqN8l4JF",
        false
      );
      api.getPlayerStats(args).then((data) => {
        try {
          let embedMessage = createPlayerStatsEmbed(data);

          message.channel.send(embedMessage);
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}

function createPlayerStatsEmbed(response) {
  let data = response.data;
  let additional = response.additional;
  let playerInfo = response.playerinfo;
  let embed = new MessageEmbed();
  embed.setTitle(additional.gamertag + "'s Halo Stats");
  embed.setColor(0x00ae86);
  embed.setThumbnail(playerInfo.backdrop_image_url);
  embed.setImage(playerInfo.emblem_url);
  embed.addField("Kills", data.summary.kills, true);
  embed.addField("Assists", data.summary.assists, true);
  embed.addField("Betrayals", data.summary.betrayals, true);
  embed.addField("Suicides", data.summary.suicides, true);
  embed.addField("Vehicles Destryoed", data.summary.vehicles.destroys, true);
  embed.addField("Vehicles hijacked", data.summary.vehicles.hijacks, true);
  embed.addField("Medals", data.summary.medals, true);
  embed.addField("Damage Taken", data.damage.taken, true);
  embed.addField("Damage Dealt", data.damage.dealt, true);
  embed.addField("Average Damage per match", data.damage.average, true);
  embed.addField("Shots Fired", data.shots.fired, true);
  embed.addField("Shots Landed", data.shots.landed, true);
  embed.addField("Shots Missed", data.shots.missed, true);
  embed.addField(
    "Total Accuracy",
    Math.round((data.shots.accuracy + Number.EPSILON) * 100) / 100 + "%",
    true
  );
  embed.addField("Melee Kills", data.breakdowns.kills.melee, true);
  embed.addField("Grenade Kills", data.breakdowns.kills.grenades, true);
  embed.addField("Headshot kills", data.breakdowns.kills.headshots, true);
  embed.addField(
    "Power Weapon Kills",
    data.breakdowns.kills.power_weapons,
    true
  );
  embed.addField("Total Wins", data.breakdowns.matches.wins, true);
  embed.addField("Total Losses", data.breakdowns.matches.losses, true);
  embed.addField("Total Matches Left", data.breakdowns.matches.left, true);
  embed.addField(
    "KDA (Kill/Death/Assist)",
    Math.round((data.kda + Number.EPSILON) * 100) / 100,
    true
  );
  embed.addField(
    "KDR",
    Math.round((data.kdr + Number.EPSILON) * 100) / 100,
    true
  );

  return embed;
}

module.exports = HaloStatsCommand;
