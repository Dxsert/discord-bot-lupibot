// commands/shutdown.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Éteint le bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: '❌ Tu n\'es pas autorisé à éteindre le bot.',
        ephemeral: true
      });
    }

    await interaction.reply({
      content: '🛑 Bot éteint via /shutdown',
      ephemeral: true
    });

    console.log('🛑 Le bot a été arrêté via /shutdown');
    process.exit(0);
  }
};
