const config = require('../../config.json')
const TokCommand = require('../../commands/video/tiktok_conversion')

module.exports = function tok(message, bot){

    if(message.author.bot) return;
    let args = message.content;

    let url

    try {
        url = new URL(args);
    } catch (_) {
        return;
    }




        if(args.includes("vm.tiktok.com") || args.includes("www.tiktok.com")){
            let command = new TokCommand(bot)
            command.run(message, message.content)
        }

}

// function validURL(str) {
//     let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//       '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//       '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//       '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//       '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//       '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//     return !!pattern.test(str);
// };