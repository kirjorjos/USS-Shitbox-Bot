module.exports = {
    description:
        "Get list of all command and even get to know every command detials",
    usage: "help <cmd>",
    aliases: ['h'],
    builder: (command, bot) => {
        command
          .addStringOption(option => {
            option.setName('command')
            .setDescription('what command to get help on')
            .addChoices(...(() => {
              let final = [];
              for (const [key] of bot.slashCommands.entries()) {
                final.push({name: key, value: key})
              }
              return final;
            })())
            return option;
        });
        return command;
    },
    run: async (client, interaction, args, Discord) => {
        args[0] = interaction.options.getString("command");
        if (args[0]) {
            const command = await (client.slashCommands.get(args[0]) || client.slashCommands.get(client.aliases.get(args[0])));
            if (!command) {
                return interaction.reply({content: "Unknown Command: " + args[0], ephemeral: true});
            }

            let embed = new Discord.MessageEmbed()
                .setAuthor(command.name, client.user.displayAvatarURL())
                .addField("Description", command.description || "Not Provided :(")
                .addField("Usage", "`" + command.usage + "`" || "Not Provied")
                .addField("Aliases", (command.aliases) ? ("`" + command.aliases + "`") : ("No aliases."))
                .setThumbnail(client.user.displayAvatarURL())
                .setColor("GREEN")
                .setFooter(client.user.username, client.user.displayAvatarURL());

            return interaction.reply({ embeds: [embed], ephemeral: true});
        } else {
            const commands = await client.slashCommands;
            let emx = new Discord.MessageEmbed()
                .setDescription("All slash commands:")
                .setColor("GREEN")
                .setFooter(client.user.username, client.user.displayAvatarURL())

            let com = {};
            commands.forEach(comm => {
                if (comm.hidden) return;
                let category = comm.category || "Error";
                let name = comm.name;
                if (!com[category]) {
                    com[category] = [];
                }
                com[category].push(name);
            })
            for (const [key, value] of Object.entries(com)) {
                let category = key;
                let desc = "`" + value.join("`, `") + "`";

                emx.addField(`${category.toUpperCase()} [${value.length}]`, desc);
            }

            return interaction.reply({ embeds: [emx], ephemeral: true});
        }
    }
};