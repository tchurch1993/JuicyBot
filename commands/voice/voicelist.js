const { Command } = require("@sapphire/framework");
const config = require("./../../config.json");
const parsedArgs = require("../../helpers/parsers/extractargs");

class VoiceListCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "voicelist",
      group: "simple",
      memberName: "voicelist",
      description: "sends DM of list of sounds available",
    });
  }

  //TODO: delete from bot but keep as a template for future commands
  async messageRun(message, args) {
    var voiceListString = "";
    for (var voice in config.mp3Paths) {
      voiceListString += "- " + voice + "\n";
    }
    message.channel.send(voiceListString);
  }
}

module.exports = VoiceListCommand;
