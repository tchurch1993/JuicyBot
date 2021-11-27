const { Args, Command, CommandContext } = require("@sapphire/framework");
const parsedArgs = require("../../helpers/parsers/extractargs");
const { GuildMember } = require("discord.js");
const {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const MusicSubscription = require("../../helpers/audio/music_subscription.js");
const Track = require("../../helpers/audio/track");

class PlayCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "play",
      description: "plays music from a youtube link!",
    });
  }

  async messageRun(message, args) {
    let subscription = global.subscriptions.get(message.guildId);
    args = parsedArgs(args);
    // Extract the video URL from the command
    const url = args;

    // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
    // and create a subscription.
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

    // If there is no subscription, tell the user they need to join a channel.
    if (!subscription) {
      await message.reply("Join a voice channel and then try that again!");
      return;
    }

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
    }

    try {
      // Attempt to create a Track from the user's video URL
      const track = await Track.from(url, {
        onStart() {
          // message
          //   .reply({ content: "Now playing!", ephemeral: true })
          //   .catch(console.warn);
        },
        onFinish() {
          console.log("test");
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
      subscription.playNextTrack = true;
      // Enqueue the track and reply a success message to the user
      subscription.enqueue(track);
      await message.reply(`Enqueued **${track.title}**`);
    } catch (error) {
      console.warn(error);
      await message.reply("Failed to play track, please try again later!");
    }
  }
}

module.exports = PlayCommand;
