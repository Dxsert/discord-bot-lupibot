const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Répond avec Hello, world!'),
  async execute(interaction) {
    await interaction.reply('Hello, world!');
  }
};
