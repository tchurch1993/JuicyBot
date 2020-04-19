const commando = require('discord.js-commando');
const config = require("./../../config.json");
const HolidayAPI = require('node-holidayapi');
const hapi = new HolidayAPI(config.HolidayAPIKey).v1;

class HolidayCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'holiday',
            group: 'holiday',
            memberName: 'holidayt',
            description: 'displays what holiday is on that day'
        })
    }

    async run(message, args){
        var date = new Date();
        var parameters = {
            "country": 'US',
            "year": date.getFullYear()-1,
            "month": date.getMonth(),
            "day": date.getDay()
        }
        hapi.holidays(parameters, function(err, data){
            if(err != null) console.log(err);
            console.log(data.holidays.length);
            if (data.holidays.size > 0) {
                try{
                    message.say(data.holidays[0].name);
                } catch(err){
                    console.log(err)
                }
            } else {
                message.say("sorry, no official holiday today.  Happy Holidays!")
            }

            
        })
    }
}


module.exports = HolidayCommand;

