const commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const haloApi = require("../../helpers/halo/haloApi");

class HaloStatsCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: "halostats",
      group: "games",
      memberName: "halostats",
      description: "Shows you your Halo Infinite stats!",
    });
  }

  //TODO: delete from bot but keep as a template for future commands
  async run(message, args) {
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
  embed
    .setTitle(additional.gamertag + "'s Halo Stats")
    .setColor(0x00ae86)
    .setThumbnail(playerInfo.backdrop_image_url)
    .setImage(playerInfo.emblem_url)
    .addField("Kills", data.summary.kills, true)
    .addField("Deaths", data.summary.deaths, true)
    .addField("Assists", data.summary.assists, true)
    .addField("Betrayals", data.summary.betrayals, true)
    .addField("Suicides", data.summary.suicides, true)
    .addField("Vehicles Destryoed", data.summary.vehicles.destroys, true)
    .addField("Vehicles hijacked", data.summary.vehicles.hijacks, true)
    .addField("Medals", data.summary.medals, true)
    .addField("Damage Taken", data.damage.taken, true)
    .addField("Damage Dealt", data.damage.dealt, true)
    .addField("Average Damage per match", data.damage.average, true)
    .addField("Shots Fired", data.shots.fired, true)
    .addField("Shots Landed", data.shots.landed, true)
    .addField("Shots Missed", data.shots.missed, true)
    .addField(
      "Total Accuracy",
      Math.round((data.shots.accuracy + Number.EPSILON) * 100) / 100 + "%",
      true
    )
    .addField("Melee Kills", data.breakdowns.kills.melee, true)
    .addField("Grenade Kills", data.breakdowns.kills.grenades, true)
    .addField("Headshot kills", data.breakdowns.kills.headshots, true)
    .addField("Power Weapon Kills", data.breakdowns.kills.power_weapons, true)
    .addField("Total Wins", data.breakdowns.matches.wins, true)
    .addField("Total Losses", data.breakdowns.matches.losses, true)
    .addField("Total Matches Left", data.breakdowns.matches.left, true)
    .addField(
      "KDA (Kill/Death/Assist)",
      Math.round((data.kda + Number.EPSILON) * 100) / 100,
      true
    )
    .addField("KDR", Math.round((data.kdr + Number.EPSILON) * 100) / 100, true)
    .setTimestamp();

  return embed;
}

module.exports = HaloStatsCommand;
