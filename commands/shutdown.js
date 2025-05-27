const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Arrête le bot (réservé au propriétaire)"),

  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: "Tu n'es pas autorisé à exécuter cette commande.",
        ephemeral: true,
      });
    }

    await interaction.reply("🔌 Le bot va s'éteindre...");
    console.log(`Arrêt demandé par ${interaction.user.tag}`);
    process.exit(0);
  },
};
