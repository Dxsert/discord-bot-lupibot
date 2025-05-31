// Anti-serveurs non whitelisted
const { WHITELISTED_GUILDS } = require("../config.js");

module.exports = {
  name: "guildCreate",
  once: false,
  execute: (guild) => {
    if (!WHITELISTED_GUILDS.includes(guild.id)) {
      console.log(
        `❌ Serveur non autorisé : ${guild.name} (${guild.id}). Déconnexion...`
      );
      guild.leave().catch(console.error);
    }
  },
};
