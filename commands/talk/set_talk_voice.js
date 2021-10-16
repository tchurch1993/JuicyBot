const { Command } = require("@sapphire/framework");
const config = require("../../config.json");
const ValidateAndAddUser = require("../../database/helpers/userValidation");
const parsedArgs = require("../../helpers/parsers/extractargs");

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
    if (config.voicelist[args] != undefined) {
      ValidateAndAddUser(message.member, (user) => {
        var voice = config.voicelist[args];
        user.TalkVoice = voice;
        user.save();
        message.channel.send(`Talk voice set to : ${args}`);
      });
    } else {
      message.channel.send("sound not found");
    }
  }
}

module.exports = SetTalkVoiceCommand;
