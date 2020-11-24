const commando = require("discord.js-commando");
const audioHelper = require("../../helpers/audio/audio");
const fs = require("fs");
const {
    MessageAttachment
} = require("discord.js");
let hasLeft;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

class RecordCommand extends commando.Command {
    constructor(bot) {
        super(bot, {
            name: "record",
            group: "voice",
            memberName: "record",
            description: "Records your voice!",
            guildOnly: true,
        });
    }

    async run(message, args) {
        hasLeft = false;
        try {

            let connection = await message.member.voice.channel.join();
            let audio = connection.receiver.createStream(message.member, {
                mode: "pcm",
            });





            let chunks = [];

            audio.on("error", (error) => {
                message.member.voice.channel.leave();
                console.error(error);
            })

            audio.on("data", (chunk) => {
                chunks.push(chunk);
            });

            audio.on("end", () => {
                //message.member.voice.channel.leave();
                hasLeft = true;
                let buffer = Buffer.concat(chunks);

                let result = audioHelper.rawToWav(buffer);
                let fileName = args || "clip";
                const attachment = new MessageAttachment(result, fileName + ".wav");
                message.channel.send(attachment);

            })

            this.recordTimeout(audio, message);

        } catch (error) {
            console.error(error);
            message.member.voice.channel.leave();
        }

    }

    recordTimeout(audio, message) {
        setTimeout(() => {
            if (audio.readableEnded === false) {
                this.recordTimeout(audio, message);
                return;
            }
            if (!hasLeft) {
                message.member.voice.channel.leave();
            }
        }, 15000);
    }
}

module.exports = RecordCommand;