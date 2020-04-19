const commando = require('discord.js-commando');
const {
    Attachment
} = require('discord.js');
const fetch = require('node-fetch')
const fs = require('fs')
const fs2 = require('fs')
const $ = require('cheerio')
const https = require('https');
const {
    JSDOM
} = require("jsdom");
const rp = require('request-promise')
const puppeteer = require('puppeteer')
const request = require('request')
const link = 'https://v16.muscdn.com/167964822cf51d0b131698279565a185/5e9ba530/video/tos/useast2a/tos-useast2a-pve-0068/333b617171244f68bb0182c8d33fa39a/?a=1233&br=3138&bt=1569&cr=0&cs=0&dr=0&ds=3&er=&l=2020041819110101018905603447380B43&lr=tiktok_m&qs=0&rc=M2Z0ajQ8dGo7dDMzOzczM0ApZGU5ODdmNWQzN2U8OThoM2dmaV5uZW5oLzVfLS1iMTZzczMwLTExNi5iNDNiXi5gLzI6Yw%3D%3D&vl=&vr='

class TokCommand extends commando.Command {
    constructor(bot) {
        super(bot, {
            name: 'tok',
            group: 'video',
            memberName: 'tok',
            description: 'makes TikTok links viewable in discord :)'
        })
    }

    async run(message, args) {
        if(!args.includes('tiktok')){
            message.channel.send('yo, this aint no tok')
            return
        }
        try {
            const date = new Date()
            const filename = date.getTime() + '.mp4'
            // var doc = new jsdom.JSDOM(this.httpGet(args))
            // var doc = jsdom.implementation.createDocument(args)
            var url

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
                    var videoUrl = $('video', html)[0].attribs.src
                    
                    request(videoUrl).pipe(fs.createWriteStream(filename)).on('close', function(){
                        const attachment = new Attachment(filename)
                        message.channel.send(attachment).then(function(){fs2.unlinkSync(filename)})
                        console.log('done')
                    });
                    //console.log($('video', html));
                })
                .catch(function (err) {
                    console.log(err)
                    message.channel.send('something went wrong teehee')
                    //handle error
                });

            // https.get(args, function (data) {
            //     var {
            //         statusCode
            //     } = data

            //     let rawData = '';

            //     data.on('data', (chunk) => {
            //         rawData += chunk;
            //         console.log(rawData)
            //     });



            // })
            // var r = request.defaults({
            //     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            //     "accept-encoding": "gzip, deflate, br",
            //     "accept-language": "en-US,en;q=0.9",
            //     "cookie": "tt_webid_v2=6817088564514719237; _ga=GA1.2.1872898191.1587227105; _gid=GA1.2.1565151587.1587227105",
            //     "dnt": 1,
            //     "sec-fetch-dest": "document",
            //     "sec-fetch-mode": "navigate",
            //     "sec-fetch-site": "none",
            //     "upgrade-insecure-requests": 1,
            //     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"
            // })
            // var stream = r(args, function(err, response, body){
            //     console.log(response)
            // })
            //console.log(stream)
            //const test = await fetch(args).then(Response => Response);
            //console.log(test)
            // this.downloadVideo(test.url, "test.mp4", function() {
            //     //console.log(test.url)
            // })
            


        } catch (e) {
            console.log(e)
        }
    }

    
}

module.exports = TokCommand;

// // :authority: m.tiktok.com
// // :method: GET
// // :path: /v/6814088398861602054.html?u_code=d81bb2864gd1al&preview_pb=0&language=en&_d=daieg1bda4m203&timestamp=1587227085&utm_campaign=client_share&app=musically&utm_medium=ios&user_id=6729218199469949957&tt_from=copy&utm_source=copy
// :scheme: https
// accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
// accept-encoding: gzip, deflate, br
// accept-language: en-US,en;q=0.9
// cookie: tt_webid_v2=6817088564514719237; _ga=GA1.2.1872898191.1587227105; _gid=GA1.2.1565151587.1587227105
// dnt: 1
// sec-fetch-dest: document
// sec-fetch-mode: navigate
// sec-fetch-site: none
// upgrade-insecure-requests: 1
// user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36