const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Redémarre le bot (Heroku)'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const ownerId = process.env.OWNER_ID;

    if (userId !== ownerId) {
      return interaction.reply({ content: '❌ Tu n\'as pas la permission d\'utiliser cette commande.', ephemeral: true });
    }

    await interaction.reply('⏳ Redémarrage du bot en cours...');

    const appName = process.env.HEROKU_APP_NAME;
    const apiKey = process.env.HEROKU_API_KEY;

    try {
      // On met le dyno à 0 (arrêt)
      await fetch(`https://api.heroku.com/apps/${appName}/formation`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.heroku+json; version=3',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify([{ type: 'web', quantity: 0 }])
      });

      // Puis on le remet à 1 (démarrage)
      const res = await fetch(`https://api.heroku.com/apps/${appName}/formation`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.heroku+json; version=3',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify([{ type: 'web', quantity: 1 }])
      });

      if (!res.ok) throw new Error(`Erreur Heroku: ${res.statusText}`);

      await interaction.editReply('✅ Bot redémarré avec succès !');
    } catch (error) {
      console.error('Erreur lors du redémarrage Heroku :', error);
      await interaction.editReply('❌ Une erreur est survenue lors du redémarrage du bot.');
    }
  }
};
