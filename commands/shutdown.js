const { SlashCommandBuilder, InteractionResponseFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Éteint complètement le bot'),

  async execute(interaction) {
    const ownerId = process.env.OWNER_ID;
    if (interaction.user.id !== ownerId) {
      return interaction.reply({
        content: '❌ Tu n\'as pas la permission d\'utiliser cette commande.',
        flags: InteractionResponseFlags.Ephemeral
      });
    }

    await interaction.reply({
      content: '🛑 Bot éteint via /shutdown',
      flags: InteractionResponseFlags.Ephemeral
    });

    process.exit(0); // Arrêt complet du bot
  }
};
