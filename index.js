// Load up the discord.js library
const path = require("path");
// const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const { SapphireClient } = require("@sapphire/framework");
// const sqlite = require("sqlite");
// const sqlite3 = require("sqlite3");
const tok = require("./helpers/commandless/tok");

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
  presence: {
    activity: {
      name: "to butts",
      type: "LISTENING",
    },
  },
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
});

// @ts-ignore
sapphireClient.on("error", console.error);

// @ts-ignore
sapphireClient.on("guildCreate", (guild) => {
  console.log(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
  );
});

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

// bot.on("message", async message => {
//   // This event will run on every single message received, from any channel or DM.

//   // It's good practice to ignore other bots. This also makes your bot ignore itself
//   // and not get into a spam loop (we call that "botception").
//   if(message.author.bot) return;

//   // Also good practice to ignore any message that does not start with our prefix,
//   // which is set in the configuration file.
//   if(message.content.indexOf(config.prefix) !== 0) return;

//   // Here we separate our "command" name, and our "arguments" for the command.
//   // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
//   // command = say
//   // args = ["Is", "this", "the", "real", "life?"]
//   const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
//   const command = args.shift().toLowerCase();
//   });
sapphireClient.login(_config.token);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
