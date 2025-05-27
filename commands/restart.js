// commands/restart.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Redémarre le bot (Heroku)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: '❌ Tu n\'es pas autorisé à redémarrer le bot.',
        ephemeral: true
      });
    }

    await interaction.reply({
      content: '♻️ Redémarrage du bot en cours...',
      ephemeral: true
    });

    const url = `https://api.heroku.com/apps/${process.env.HEROKU_APP_NAME}/dynos`;
    const herokuResponse = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.HEROKU_API_KEY}`,
        Accept: 'application/vnd.heroku+json; version=3'
      }
    });

    if (herokuResponse.ok) {
      console.log('♻️ Le bot a été redémarré via /restart');
    } else {
      console.error('Erreur lors du redémarrage Heroku :', await herokuResponse.text());
      await interaction.followUp({
        content: '❌ Une erreur est survenue lors du redémarrage.',
        ephemeral: true
      });
    }
  }
};
