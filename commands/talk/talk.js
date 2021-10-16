const { Command } = require("@sapphire/framework");
const textToSpeech = require("@google-cloud/text-to-speech");
const { Readable } = require("stream");
const ValidateAndAddUser = require("../../database/helpers/userValidation");
const parsedArgs = require("../../helpers/parsers/extractargs");
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  __dirname + "../../../LinkDump-428fe5f385e2.json";

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
    let serverQueue = global.queue.get(message.guild.id);
    if (serverQueue && serverQueue.songs.length > 0) {
      return message.channel.send(
        "already shit playing bruh: " + serverQueue.songs[0].title
      );
    }

    try {
      ValidateAndAddUser(message.member, async function (user) {
        var soundBuffer = await getTextToSpeechPath(args, user);
        if (message.member.voice.channel) {
          if (!message.guild.voiceConnection) {
            message.member.voice.channel
              .join()
              .then((connection) => {
                Play(connection, soundBuffer);
              })
              .catch(console.error);
          }
        } else {
          message.reply("You must be in a voice channel to summon me!");
        }
      });
    } catch (err) {
      try {
        message.member.voice.channel.leave();
      } catch (error) {
        console.error(error);
      }
    }
  }
}

module.exports = TalkCommand;
