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
const MusicSubscription = require("../../helpers/audio/music_subscription");
const Track = require("../../helpers/audio/track");

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
        var subscription = global.subscriptions.get(message.guild.id);
        if (!subscription) {
          if (
            message.member instanceof GuildMember &&
            message.member.voice.channel
          ) {
            const channel = message.member.voice.channel;
            subscription = new MusicSubscription(
              joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
              })
            );
            subscription.voiceConnection.on("error", console.warn);
            global.subscriptions.set(message.guildId, subscription);
          }
        }

        var connectionState = subscription.voiceConnection.state();
        if (
          !subscription.readyLock &&
          (connectionState.status === "connecting" ||
            connectionState.status === "signalling")
        ) {
          subscription.readyLock = true;

          // Make sure the connection is ready before processing the user's request
          try {
            await entersState(
              subscription.voiceConnection,
              VoiceConnectionStatus.Ready,
              20e3
            );
          } catch (error) {
            console.warn(error);
            await message.reply(
              "Failed to join voice channel within 20 seconds, please try again later!"
            );
            return;
          } finally {
            subscription.readyLock = false;
          }
        }

        const track = await Track.fromFile(soundPath, {
          onStart() {
            // message
            //   .reply({ content: "Now playing!", ephemeral: true })
            //   .catch(console.warn);
          },
          onFinish() {
            return false;
            // message
            //   .reply({ content: "Now finished!", ephemeral: true })
            //   .catch(console.warn);
          },
          onError(error) {
            console.warn(error);
            // message
            //   .reply({ content: `Error: ${error.message}`, ephemeral: true })
            //   .catch(console.warn);
          },
        });
        subscription.play(track);
      } else {
        message.reply("You must be in a voice channel to summon me!");
      }
    } else {
      message.reply("voice " + args + " was not found");
    }
  }
}

module.exports = VoiceCommand;
