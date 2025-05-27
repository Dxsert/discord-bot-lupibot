const { SlashCommandBuilder } = require('discord.js');
// Si Node < 18 : uncomment la ligne suivante et fais `npm install node-fetch@2`
// const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Arrête le bot sur Heroku'),

  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({ content: '❌ Tu n\'as pas la permission.', ephemeral: true });
    }

    await interaction.reply('⏳ Arrêt du bot en cours...');

    const appName = process.env.HEROKU_APP_NAME;
    const apiKey = process.env.HEROKU_API_KEY;

    try {
      // Met le dyno web à 0 (arrêt complet)
      const res = await fetch(`https://api.heroku.com/apps/${appName}/formation`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.heroku+json; version=3',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ updates: [{ type: 'web', quantity: 0 }] })
      });

      if (!res.ok) throw new Error(`Erreur Heroku: ${res.statusText}`);

      await interaction.editReply('✅ Bot arrêté avec succès sur Heroku.');
    } catch (error) {
      console.error('Erreur lors de l\'arrêt Heroku :', error);
      await interaction.editReply('❌ Erreur lors de l\'arrêt du bot.');
    }
  }
};
