const { Command } = require("@sapphire/framework");
const parsedArgs = require("../../helpers/parsers/extractargs");

class SkipCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "skip",
      group: "music",
      memberName: "skip",
      description: "skips the current song",
      guildOnly: true,
    });
  }

  async messageRun(message, args) {
    try {
      if (!message.member.voice.channel) {
        return message.channel.send(
          "You have to be in a voice channel to stop the music!"
        );
      }

      let serverQueue = global.queue.get(message.guild.id);

      if (!serverQueue) {
        return message.channel.send("There is no song that I could skip!");
      }

      serverQueue.connection.dispatcher.end();
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = SkipCommand;
