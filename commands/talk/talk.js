const commando = require("discord.js-commando");
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const config = require("../../config.json");
const ValidateAndAddUser = require("../../database/helpers/userValidation") 
process.env.GOOGLE_APPLICATION_CREDENTIALS = __dirname + "../../../LinkDump-428fe5f385e2.json";

function Play(connection, soundPath) {
  try {
    const dispatcher = connection.play(fs.createReadStream(soundPath), { type: 'ogg/opus' });
    dispatcher.on("finish", (finish) => {
      connection.disconnect();
      fs.unlinkSync(soundPath);
  });
  } catch (error) {
    console.log(error)
    connection.disconnect();
    fs.unlinkSync(soundPath);
  }
  
}

async function getTextToSpeechPath(text, user) {
  const client = new textToSpeech.TextToSpeechClient();
  const request = {
      input: {text: text},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: user.get('TalkVoice'), ssmlGender: 'MALE'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'OGG_OPUS'},
    };

    console.log(user.get('TalkVoice'))
  
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
      group: "talk",
      memberName: "talk",
      description: "play sound in voice channel based on parameters",
      guildOnly: true,
    });
  }
  
  
  async run(message, args) {
    ValidateAndAddUser(message.member, async function(user){
      console.log(user)



      var soundPath = await getTextToSpeechPath(args, user);
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
  });

  }

  

  
}

module.exports = TalkCommand;
