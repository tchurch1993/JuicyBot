const commando = require("discord.js-commando");
const { Attachment } = require("discord.js");
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
      // var doc = new jsdom.JSDOM(this.httpGet(args))
      // var doc = jsdom.implementation.createDocument(args)
      var url;

      puppeteer
        .launch()
        .then(function (browser) {
          return browser.newPage();
        })
        .then(async function (page) {
          await page.goto(args);
          return page.content();
        })
        .then(function (html) {
          var videoUrl = $("video", html)[0].attribs.src;

          request(videoUrl)
            .pipe(fs.createWriteStream(filename))
            .on("close", function () {
              const attachment = new Attachment(filename);
              message.channel.send(attachment).then(function () {
                fs.unlinkSync(filename);
              });
              console.log("done");
            });
          //console.log($('video', html));
        })
        .catch(function (err) {
          console.log(err);
          message.channel.send("something went wrong teehee");
          //handle error
        });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = TokCommand;
