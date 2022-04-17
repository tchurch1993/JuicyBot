const { Command } = require("@sapphire/framework");
const { Message } = require("discord.js");
const fs = require("fs");
const { entersState, VoiceConnectionStatus } = require("@discordjs/voice");
// add adapter.js
const config = require("./../../config.json");
const parsedArgs = require("../../helpers/parsers/extractargs");
const Track = require("../../helpers/audio/track");
const { getOrCreateSubscription } = require("../../helpers/audio/util");

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

    let soundPath = config.mp3Paths[args];

    if (soundPath != null) {
      // create file buffer from path
      let fileBuffer = fs.readFileSync(soundPath);
      var voiceChannel = message.member.voice.channel;

      if (voiceChannel) {
        var subscription = getOrCreateSubscription(message);

        var connectionState = subscription.voiceConnection.state;
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

        const track = await Track.fromBuffer(fileBuffer, {
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
