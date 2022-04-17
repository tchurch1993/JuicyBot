const { Command } = require("@sapphire/framework");
const textToSpeech = require("@google-cloud/text-to-speech");
const { Readable } = require("stream");
const ValidateAndAddUser = require("../../database/helpers/userValidation");
const parsedArgs = require("../../helpers/parsers/extractargs");
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  __dirname + "../../../LinkDump-428fe5f385e2.json";
const { getOrCreateSubscription } = require("../../helpers/audio/util");
const Track = require("../../helpers/audio/track");

async function Play(connection, soundBuffer) {
  try {
    const readable = new Readable();
    readable._read = () => {}; // _read is required but you can noop it
    readable.push(soundBuffer);
    readable.push(null);

    const dispatcher = connection.play(readable, {
      type: "ogg/opus",
    });
    dispatcher.on("finish", (finish) => {
      connection.disconnect();
    });
  } catch (error) {
    connection.disconnect();
  }
}

async function getTextToSpeechPath(text, user) {
  const client = new textToSpeech.TextToSpeechClient();
  const request = {
    input: {
      text: text,
    },
    // Select the language and SSML voice gender (optional)
    voice: {
      languageCode: user.get("TalkVoice"),
      ssmlGender: "MALE",
    },
    // select the type of audio encoding
    audioConfig: {
      audioEncoding: "OGG_OPUS",
    },
  };

  console.log(user.get("TalkVoice"));

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

  return response.audioContent;
}
class TalkCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "talk",
      group: "talk",
      memberName: "talk",
      description: "play sound in voice channel based on parameters",
      guildOnly: true,
    });
  }

  async messageRun(message, args) {
    args = parsedArgs(args);
    // let serverQueue = global.queue.get(message.guild.id);
    // if (serverQueue && serverQueue.songs > 0) {
    //   return message.channel.send(
    //     "already shit playing bruh: " + serverQueue.songs[0].title
    //   );
    // }

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

      ValidateAndAddUser(message.member, async (user) => {
        const soundBuffer = await getTextToSpeechPath(args, user);

        const track = await Track.fromBuffer(soundBuffer, {
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
      });
    } else {
      message.reply("You must be in a voice channel to summon me!");
    }
  }
}

module.exports = TalkCommand;
