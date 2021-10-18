const { Command } = require("@sapphire/framework");
const { Message } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
// add adapter.js
const createDiscordJSAdapter = require("../../helpers/audio/adapter");
const config = require("./../../config.json");
const parsedArgs = require("../../helpers/parsers/extractargs");

const underageSoundPath = "underage.mp3";

// function Play(connection, soundPath) {
//   try {
//     const dispatcher = connection.play(soundPath);
//     dispatcher.on("finish", (finish) => {
//       connection.disconnect();
//     });
//   } catch (error) {
//     console.log(error);
//     connection.disconnect();
//   }
// }

function playSong(soundPath, player) {
  const resource = createAudioResource(soundPath, {
    inputType: StreamType.Arbitrary,
  });

  player.play(resource);

  return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

async function connectToChannel(voiceChannel) {
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

class VoiceCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "voice",
      group: "voice",
      memberName: "voice",
      description: "play sound in voice channel based on parameters",
      guildOnly: true,
    });
  }

  /**
   *
   * @param {Message} message
   * @param {*} args
   * @returns
   */
  async messageRun(message, args) {
    args = parsedArgs(args);
    // let serverQueue = global.queue.get(message.guild.id);
    // if (serverQueue && serverQueue.songs > 0) {
    //   return message.channel.send(
    //     "already shit playing bruh: " + serverQueue.songs[0].title
    //   );
    // }
    let soundPath = config.mp3Paths[args];
    if (soundPath != null) {
      var voiceChannel = message.member.voice.channel;
      if (voiceChannel) {
        try {
          var player = createAudioPlayer({
            debug: true,
            behaviors: { noSubscriber: "paused" },
          });
          await playSong(underageSoundPath, player);
          const connection = await connectToChannel(voiceChannel);
          var sub = connection.subscribe(player);
          sub.player.on("error", (error) => {
            console.log(error);
            connection.disconnect();
          });
        } catch (error) {
          console.log(error);
          return message.channel.send("error playing " + args);
        }
      } else {
        message.reply("You must be in a voice channel to summon me!");
      }
    } else {
      message.reply("voice " + args + " was not found");
    }
  }
}

module.exports = VoiceCommand;
