const { GuildMember } = require("discord.js");
const { joinVoiceChannel, VoiceConnectionState } = require("@discordjs/voice");
const MusicSubscription = require("../../helpers/audio/music_subscription");

function getOrCreateSubscription(message) {
  var subscription = global.subscriptions.get(message.guild.id);

  if (
    !subscription ||
    subscription.voiceConnection.state.status == "destroyed" ||
    subscription.voiceConnection.state.status == "disconnected"
  ) {
    if (message.member instanceof GuildMember && message.member.voice.channel) {
      const channel = message.member.voice.channel;
      subscription = new MusicSubscription(
        joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        })
      );
      subscription.voiceConnection.on("error", console.warn);
      global.subscriptions.set(message.guildId, subscription);
    }
  }
  return subscription;
}

module.exports = { getOrCreateSubscription };
