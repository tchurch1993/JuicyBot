const commando = require("discord.js-commando");
const { MessageAttachment, Message } = require("discord.js");
const fs = require("fs");
const $ = require("cheerio");
const puppeteer = require("puppeteer-extra");
const request = require("request");
const path = require("path");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
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

      puppeteer.use(StealthPlugin());

      puppeteer
        .launch({
          headless: true,
        })
        .then(function (browser) {
          return browser.pages();
        })
        .then(async function (pages) {
          try {
            var page = pages[0];
            await page.setUserAgent(
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36"
            );
            await page.goto(args);

            var html = await page.content();
            var pupObject = {
              html: html,
              browser: page.browser(),
            };
            page.close();
          } catch (error) {
            console.error(error);
          }

          return pupObject;
        })
        .then(async function (pupObject) {
          try {
            var html = pupObject.html;
            var videoElement = $.default("video", html);

            if (videoElement) {
              var videoLink = videoElement[0].attribs.src;

              var requestOptions = {
                url: videoLink,
                encoding: null,
                headers: {
                  referer: args,
                },
              };
              request(requestOptions, (err, response, body) => {
                console.log(response.statusCode);
                // logging size of body buffer
                console.log(body.byteLength);

                if (err) {
                  return;
                }
                // checks to see if the body even contains a video buffer by checking its length
                if (response.statusCode != 200) {
                  return;
                }

                if (body.byteLength > 8000000) {
                  // create the FFmpeg instance and load it
                  const ffmpeg = require("fluent-ffmpeg");
                  ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");

                  //reduce size of video buffer
                  var newBuffer = body.slice(0, 8000000);
                  body = newBuffer;

                  const attachment = new MessageAttachment(body, filename);
                  message.channel.send(attachment);
                } else {
                  const attachment = new MessageAttachment(body, filename);

                  message.channel.send(attachment);
                }
              });
            } else {
              console.log("could not find video link for: " + args);
            }
          } catch (error) {
            console.error(error);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = TokCommand;
