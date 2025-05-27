const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch'); // Import obligatoire si Node < 18

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Redémarre le bot (Heroku)'),

  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({ content: '❌ Tu n\'as pas la permission.', ephemeral: true });
    }

    await interaction.reply('⏳ Redémarrage du bot en cours...');

    const appName = process.env.HEROKU_APP_NAME;
    const apiKey = process.env.HEROKU_API_KEY;

    try {
      // Met le dyno à 0 (arrêt)
      await fetch(`https://api.heroku.com/apps/${appName}/formation`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.heroku+json; version=3',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ updates: [{ type: 'web', quantity: 0 }] }),
      });

      // Puis remet à 1 (démarrage)
      const res = await fetch(`https://api.heroku.com/apps/${appName}/formation`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.heroku+json; version=3',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ updates: [{ type: 'web', quantity: 1 }] }),
      });

      if (!res.ok) throw new Error(`Erreur Heroku: ${res.statusText}`);

      await interaction.editReply('✅ Bot redémarré avec succès !');
    } catch (error) {
      console.error('Erreur lors du redémarrage Heroku :', error);
      await interaction.editReply('❌ Une erreur est survenue lors du redémarrage du bot.');
    }
  }
};
