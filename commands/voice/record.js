const { Command } = require("@sapphire/framework");
const audioHelper = require("../../helpers/audio/audio");
//add discord voice

const fs = require("fs");
const { MessageAttachment } = require("discord.js");
const parsedArgs = require("../../helpers/parsers/extractargs");
let hasLeft;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

class RecordCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "record",
      group: "voice",
      memberName: "record",
      description: "Records your voice!",
      guildOnly: true,
    });
  }

  async messageRun(message, args) {
    args = parsedArgs(args);
    let serverQueue = global.queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.channel.send("You ain't in no voice channel broski");
    }

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT")) {
      return message.channel.send("I ain't got permissions to join bruh");
    }

    if (serverQueue && serverQueue.songs > 0) {
      return message.channel.send(
        "Cannot record as I am already doing shit in the voice channel."
      );
    }

    try {
      let connection = await message.member.voice.channel.join();
      let audio = connection.receiver.createStream(message.member, {
        mode: "pcm",
      });

      let chunks = [];

      audio.on("error", (error) => {
        message.member.voice.channel.leave();
        console.error(error);
      });

      audio.on("data", (chunk) => {
        chunks.push(chunk);
      });

      audio.on("end", () => {
        message.member.voice.channel.leave();
        let buffer = Buffer.concat(chunks);

        let result = audioHelper.rawToWav(buffer);
        let fileName = args || "clip";

        const attachment = new MessageAttachment(result, fileName + ".wav");
        message.channel.send({ files: [attachment] });
      });

      // I thought i needed this timeout and made it for some reason but it seems to work fine without it

      //this.recordTimeout(audio, message);
    } catch (error) {
      console.error(error);
      message.member.voice.channel.leave();
    }
  }

  // recordTimeout(audio, message) {
  //     setTimeout(() => {
  //         if (audio.readableEnded === false) {
  //             console.log("readableEnded is false aparantley, restarting timeout")
  //             this.recordTimeout(audio, message);
  //             return;
  //         }
  //         if (!hasLeft) {
  //             message.member.voice.channel.leave();
  //         }
  //     }, 15000);
  // }
}

module.exports = RecordCommand;
