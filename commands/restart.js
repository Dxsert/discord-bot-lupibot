const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ActivityType } = require("discord.js");
const fetch = require("node-fetch");

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

      // Met le statut "RESTARTING" AVANT de redémarrer
      await interaction.client.user.setActivity("RESTARTING", {
        type: ActivityType.Watching,
      });

      console.log("♻️ Le bot va redémarrer maintenant via Heroku API.");

      // Appel API Heroku pour redémarrer la dyno
      const HEROKU_API_KEY = process.env.HEROKU_API_KEY;
      const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME;

      if (!HEROKU_API_KEY || !HEROKU_APP_NAME) {
        return interaction.followUp({
          content:
            "⚠️ Clé API Heroku ou nom de l'app manquant dans les variables d'environnement.",
          ephemeral: true,
        });
      }

      const response = await fetch(
        `https://api.heroku.com/apps/${HEROKU_APP_NAME}/dynos`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/vnd.heroku+json; version=3",
            Authorization: `Bearer ${HEROKU_API_KEY}`,
          },
        }
      );

      if (response.ok) {
        console.log("✅ Dyno Heroku redémarrée avec succès.");
      } else {
        const text = await response.text();
        console.error(
          "❌ Échec du redémarrage dyno Heroku:",
          response.status,
          text
        );
        await interaction.followUp({
          content: "❌ Impossible de redémarrer la dyno Heroku.",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Erreur dans la commande restart :", error);
      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ Une erreur est survenue lors du redémarrage.",
          ephemeral: true,
        });
      }
    }
    await interaction.client.user.setActivity("RESTARTING", {
      type: ActivityType.Watching,
    });
    setTimeout(() => process.exit(0), 1500);
  },
};
