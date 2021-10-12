const { Command } = require("@sapphire/framework");
const config = require("./../../config.json");

function Play(connection, soundPath) {
  try {
    const dispatcher = connection.play(soundPath);
    dispatcher.on("finish", (finish) => {
      connection.disconnect();
    });
  } catch (error) {
    console.log(error);
    connection.disconnect();
  }
}

class VoiceCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "voice",
      group: "voice",
      memberName: "voice",
      description: "play sound in voice channel based on parameters",
      guildOnly: true,
    });
  }

  async run(message, args) {
    let serverQueue = global.queue.get(message.guild.id);
    if (serverQueue && serverQueue.songs > 0) {
      return message.channel.send(
        "already shit playing bruh: " + serverQueue.songs[0].title
      );
    }
    let soundPath = config.mp3Paths[args];
    if (soundPath != null) {
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
    } else {
      message.reply("voice " + args + " was not found");
    }
  }
}

module.exports = VoiceCommand;
