const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embedleavetest')
    .setDescription("Simule le départ d'un membre via son ID pour tester l'embed de leave")
    .addStringOption(option =>
      option.setName('userid')
        .setDescription("L'ID de l'utilisateur à simuler comme s'il quittait le serveur")
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.options.getString('userid');

    try {
      // Tente de récupérer l'utilisateur avec l'ID (hors cache)
      const user = await interaction.client.users.fetch(userId).catch(() => null);

      if (!user) {
        return interaction.reply(`❌ Utilisateur avec l'ID \`${userId}\` introuvable.`);
      }

      // Simule un membre "fantôme" pour l'event
      const fakeMember = {
        id: user.id,
        user: user,
        guild: interaction.guild,
        displayName: user.username,
        // Ajoute d'autres propriétés si ton event en a besoin
      };

      const event = require('../events/guildMemberRemove');
      await interaction.reply(`🧪 Simulation du départ de **${user.tag}** (ID: ${user.id})`);
      event.execute(fakeMember, interaction.client);
    } catch (error) {
      console.error('Erreur lors du test de guildMemberRemove :', error);
      await interaction.reply('❌ Une erreur est survenue lors de la simulation.');
    }
  },
};
