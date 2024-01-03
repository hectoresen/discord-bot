const Discord = require('discord.js');
const { updateEmbed } = require('../../utils/pve-update-embed');
const { maxTanksDpsAndHealers } = require('../../utils/pve-max-dps-tank-heal');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('pve')
        .setDescription('Crear una instancia PVE en World of Warcraft')
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('¿Instance o raid?')
                .setRequired(true)
                .addChoices(
                    { name: 'Instance', value: 'instance' },
                    { name: 'Raid', value: 'raid' }
                )
        )
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre de la instancia o raid')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('fecha')
                .setDescription('Fecha del evento (formato DD-MM-YYYY)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('hora')
                .setDescription('Hora del evento (formato HH:MM)')
                .setRequired(true)),

    run: async (client, interaction) => {
        try {

            const pveChannelId = process.env.DISCORD_PVE_CHANNEL;

            if (interaction.channel.id != pveChannelId) {
                return interaction.reply({ content: 'Por favor, utiliza este comando en el canal adecuado.'})
            };

            const pveEventType = interaction.options.getString('tipo');
            const instanceName = interaction.options.getString('nombre');
            const maxParticipants = (pveEventType === 'instance') ? 5 : 10
            const date = interaction.options.getString('fecha');
            const time = interaction.options.getString('hora');
            const raidLeader = interaction.user;

            const eventDateParts = date.split('-');
            const eventTimeParts = time.split(':');
            const eventDateTime = new Date(eventDateParts[2], eventDateParts[1] - 1, eventDateParts[0], eventTimeParts[0], eventTimeParts[1]);

            const currentTime = new Date();
            const duration = eventDateTime.getTime() - currentTime.getTime();

            if (duration <= 0) {
                return interaction.reply({ content: 'La fecha y hora del evento ya han pasado o son actuales.', ephemeral: true });
            };

            const formattedDateTime = eventDateTime.toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' });

            const embed = new Discord.EmbedBuilder()
                .setTitle(`🛡️ ${pveEventType.toUpperCase()} - ${instanceName}`)
                .setDescription(`Fecha de inicio: ${formattedDateTime}`)
                .setColor('Blue')
                .setTimestamp()
                .addFields(
                    { name: 'Raid Líder', value: `${raidLeader.username}`, inline: true },
                    { name: 'Participantes', value: 'Ninguno', inline: true }
                )
                .setFooter({
                    text: `${raidLeader.username} puede cancelar el evento. También podéis cancelarlo si reunís 3 votos. ${pveEventType} creada :`
                });

            const message = await interaction.channel.send({ embeds: [embed] });

            const cancelRow = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`cancelEvent_${message.id}`)
                        .setLabel(`Cancelar ${instanceName}`)
                        .setStyle(Discord.ButtonStyle.Danger)
                );

            await message.edit({ components: [cancelRow] });

            const rolesEmojis = {
                dps: '⚔️',  // DPS
                healer: '💖',  //Healer
                tank: '🛡️'  //Tank
            };

            await message.react(rolesEmojis.dps);
            await message.react(rolesEmojis.healer);
            await message.react(rolesEmojis.tank);

            const maxTanksHealsAndDps = maxTanksDpsAndHealers(maxParticipants);

            client.pveEvents.set(message.id, {
                eventType: pveEventType,
                creatorUsername: interaction.user.username,
                formattedDateTime: formattedDateTime,
                instanceName: instanceName,
                participants: [],
                maxParticipants: maxParticipants,
                creatorId: interaction.user.id,
                channelId: message.channel.id,
                messageId: message.id,
                maxDps: maxTanksHealsAndDps.maxDps,
                maxTanks: maxTanksHealsAndDps.maxTanks,
                maxHealers: maxTanksHealsAndDps.maxHealers,
                dps: [],
                healer: [],
                tank: [],
                votes: [],
                voters: []
            });

            const filter = (reaction, user) => {
                return !user.bot && Object.values(rolesEmojis).includes(reaction.emoji.name);
            };
            const collector = message.createReactionCollector({ filter, time: duration });

            collector.on('collect', async (reaction, user) => {
                let eventDetails = client.pveEvents.get(message.id);
                if (!eventDetails) return;

                const role = Object.keys(rolesEmojis).find(role => rolesEmojis[role] === reaction.emoji.name);
                if (!role) return;

                // Verifica el límite máximo para cada rol
                if (eventDetails[role].length >= eventDetails[`max${role.charAt(0).toUpperCase() + role.slice(1)}`]) {
                    await interaction.reply({ content: `El rol ${role.toUpperCase()} ya está lleno.`, ephemeral: true });
                    return;
                }

                // Remover usuario de otros roles si ya está en ellos
                let roleChanged = false;
                Object.keys(rolesEmojis).forEach(otherRole => {
                    if (otherRole !== role && eventDetails[otherRole].includes(user.username)) {
                        const index = eventDetails[otherRole].indexOf(user.username);
                        eventDetails[otherRole].splice(index, 1);
                        reaction.message.reactions.resolve(rolesEmojis[otherRole]).users.remove(user.id);
                        roleChanged = true; // Indica que el usuario cambió de rol
                    }
                });

                // Agregar usuario al nuevo rol
                if (!eventDetails[role].includes(user.username)) {
                    eventDetails[role].push(user.username);
                    // Si el usuario no ha cambiado de rol, añadirlo a la lista de participantes
                    if (!roleChanged) {
                        eventDetails.participants.push(user.username);
                    }
                    client.pveEvents.set(message.id, eventDetails);
                    await message.edit({ embeds: [updateEmbed(client, message.id)] });
                } else {
                    await interaction.reply({ content: 'No hay slots disponibles.', ephemeral: true });
                }
            });


            collector.on('end', () => {
                const eventDetails = client.pveEvents.get(message.id);

                // Verifica si el evento aún existe antes de intentar editar el mensaje
                if (eventDetails) {
                    embed.setTitle(`🛡️ ${eventDetails.instanceName} ha comenzado o ha finalizado`)
                        .setDescription(`No puedes apuntarte a ${eventDetails.instanceName}, porque ya ha empezado o ha finalizado.
                        Pero puedes hablar con ${eventDetails.participants[0]} que es el raid líder de este evento para comprobar si queda algún hueco.`)
                        .setFields({ name: 'Participantes', value: eventDetails.participants.join('\n') || 'Ninguno', inline: true })
                        .setFooter({ text: 'Puedes crear un propia instance o raid con el comando /pve'});
                    message.edit({ embeds: [embed], components: [] });
                    message.reactions.removeAll();
                    client.pveEvents.delete(message.id);
                }
            });

            await interaction.reply({ content: 'Instancia PVE creada!', ephemeral: true });
        } catch (error) {
            return interaction.reply({ content: 'Ha ocurrido un error', ephemeral: true })
        }
    }
};
