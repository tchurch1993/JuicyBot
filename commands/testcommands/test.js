const commando = require('discord.js-commando');
const fetch = require('node-fetch');

class TestCommand extends commando.Command {
    constructor(bot){
        super(bot,{
            name: 'test',
            group: 'testcommands',
            memberName: 'test',
            description: 'Just a testy test commandy command',
            ownerOnly: true,
        })
    }

    async run(message, args){
       
            // const { file } = await fetch('https://discordapp.com/api/channels/' + message.channel.id +'/pins')
            // .then(Response => Response.json())
            // .catch(console.log('error i guess'));
            // console.log('https://discordapp.com/api/channels/' + message.channel.id +'/pins');
            imgur.setClientId('b4f5475698fd8fa')
            var optionalParams = {sort: 'top', dateRange: 'week', page: 1}
            imgur.search(args, optionalParams).then(json => {
                console.log(json)
            })
            .catch(err => {
                console.error(err)
            })
            //message.channel.send(file);

}
}
module.exports = TestCommand;