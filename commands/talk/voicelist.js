const { Command } = require("@sapphire/framework");
const config = require("../../config.json");

class VoiceListCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "voicelist",
      group: "talk",
      memberName: "voicelist",
      description:
        "lists the text to speech voices that can be set using the SetVoice command",
    });
  }

  //TODO: change name of command and how it lists out the sounds
  async run(message, args) {
    var voiceListString = "";
    var number = 1;
    for (var voice in config.voicelist) {
      voiceListString += number + ". " + voice + "\n";
      number++;
    }
    message.channel.send(voiceListString);
  }
}

module.exports = VoiceListCommand;
