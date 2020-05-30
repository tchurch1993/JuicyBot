const commando = require("discord.js-commando");
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const config = require("./../../config.json");
process.env.GOOGLE_APPLICATION_CREDENTIALS = "E:\\Dev projects\\JuicyBot\\LinkDump-428fe5f385e2.json";

function Play(connection, soundPath) {
  try {
    const dispatcher = connection.play(fs.createReadStream(soundPath), { type: 'ogg/opus' });
    dispatcher.on("finish", (finish) => {
      connection.disconnect();
  });
  } catch (error) {
    console.log(error)
    connection.disconnect();
  }
  
}

function sleep(millisecondsToWait) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + millisecondsToWait) {
    /* do nothing; this will exit once it reaches the time limit */
    /* if you want you could do something and exit */
  }
}

async function getTextToSpeechPath(text) {
  const client = new textToSpeech.TextToSpeechClient();
  const request = {
      input: {text: text},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'OGG_OPUS'},
    };
  
    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    var date = new Date();
    var fileName = date.getTime() + '.ogg';
    var FilePath = __dirname + '/' + fileName;
    console.log(FilePath)
    await writeFile(FilePath, response.audioContent, 'binary');
    console.log('Audio content written to file:' + fileName);
    return FilePath;
  }
class TalkCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: "talk",
      group: "voice",
      memberName: "talk",
      description: "play sound in voice channel based on parameters",
    });
  }
  
  
  async run(message, args) {
    var soundPath = await getTextToSpeechPath(args);
    if (message.member.voice.channel) {
      if (!message.guild.voiceConnection) {
        message.member.voice.channel
          .join()
          .then((connection) => {
            Play(connection, soundPath);
          })
          .catch(console.error);
      }
    } else {
      message.reply("You must be in a voice channel to summon me!");
    }
  }

  

  
}

module.exports = TalkCommand;
