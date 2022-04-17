const { Command } = require("@sapphire/framework");
const config = require("../../config.json");
const parsedArgs = require("../../helpers/parsers/extractargs");

class TalkListCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "talklist",
      group: "talk",
      memberName: "talklist",
      description:
        "lists the text to speech voices that can be set using the SetTalkVoice command",
    });
  }

  //TODO: change name of command and how it lists out the sounds
  async messageRun(message, args) {
    var talkListString = "";
    var number = 1;
    for (var talkVoice in config.talkList) {
      talkListString += number + ". " + talkVoice + "\n";
      number++;
    }
    message.channel.send(talkListString);
  }
}

module.exports = TalkListCommand;
