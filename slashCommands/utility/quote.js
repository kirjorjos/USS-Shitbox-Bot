const { ApplicationCommandType } = require("discord.js");
const quotesChannelId = "955850724393242624"
module.exports = {
  description: "Put a message in the quote book",
  usage: "Click on the button in the context menu",
  builder: (command) => {
    return command.setType(ApplicationCommandType.Message);
  },
  type: "message",
  run: async (bot, interaction, args, Discord) => {
    let message = interaction.targetMessage
    let member = (message.member)?message.member:await message.guild.members.fetch(message.author.id);
    let quotesChannel = message.guild.channels.cache.get(quotesChannelId);
    let webhook = await quotesChannel.createWebhook({
    	name: member.displayName,
    	avatar: member.displayAvatarURL(),
    })
    await webhook.send(message.content);
    webhook.delete();
    interaction.reply({content: "Please pretend you never saw this.", empirical: true})
  }
}