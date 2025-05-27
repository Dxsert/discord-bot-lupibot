const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Éteint complètement le bot (Heroku ou process local).'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const ownerId = process.env.OWNER_ID;

    if (userId !== ownerId) {
      return interaction.reply({
        content: '❌ Tu n\'as pas la permission d\'utiliser cette commande.',
        ephemeral: true,
      });
    }

    try {
      await interaction.reply({
        content: '⏳ Arrêt du bot en cours...',
        ephemeral: true,
      });

      // Attendre 1 à 2 secondes pour garantir que le message est bien envoyé
      setTimeout(() => {
        console.log('🛑 Bot éteint via /shutdown');
        process.exit(0); // Stoppe le bot (uniquement si lancé en local ou dyno Heroku classique)
      }, 1500);
    } catch (error) {
      console.error('❌ Erreur dans la commande shutdown :', error);
      if (!interaction.replied) {
        try {
          await interaction.reply({
            content: '❌ Une erreur est survenue.',
            ephemeral: true,
          });
        } catch (e) {
          console.error('Impossible de répondre à l\'interaction.');
        }
      }
    }
  }
};
