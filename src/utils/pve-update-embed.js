const Discord = require('discord.js');

function updateEmbed(client, messageId, cancelled = false) {
    const eventDetails = client.pveEvents.get(messageId);
    console.log(eventDetails)
    const raidLeaderUsername = eventDetails.creatorUsername;

    const votersNames = eventDetails.voters.map(userId => {
        const user = client.users.cache.get(userId);
        return user ? user.username : "Usuario desconocido";
    });

    if (cancelled) {
        const cancelMessage = eventDetails.voters.length >= 3 ?
            `Este evento ha sido cancelado debido a una votación de los siguientes usuarios: ${eventDetails.voters.join(', ')}` :
            `Evento cancelado por ${raidLeaderUsername}.`;
        
        return new Discord.EmbedBuilder()
                    .setDescription(`${cancelMessage}`)
    };

    const slots = eventDetails.maxParticipants - eventDetails.participants.length;

    const newEmbed = new Discord.EmbedBuilder()
        .setDescription(`Fecha de inicio: ${eventDetails.formattedDateTime}\nMáximo de participantes: ${eventDetails.maxParticipants}`)
        .setColor('Blue')
        .setTimestamp()
        .addFields(
            { name: 'Raid Líder', value: `${raidLeaderUsername}`, inline: true },
            { name: 'DPS', value: `${eventDetails.dps.join('\n') || 'Ninguno'} (${eventDetails.dps.length}/${eventDetails.maxDps})`, inline: true },
            { name: 'Healer', value: `${eventDetails.healer.join('\n') || 'Ninguno'} (${eventDetails.healer.length}/${eventDetails.maxHealers})`, inline: true },
            { name: 'Tank', value: `${eventDetails.tank.join('\n') || 'Ninguno'} (${eventDetails.tank.length}/${eventDetails.maxTanks})`, inline: true },
            { name: 'Slots disponibles', value: `${slots} / ${eventDetails.maxParticipants}` }
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
