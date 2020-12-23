const commando = require("discord.js-commando");
const {
  MessageAttachment
} = require("discord.js");
const fs = require("fs");
const $ = require("cheerio");
const puppeteer = require("puppeteer");
const request = require("request");
const TTDOWNLOADER_LINK = "https://ttdownloader.com/?url=";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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

      puppeteer
        .launch()
        .then(function (browser) {
          return browser.newPage();
        })
        .then(async function (page) {
          await page.goto(TTDOWNLOADER_LINK + args);
          
          //TODO: find a better way than to wait 10 seconds....Ultimatley would like to not use TTDownloader and find my own way tho.
          await delay(10000);
          var html = await page.content();
          var pupObject = {
            html: html,
            browser: page.browser()
          };
          return pupObject;
        })
        .then(async function (pupObject) {
          var html = pupObject.html;
          var videoElement = $("a.download-link", html);

          if (videoElement) {
            var videoLink = videoElement[0].attribs.href;

            var requestOptions = { url: videoLink, encoding: null };
            request(requestOptions, (err, response, body) => {

              if (err) { return };

              const attachment = new MessageAttachment(body, filename);

              message.channel.send(attachment);
            })

          } else {
            console.log("could not find video link for: " + args);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = TokCommand;