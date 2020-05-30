''

const commando = require('discord.js-commando');
const fetch = require('node-fetch');
const http = require('http');
const config = require("./../../config.json");

class IPCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'ip',
            group: 'simple',
            memberName: 'ip',
            description: 'grabs ip address of the server'
        })
    }

    async run(message, args){
        if(config.whiteList.includes(message.author.id)){
            http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp){
                resp.on('data', function(ip){
                    console.log("My Public IP address is: " + ip);
                    message.author.send("The IP is " + ip + ":25565").then(message => console.log('Sent message: ${message.content}'))
                        .catch(console.error);
                })
            })
        }
    }
}

module.exports = IPCommand;