const Discord = require('discord.js');

function maxTanksDpsAndHealers(maxParticipants) {

    if (maxParticipants === 5) {
        return {
            maxTanks: 1,
            maxHealers: 1,
            maxDps: 3
        }
    };

    if (maxParticipants === 10) {
        return {
            maxTanks: 2,
            maxHealers: 2,
            maxDps: 6
        }
    };

}

module.exports = { maxTanksDpsAndHealers };
