const commando = require("discord.js-commando");
const TikTokScraper = require("tiktok-scraper")
const { MessageAttachment } = require("discord.js");
const fs = require("fs");
const $ = require("cheerio");
const puppeteer = require("puppeteer");
const request = require("request");

class TokCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: "tok",
      group: "video",
      memberName: "tok",
      description: "makes TikTok links viewable in discord :)",
    });
  }

  async run(message, args) {
    if (!args.includes("tiktok")) {
      message.channel.send("yo, this aint no tok");
      return;
    }
    try {
      const date = new Date();
      const filename = date.getTime() + ".mp4";


      const VideoMetaData = await TikTokScraper.getVideoMeta(args)
      console.log(VideoMetaData.videoUrl);

    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = TokCommand;
