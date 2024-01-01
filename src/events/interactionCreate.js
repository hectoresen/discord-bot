const { updateEmbed } = require('../utils/pve-update-embed');

module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        // Manejar interacciones de comandos
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (command) {
                command.run(client, interaction);
            } else {
                interaction.reply({ content: 'El comando no existe o está desactivado' });
            }
            return;
        }

        // Manejar interacciones de botones
        if (interaction.isButton()) {
            const customId = interaction.customId;

            // Selector de roles
            if (customId && customId.startsWith('roleSelector_')) {
                try {
                    const roleId = customId.split('_')[1];

                    await interaction.deferReply({ ephemeral: true });
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (!role) {
                        interaction.editReply({
                            content: 'Role not found'
                        });
                        return;
                    };

                    const hasRole = interaction.member.roles.cache.has(role.id);

                    if (hasRole) {
                        await interaction.member.roles.remove(role);
                        return await interaction.editReply(`Tu rol ${role} ha sido eliminado`);
                    };

                    await interaction.member.roles.add(role);
                    return await interaction.editReply(`El rol ${role} ha sido añadido`);
                } catch (error) {
                    console.log(error)
                }
            }

            // Manejar botones de ticket
            if (customId === 'crearTicket' || customId === 'cerrarTicket') {
                return;
            }

            // Manejar botón de cancelación de evento PVE
            if (customId.startsWith('cancelEvent')) {
                const messageId = customId.split('_')[1];
                const eventDetails = client.pveEvents.get(messageId);
                const formattedDateTime = eventDetails.formattedDateTime;

                if (!eventDetails) {
                    interaction.reply({ content: 'Evento no encontrado o ya finalizado.', ephemeral: true });
                    return;
                }

                // Cancelación por el creador del evento
                if (interaction.user.id === eventDetails.creatorId) {
                    interaction.message.delete();
                    client.pveEvents.delete(messageId);
                    interaction.reply({ content: 'Evento cancelado por el creador.', ephemeral: true });
                } else {
                    // Votación para cancelar por otros usuarios
                    if (!eventDetails.votes) eventDetails.votes = [];
                    if (!eventDetails.voters) eventDetails.voters = []; // Inicializar array de votantes si no existe

                    if (!eventDetails.votes.includes(interaction.user.id)) {
                        eventDetails.votes.push(interaction.user.id);
                        eventDetails.voters.push(interaction.user.id); // Añadir al usuario a la lista de votantes
                        client.pveEvents.set(messageId, eventDetails);

                        // Obtener y actualizar el mensaje del evento
                        const eventMessage = await interaction.channel.messages.fetch(messageId);
                        eventMessage.edit({ embeds: [updateEmbed(client, messageId, formattedDateTime)] });

                        if (eventDetails.votes.length >= 3) {
                            interaction.message.delete();
                            client.pveEvents.delete(messageId);
                            interaction.reply({ content: 'Evento cancelado por votación.', ephemeral: true });
                        } else {
                            interaction.reply({ content: `Voto registrado. Votos actuales: ${eventDetails.votes.length}/3`, ephemeral: true });
                        }
                    } else {
                        // Retirar voto si el usuario ya había votado
                        const voteIndex = eventDetails.votes.indexOf(interaction.user.id);
                        const voterIndex = eventDetails.voters.indexOf(interaction.user.id);
                        if (voteIndex > -1) {
                            eventDetails.votes.splice(voteIndex, 1);
                            eventDetails.voters.splice(voterIndex, 1);
                            client.pveEvents.set(messageId, eventDetails);

                            // Actualizar el mensaje del evento
                            const eventMessage = await interaction.channel.messages.fetch(messageId);
                            eventMessage.edit({ embeds: [updateEmbed(client, messageId, formattedDateTime)] });

                            interaction.reply({ content: 'Tu voto para cancelar el evento ha sido retirado.', ephemeral: true });
                        }
                    }
                }
                return;
            }

        }
    }
};
