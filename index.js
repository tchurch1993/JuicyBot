// Load up the discord.js library
const path = require("path");

const { SapphireClient } = require("@sapphire/framework");
const tok = require("./helpers/commandless/tok");
const GuildPrefix = require("./database/helpers/guildPrefix");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

//ping server
app.get("/", (req, res) => {
  res.send("pong");
});

// Here we load the config.json file that contains our token and our prefix values.

// config.token contains the bot's token
// config.prefix contains the message prefix.
const _config = require("./config.json");

const mongoose = require("mongoose");

mongoose.connect(_config.mongoDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

var event = db.once("open", function () {
  console.log("db connected: " + db.name);
});

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const sapphireClient = new SapphireClient({
  defaultPrefix: _config.prefix,
  baseUserDirectory: __dirname,
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "DIRECT_MESSAGES",
    "GUILD_MESSAGES",
    "GUILD_VOICE_STATES",
  ],
});

// var sqlite3path = path.join(__dirname, "settings.sqlite3");
// // @ts-ignore
// sqlite.open({ filename: sqlite3path, driver: sqlite3.Database }).then((db) => {
//   client.setProvider(new SQLiteProvider(db));
// });

//TODO: do something with the activity that shows on the bot
// @ts-ignore

sapphireClient.once("ready", () => {
  console.log("Sapphire is ready!");
  sapphireClient.user.setActivity(
    `${_config.prefix}help / @JuicyBot help | ${sapphireClient.guilds.cache.size} servers`,
    {
      type: "PLAYING",
    }
  );
});

// @ts-ignore
sapphireClient.on("error", console.error);

// @ts-ignore
sapphireClient.on("guildCreate", (guild) => {
  console.log(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
  );
});

sapphireClient.fetchPrefix = async (message) => {
  var prefix = await GuildPrefix.GetPrefix(message.guild.id);
  return prefix;
};

// @ts-ignore
sapphireClient.on("guildDelete", (guild) => {
  // this event triggers when the bot is removed from a guild.
  // TODO: Delete guild from DB
  // @ts-ignore
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

// @ts-ignore

sapphireClient.on("disconnect", (event) => {
  console.log(event);
  sapphireClient.login(_config.token);
});

if (_config.tokEnabled) {
  // @ts-ignore

  sapphireClient.on("messageCreate", async (message) => {
    tok(message, sapphireClient);
  });
}

// @ts-ignore
global.currentTeamMembers = [];
// @ts-ignore
global.queue = new Map();
global.subscriptions = new Map();
// @ts-ignore
global.servers = {};

sapphireClient.login(_config.token);

app.listen(port, () => {
  console.log(`Juicy app listening at http://localhost:${port}`);
});
