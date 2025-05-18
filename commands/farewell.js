const { EmbedBuilder } = require('discord.js');
const {FAREWELL_CHANNEL_ID, farewellMessages, farewellGifs} = require('../config.js');

module.exports = (member) => {
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
            iconURL: member.guild.iconURL()
        });

    channel.send({ embeds: [embed] }).then(() => {
        console.log(`✅ Message d'adieu envoyé pour ${member.user.tag}`);
    }).catch(console.error);
};
