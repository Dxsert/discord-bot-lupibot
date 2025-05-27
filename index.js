const {
  Client,
  GatewayIntentBits,
  InteractionType,
  Collection,
} = require('discord.js');
require("dotenv").config();
const fs = require("fs");

// Import modules
const { updateStatus } = require("./utils/statusUpdater");
const farewellHandler = require("./events/guildMemberRemove");
const { startAutoCheckup } = require("./utils/autoCheckup");
const WHITELISTED_GUILDS = ["757261169151967353", "808836895622037504"];

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

// Collection des commandes
client.commands = new Collection();

// Chargement des commandes
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`⚠️ La commande dans ${file} est invalide (manque 'data' ou 'execute')`);
  }
}

// Chargement des événements
fs.readdirSync("./events").forEach((file) => {
  const event = require(`./events/${file}`);
  console.log(`✅ Chargement de l'événement : ${event.name}`);
  client.on(event.name, (...args) => {
    try {
      event.execute(...args, client);
    } catch (error) {
      console.error(`Erreur lors de l'exécution de l'event ${event.name} :`, error);
    }
  });
});

// Log des messages
client.on("messageCreate", (message) => {
  console.log(`Message détecté : ${message.content}`);
});

// Gestion des interactions slash
client.on("interactionCreate", async (interaction) => {
  if (interaction.type !== InteractionType.ApplicationCommand) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Erreur dans la commande ${interaction.commandName} :`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Une erreur est survenue.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
    }
  }
});

// Ready
client.once("ready", () => {
  console.log(`✅ Bot en ligne en tant que ${client.user.tag}`);
  updateStatus(client);
  setInterval(() => updateStatus(client), 3600000);
  startAutoCheckup(client, "1376825133267681300");
});

// Anti-serveurs non whitelisted
client.on("guildCreate", (guild) => {
  if (!WHITELISTED_GUILDS.includes(guild.id)) {
    console.log(`❌ Serveur non autorisé : ${guild.name} (${guild.id}). Déconnexion...`);
    guild.leave().catch(console.error);
  }
});

// Lancement
client.login(process.env.TOKEN);