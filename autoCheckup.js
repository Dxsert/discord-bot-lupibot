let usedRecently = false;

function markAsUsed() {
  usedRecently = true;
}

function startAutoCheckup(client, channelId) {
  setInterval(() => {
    const channel = client.channels.cache.get(channelId);
    if (!channel) return console.warn("❌ Salon introuvable pour le check-up.");

    const latency = Math.round(client.ws.ping);
    const usageMsg = usedRecently ? "✅ Le bot a été utilisé." : "⚠️ Aucune activité détectée.";
    usedRecently = false; // reset après le checkup

    channel.send(`🤖 **Check-up automatique**\n📶 Ping: \`${latency}ms\`\n📊 Activité: ${usageMsg}`);
  }, 10 * 60 * 1000); // 10 minutes
}

module.exports = { startAutoCheckup, markAsUsed };
