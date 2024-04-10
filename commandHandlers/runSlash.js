module.exports = (interaction, bot, Discord) => {
  if (!interaction.type == "APPLICATION_COMMAND") return;
	const command = bot.slashCommands.get(interaction.commandName);
	if (!command) return;
	try {
    let args = [];
		command.run(bot, interaction, args, Discord);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}