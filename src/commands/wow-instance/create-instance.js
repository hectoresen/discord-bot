const Discord = require('discord.js');
const { updateEmbed } = require('../../utils/pve-update-embed');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('pve')
        .setDescription('Crear una instancia PVE en World of Warcraft')
        .addStringOption(option =>
            option.setName('instance')
                .setDescription('Nombre de la instancia')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('max_participants')
                .setDescription('Número máximo de participantes')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Fecha del evento (formato DD-MM-YYYY)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Hora del evento (formato HH:MM)')
                .setRequired(true)),

    run: async (client, interaction) => {
        const instanceName = interaction.options.getString('instance');
        const maxParticipants = interaction.options.getInteger('max_participants');
        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time');
        const raidLeader = interaction.user;

        const eventDateParts = date.split('-');
        const eventTimeParts = time.split(':');
        const eventDateTime = new Date(eventDateParts[2], eventDateParts[1] - 1, eventDateParts[0], eventTimeParts[0], eventTimeParts[1]);

        const currentTime = new Date();
        const duration = eventDateTime.getTime() - currentTime.getTime();
        if (duration <= 0) {
            return interaction.reply({ content: 'La fecha y hora del evento ya han pasado o son actuales.', ephemeral: true });
        }
        const formattedDateTime = eventDateTime.toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' });

        const embed = new Discord.EmbedBuilder()
            .setTitle(`🛡️ Instancia PVE: ${instanceName}`)
            .setDescription(`Fecha de inicio: ${formattedDateTime}\nMáximo de participantes: ${maxParticipants}`)
            .setColor('Blue')
            .setTimestamp()
            .addFields(
                { name: 'Raid Líder', value: `${raidLeader.username}`, inline: true },
                { name: 'Participantes', value: 'Ninguno', inline: true }
            );

        const message = await interaction.channel.send({ embeds: [embed] });

        const cancelRow = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`cancelEvent_${message.id}`)
                    .setLabel('Cancelar instance')
                    .setStyle(Discord.ButtonStyle.Danger)
            );

        await message.edit({ components: [cancelRow] });

        const rolesEmojis = {
            dps: '⚔️',  // Emoji para DPS
            healer: '💖',  // Emoji para Healer
            tank: '🛡️'  // Emoji para Tank
        };

        await message.react(rolesEmojis.dps);
        await message.react(rolesEmojis.healer);
        await message.react(rolesEmojis.tank);

        client.pveEvents.set(message.id, {
            creatorUsername: interaction.user.username,
            formattedDateTime: formattedDateTime,
            instanceName: instanceName,
            participants: [],
            maxParticipants: maxParticipants,
            creatorId: interaction.user.id,
            channelId: message.channel.id,
            messageId: message.id,
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

            // Remover usuario de otros roles si ya está en ellos
            Object.keys(rolesEmojis).forEach(otherRole => {
                if (otherRole !== role && eventDetails[otherRole].includes(user.username)) {
                    const index = eventDetails[otherRole].indexOf(user.username);
                    eventDetails[otherRole].splice(index, 1);
                    reaction.message.reactions.resolve(rolesEmojis[otherRole]).users.remove(user.id);
                }
            });

            // Agregar usuario al nuevo rol
            if (!eventDetails[role].includes(user.username)) {
                eventDetails[role].push(user.username);
                client.pveEvents.set(message.id, eventDetails);
                await message.edit({ embeds: [updateEmbed(client, message.id, raidLeader, formattedDateTime)] });
            }
        });

        collector.on('end', () => {
            const eventDetails = client.pveEvents.get(message.id);

            // Verifica si el evento aún existe antes de intentar editar el mensaje
            if (eventDetails) {
                embed.setTitle(`🛡️ Instancia PVE Finalizada: ${eventDetails.instanceName}`)
                    .setDescription(`Evento finalizado.`)
                    .setFields({ name: 'Participantes', value: eventDetails.participants.join('\n') || 'Ninguno', inline: true });
                message.edit({ embeds: [embed] });
                message.reactions.removeAll();
                client.pveEvents.delete(message.id);
            }
        });

        await interaction.reply({ content: 'Instancia PVE creada!', ephemeral: true });
    }
};
