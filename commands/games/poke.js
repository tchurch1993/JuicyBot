const { Command } = require("@sapphire/framework");

class PokeCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "poke",
      group: "games",
      memberName: "poke",
      description: "poke your friends!",
      ownerOnly: true,
    });
  }

  //TODO: flesh out the idea or delete entirely
  async run(message, args) {
    var poker = message.author;
    var pokee = message.mentions.users.first();

    var pokerAvatarURL = poker.avatarURL();
    var pokeeAvatarURL = pokee.avatarURL();

    console.log(`poker: ${pokerAvatarURL}`);
    console.log(`pokee: ${pokeeAvatarURL}`);

    message.channel.send(pokeeAvatarURL);
  }
}

module.exports = PokeCommand;
