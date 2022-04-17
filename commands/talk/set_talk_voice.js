const { Command } = require("@sapphire/framework");
const config = require("../../config.json");
const ValidateAndAddUser = require("../../database/helpers/userValidation");
const extractArgs = require("../../helpers/parsers/extractargs");

class SetTalkVoiceCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "setTalkVoice",
      group: "talk",
      memberName: "setTalkVoice",
      description: "sets the voice for the talk command",
      guildOnly: true,
    });
  }

  //TODO: add a list of accents if their selection does not exist
  async messageRun(message, args) {
    var parsedArgs = extractArgs(args);
    if (config.talkList[parsedArgs] != undefined) {
      ValidateAndAddUser(message.member, (user) => {
        var voice = config.talkList[parsedArgs];
        user.TalkVoice = voice;
        user.save();
        message.channel.send(`Talk voice set to : ${parsedArgs}`);
      });
    } else {
      message.channel.send("sound not found");
    }
  }
}

module.exports = SetTalkVoiceCommand;
