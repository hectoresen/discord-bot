const { updateEmbed } = require('../utils/pve-update-embed');

module.exports = {
    name: 'messageReactionRemove',
    run: async (client, reaction, user) => {
        // Verificar si la reacción es para un mensaje de evento PVE
        let eventDetails = client.pveEvents.get(reaction.message.id);
        if (!eventDetails) return; // No es un evento PVE, no hacer nada

        // Define los emojis para cada rol
        const rolesEmojis = {
            dps: '⚔️',  // Emoji para DPS
            healer: '💖',  // Emoji para Healer
            tank: '🛡️'  // Emoji para Tank
        };

        // Identificar el rol asociado a la reacción
        const role = Object.keys(rolesEmojis).find(role => rolesEmojis[role] === reaction.emoji.name);

        if (role) {
            // Verificar si el usuario está en la lista del rol específico
            const index = eventDetails[role].indexOf(user.username);
            if (index > -1) {
                // Retirar al usuario de la lista del rol
                eventDetails[role].splice(index, 1);

                // Retirar al usuario de la lista general de participantes
                const participantIndex = eventDetails.participants.indexOf(user.username);
                if (participantIndex > -1) {
                    eventDetails.participants.splice(participantIndex, 1);
                }

                client.pveEvents.set(reaction.message.id, eventDetails);

                // Obtener el mensaje del evento y actualizar el embed
                const eventMessage = await reaction.message.channel.messages.fetch(reaction.message.id);

                const raidLeader = { username: `${eventDetails.participants[0]}` };
                eventMessage.edit({ embeds: [updateEmbed(client, reaction.message.id, raidLeader)] });
            }
        }
    }
};
