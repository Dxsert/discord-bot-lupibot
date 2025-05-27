const { SlashCommandBuilder, InteractionResponseFlags } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Redémarre le bot via Heroku'),

  async execute(interaction) {
    const ownerId = process.env.OWNER_ID;
    const herokuApiKey = process.env.HEROKU_API_KEY;
    const appName = process.env.HEROKU_APP_NAME;

    if (interaction.user.id !== ownerId) {
      return interaction.reply({
        content: '❌ Tu n\'as pas la permission d\'utiliser cette commande.',
        flags: InteractionResponseFlags.Ephemeral
      });
    }

    await interaction.reply({
      content: '♻️ Redémarrage du bot via Heroku...',
      flags: InteractionResponseFlags.Ephemeral
    });

    try {
      const response = await fetch(`https://api.heroku.com/apps/${appName}/dynos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.heroku+json; version=3',
          'Authorization': `Bearer ${herokuApiKey}`
        }
      });

      if (!response.ok) {
        console.error(`❌ Erreur API Heroku : ${response.statusText}`);
      } else {
        console.log('✅ Redémarrage Heroku demandé avec succès');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la tentative de redémarrage :', error);
    }
  }
};
