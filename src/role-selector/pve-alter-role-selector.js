require('dotenv').config();
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

module.exports = client => {

    const roles = [
        {
            id: process.env.DISCORD_ROLE_ALTER_DPS,
            label: 'Alter DPS',
        },
        {
            id: process.env.DISCORD_ROLE_ALTER_TANK,
            label: 'Alter TANK',
        },
        {
            id: process.env.DISCORD_ROLE_ALTER_HEALER,
            label: 'Alter HEALER',
        },
    ];

    client.on('ready', async (c) => {
        try {
            const channel = await client.channels.cache.get(process.env.DISCORD_ROLE_CHANNEL);
            if (!channel) return;

            const row = new ActionRowBuilder();
            const embedMessage = new EmbedBuilder()
                .setTitle('Sistema de roles PVE')
                .setDescription('Escoge el rol PVE de tu Alter, podrás editarlo tantas veces como quieras.')
                .setColor('DarkGold')

            roles.forEach((role) => {
                row.components.push(
                    new ButtonBuilder()
                        .setCustomId(`roleSelector_${role.id}`)
                        .setLabel(role.label)
                        .setStyle(ButtonStyle.Primary)
                );
            });

            await channel.send({
                embeds: [embedMessage],
                components: [row],
            });
            //process.exit();
        } catch (error) {
            console.log(error);
        }
    });
}

