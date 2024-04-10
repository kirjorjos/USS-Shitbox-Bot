const fs = require('fs');
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = process.env;
const commands = [];
let permissionCommands = [];
module.exports = (bot) => {
  fs.readdirSync("./slashCommands/").forEach(dir => {
    const commandFiles = fs.readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./slashCommands/${dir}/${file}`);
      let commandRaw = {};
      switch(command.type) {
        case "user":
          break;
        case "message":
          commandRaw = new ContextMenuCommandBuilder().setName(file.slice(0, -3));
          break;
        default:
          commandRaw = new SlashCommandBuilder().setName(file.slice(0, -3)).setDescription(command.description);
      }
      commandRaw = (command.builder)?command.builder(commandRaw, bot):commandRaw;
      if (command.permissions){ 
        commandRaw.setDefaultPermission(false);
        permissionCommands[permissionCommands.length] = file.slice(0, -3);
        bot.commandPermissions.set(file.slice(0, -3), command.permissions);
      };
      commandRaw = commandRaw.toJSON();
      commands.push(commandRaw);
    }
  });
  const rest = new REST({ version: '9' }).setToken(token);

  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    } finally {
      if (!bot.application.owner) await bot.application.fetch();
      let commands = await bot.guilds.cache.get(guildId).commands.fetch();
      let commandsFiltered = commands.filter(command => permissionCommands.includes(command.name))
      commandsFiltered.forEach(command => {
        let permissions = bot.commandPermissions.get(command.name);
        command.permissions.add({ permissions });
      })
    }
  })();
}