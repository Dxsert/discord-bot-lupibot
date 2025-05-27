// commands/restart.js
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { updateStatus } = require("../path/to/statusUpdater");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Redémarre le bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    try {
      if (interaction.user.id !== process.env.OWNER_ID) {
        return interaction.reply({
          content: "❌ Tu n'es pas autorisé à redémarrer le bot.",
          ephemeral: true,
        });
      }

      await interaction.reply({
        content: "♻️ Redémarrage du bot en cours...",
        ephemeral: true,
      });

      // Met le statut "RESTARTING" AVANT de quitter
      await interaction.client.user.setActivity("RESTARTING", {
        type: ActivityType.Watching,
      });

      console.log("♻️ Le bot va redémarrer maintenant.");
      // Donne un petit délai pour que le statut soit bien mis à jour sur Discord
      setTimeout(() => {
        process.exit(0);
      }, 1500); // 1.5 seconde, tu peux ajuster si besoin
    } catch (error) {
      console.error("Erreur dans la commande restart :", error);
      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ Une erreur est survenue lors du redémarrage.",
          ephemeral: true,
        });
      }
    }
  },
};
