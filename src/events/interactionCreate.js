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

            // Cancelación de evento PVE
            if (customId.startsWith('cancelEvent')) {
                const messageId = customId.split('_')[1];
                const eventDetails = client.pveEvents.get(messageId);
                const eventMessage = await interaction.channel.messages.fetch(messageId);

                if (!eventDetails) {
                    interaction.reply({ content: 'Evento no encontrado o ya finalizado.', ephemeral: true });
                    return;
                }

                // Cancelación por el creador del evento o por votación
                if (interaction.user.id === eventDetails.creatorId || eventDetails.votes.length >= 3) {
                    const updatedEmbed = updateEmbed(client, messageId, true);
                    await eventMessage.edit({ embeds: [updatedEmbed], components: [] }); // Eliminar botones al cancelar
                    await eventMessage.reactions.removeAll();
                    client.pveEvents.delete(messageId);
                    interaction.reply({ content: 'Evento cancelado.', ephemeral: true });
                } else {
                    // Votación para cancelar por otros usuarios
                    if (!eventDetails.votes.includes(interaction.user.id)) {
                        eventDetails.votes.push(interaction.user.id);
                        eventDetails.voters.push(interaction.user.id);
                        client.pveEvents.set(messageId, eventDetails);
                        await eventMessage.edit({ embeds: [updateEmbed(client, messageId)] });

                        interaction.reply({ content: `Voto registrado. Votos actuales: ${eventDetails.votes.length}/3`, ephemeral: true });
                    } else {
                        // Retirar voto si el usuario ya había votado
                        const voteIndex = eventDetails.votes.indexOf(interaction.user.id);
                        if (voteIndex > -1) {
                            eventDetails.votes.splice(voteIndex, 1);
                            eventDetails.voters.splice(voteIndex, 1);
                            client.pveEvents.set(messageId, eventDetails);
                            interaction.reply({ content: 'Tu voto para cancelar el evento ha sido retirado.', ephemeral: true });
                        }
                    }
                }
                return;
            }
        }

    }
};
