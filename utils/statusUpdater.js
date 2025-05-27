const { ActivityType } = require ('discord.js');

const statuses = [
    " Yukai stream !",
    "Demon qui tabasse Pink avec une pelle !",
    "Wephyr ouvrir des boosters !",
    "Karma Twerk !",
    "Kami qui mange un volo, ce truc est exclusif à la Belgique et DX, ça le fout vraiment en rogne, putain !",
 
];

module.exports.updateStatus = (client) => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity(randomStatus, { type: ActivityType.Watching });
};
