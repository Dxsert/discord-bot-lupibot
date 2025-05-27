const { EmbedBuilder } = require('discord.js');
const { FAREWELL_CHANNEL_ID, farewellMessages, farewellGifs } = require('../config.js');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const channel = member.guild.channels.cache.get(FAREWELL_CHANNEL_ID);
    if (!channel) {
      console.error("⚠️ Le canal d'adieu est introuvable.");
      return;
    }

    const randomMessage = farewellMessages[Math.floor(Math.random() * farewellMessages.length)];
    const randomGif = farewellGifs[Math.floor(Math.random() * farewellGifs.length)];

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('👋 Adieu !')
      .setDescription(`${randomMessage} ${member.user.tag} !`)
      .setImage(randomGif)
      .setTimestamp()
      .setFooter({
        text: 'Karma GYAAAAT DAAAAAAM',
        iconURL: member.guild.iconURL() || undefined,
      });

    try {
      await channel.send({ embeds: [embed] });
      console.log(`✅ Message d'adieu envoyé pour ${member.user.tag}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message d\'adieu :', error);
    }
  },
};
