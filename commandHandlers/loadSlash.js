const { readdirSync } = require("fs");
module.exports = {
  run: async (bot, message, args, Discord) => {
        readdirSync("./slashCommands/").forEach(dir => {
        const slashCommands = readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of slashCommands) {
          const slashCommand = require(`../slashCommands/${dir}/${file}`)
          if (!slashCommand.disabled) {
            slashCommand.category = dir;
            slashCommand.name = file.slice(0, -3);
            bot.slashCommands.set(file.slice(0, -3), slashCommand);
          }
        }
    });
  }
}