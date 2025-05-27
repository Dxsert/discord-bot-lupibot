const { Client, GatewayIntentBits, InteractionType, REST, Routes, SlashCommandBuilder } = require('discord.js');
require("dotenv").config();
const fs = require("fs");

// constation des modules
const { updateStatus } = require("./utils/statusUpdater");
const farewellHandler = require("./commands/farewell");
const WHITELISTED_GUILDS = ["757261169151967353", "808836895622037504"];
const { startAutoCheckup, markAsUsed } = require("./utils/autoCheckup");


// Création du client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});

// Commande slash "hello" (déclaration)
const helloCommand = new SlashCommandBuilder()
  .setName('hello')
  .setDescription('Répond avec Hello, world!')
  .toJSON();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🔄 Déploiement de la commande /hello...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [helloCommand] }
    );
    console.log('✅ Commande /hello déployée !');
  } catch (error) {
    console.error('❌ Erreur de déploiement des commandes :', error);
  }
})();

fs.readdirSync("./events").forEach((file) => {
  const event = require(`./events/${file}`);
  console.log(`✅ Chargement de l'événement : ${event.name}`);
  client.on(event.name, (...args) => event.execute(...args, client));
});

client.on("messageCreate", (message) => {
  console.log(`Message détecté : ${message.content}`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.type !== InteractionType.ApplicationCommand) return;

  if (interaction.commandName === 'hello') {
    await interaction.reply("Hello, world!");
  }
});

// Lancement du bot
client.once("ready", () => {
  console.log(`✅ Bot en ligne en tant que ${client.user.tag}`);
  updateStatus(client);
  setInterval(() => updateStatus(client), 3600000);
  startAutoCheckup(client, "1376825133267681300");
});

// Vérification des serveurs whitelisted
client.on("guildCreate", (guild) => {
  if (!WHITELISTED_GUILDS.includes(guild.id)) {
    console.log(`❌ Serveur non autorisé détecté : ${guild.name} (${guild.id}). Déconnexion...`);
    guild.leave().catch(console.error);
  }
});

// Enregistrement des événements
client.on("guildMemberRemove", farewellHandler);

// Connexion du bot
client.login(process.env.TOKEN);
