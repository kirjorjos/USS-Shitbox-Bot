const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client({ intents: [
   Discord.GatewayIntentBits.Guilds,
   Discord.GatewayIntentBits.GuildMessages, 
   Discord.GatewayIntentBits.GuildMembers,
   Discord.GatewayIntentBits.MessageContent  
]});
bot.slashCommands = new Discord.Collection();
bot.commandPermissions = new Discord.Collection();
bot.database = new replitDatabase;
bot.loadSlashCommands = require("./commandHandlers/loadSlash.js");
bot.loadSlashCommands.run(bot);
bot.on('ready', () => {
  require("./registerSlash.js")(bot);
  console.log(`Logged in as ${bot.user.tag}!`);
});
bot.on('interactionCreate', async interaction => {
  require('./commandHandlers/runSlash.js')(interaction, bot, Discord);
});
bot.login(require("./config.json").token || process.env.token);