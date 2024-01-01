const Discord = require('discord.js');

function updateEmbed(client, messageId, formattedDateTime) {
    const eventDetails = client.pveEvents.get(messageId);
    const raidLeaderUsername = eventDetails.creatorUsername;

    const votersNames = eventDetails.voters.map(userId => {
        const user = client.users.cache.get(userId);
        return user ? user.username : "Usuario desconocido";
    });

    const newEmbed = new Discord.EmbedBuilder()
        .setTitle(`🛡️ Instancia PVE: ${eventDetails.instanceName}`)
        .setDescription(`Fecha de inicio: ${formattedDateTime}\nMáximo de participantes: ${eventDetails.maxParticipants}`)
        .setColor('Blue')
        .setTimestamp()
        .addFields(
            { name: 'Raid Líder', value: `${raidLeaderUsername}`, inline: true },
            { name: 'DPS', value: eventDetails.dps.join('\n') || 'Ninguno', inline: true },
            { name: 'Healer', value: eventDetails.healer.join('\n') || 'Ninguno', inline: true },
            { name: 'Tank', value: eventDetails.tank.join('\n') || 'Ninguno', inline: true }
        );

    if (eventDetails.votes.length > 0) {
        newEmbed.addFields({
            name: 'Votación de cancelación en curso',
            value: `${eventDetails.votes.length}/3 votos [${votersNames.join(', ')}]`,
            inline: false
        });
    }
    return newEmbed;
}

module.exports = { updateEmbed };
