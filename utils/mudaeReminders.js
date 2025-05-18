const { TextChannel } = require("discord.js");

const MUDAE_CHANNEL_ID = "1045036957572538502"; // Remplace par l'ID du salon Mudae
const PING_MESSAGE = "<@1169633695288791192> <@334755708077604875> C'est l'heure de Claim ! 🎲";


const TARGET_HOURS = [7, 10, 13, 16, 19, 22, 1, 4]; // Heures ciblées (France)
const TARGET_MINUTE = 23; // Minute spécifique

function scheduleMudaePing(client) {
    setInterval(() => {
        const now = new Date();
        const franceTime = new Date(now.toLocaleString("fr-FR", { timeZone: "Europe/Paris" }));

        const currentHour = franceTime.getHours();
        const currentMinute = franceTime.getMinutes();

        if (TARGET_HOURS.includes(currentHour) && currentMinute === TARGET_MINUTE) {
            const channel = client.channels.cache.get(MUDAE_CHANNEL_ID);
            if (channel instanceof TextChannel) {
                channel.send(PING_MESSAGE)
                    .then(() => console.log(`✅ Ping Mudae envoyé à ${franceTime.toLocaleTimeString("fr-FR")}`))
                    .catch(console.error);
            } else {
                console.error("❌ Le salon Mudae est introuvable ou inaccessible.");
            }
        }
    }, 60000); // Vérification toutes les minutes
}

module.exports = { scheduleMudaePing };
