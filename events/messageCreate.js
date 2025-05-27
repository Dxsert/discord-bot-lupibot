module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    // Marque que le bot a été utilisé
    const { markAsUsed } = require("../utils/autoCheckup");
    markAsUsed();

    const now = new Date();
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS
    const channelName = message.channel.name || "DM";
    console.log(`[${time}] [#${channelName}] ${message.author.tag}: ${message.content}`);

    const content = message.content.toLowerCase();
    const specificUserId = "140911156272431104"; // Remplace par l'ID précis souhaité

    const specialChannelId = "123456789012345678"; // Remplace par l'ID du channel spécial

    const defaultResponses = [
      "#FreeBertrand",
      "#RevengeForBertrand",
      "#RipBertrandUnTrizoPartiTropTot",
    ];

    const specialResponses = ["MAIS Y'A DE LA WISH POUR TOI ICI ?!"];

    if (content.includes("Jean-Cailloux") || message.mentions.has(specificUserId)) {
      const responses =
        message.channel.id === specialChannelId
          ? specialResponses
          : defaultResponses;
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      message.channel.send(randomResponse);
    }

    // Détection de "kek" (insensible à la casse)
    const regex = /k+e+k+/i; // gère kek, keeeek, k3k, etc. (tu peux simplifier en /kek/i si besoin)

    if (regex.test(message.content)) {
      const emojiList = [
        "1360239637955612682", // Ou directement l’ID de l’emoji custom
        "1360239621224792266", // Ou directement l’ID de l’emoji custom
        "1360239606368567386", // Ou directement l’ID de l’emoji custom
        "1360239592850329710", // Ou directement l’ID de l’emoji custom
        "1360239579927416952", // Ou directement l’ID de l’emoji custom
        "1360239562433237123", // Ou directement l’ID de l’emoji custom
      ];

      const randomEmoji =
        emojiList[Math.floor(Math.random() * emojiList.length)];

      try {
        await message.react(randomEmoji);
      } catch (err) {
        console.error("Impossible de réagir avec cet emoji :", err);
      }
    }

    const { Events } = require("discord.js");

    const TARGET_USER_ID = "700640154892763166"; // Remplace par l'ID de la personne
    const EMOJI_IDS = [
      "1360243398346407986", // Emoji 1
      "1360243357271593031", // Emoji 2
      "1360243322731368609", // Emoji 3
    ];

    if (message.author.id === TARGET_USER_ID) {
      const random = Math.floor(Math.random() * 4);
      console.log("Tirage aléatoire :", random); // pour debug

      if (random === 0) {
        const emojiId = EMOJI_IDS[Math.floor(Math.random() * EMOJI_IDS.length)];
        try {
          await message.react(emojiId);
        } catch (error) {
          console.error("Erreur lors de la réaction :", error);
        }
      }
    }
  },
};
