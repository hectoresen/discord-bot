require('dotenv').config();
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

module.exports = client => {

    const mainRoles = [
        {
            id: process.env.DISCORD_ROLE_MAIN_DPS,
            label: 'Main DPS',
        },
        {
            id: process.env.DISCORD_ROLE_MAIN_TANK,
            label: 'Main TANK',
        },
        {
            id: process.env.DISCORD_ROLE_MAIN_HEALER,
            label: 'Main HEALER',
        }
    ];

    const alterRoles = [
        {
            id: process.env.DISCORD_ROLE_ALTER_DPS,
            label: 'Alter DPS'
        },
        {
            id: process.env.DISCORD_ROLE_ALTER_TANK,
            label: 'Alter TANK'
        },
        {
            id: process.env.DISCORD_ROLE_ALTER_HEALER,
            label: 'Alter HEALER'
        }
    ]

    client.on('ready', async (c) => {
        try {
            const channel = await client.channels.cache.get(process.env.DISCORD_ROLE_CHANNEL);
            if (!channel) return;

            const mainRolesRow = new ActionRowBuilder();
            const embedMainMessage = new EmbedBuilder()
                .setTitle('Sistema de roles PVE para Main')
                .setDescription('Escoge el rol PVE de tu Main, podrás editarlo tantas veces como quieras.')
                .setColor('Gold')

            mainRoles.forEach((role) => {
                mainRolesRow.components.push(
                    new ButtonBuilder()
                        .setCustomId(`roleSelector_${role.id}`)
                        .setLabel(role.label)
                        .setStyle(ButtonStyle.Primary)
                );
            });

            await channel.send({
                embeds: [embedMainMessage],
                components: [mainRolesRow],
            });

            const alterRolesRow = new ActionRowBuilder();
            const embedAlterMessage = new EmbedBuilder()
                .setTitle('Sistema de roles PVE para Alter')
                .setDescription('Escoge el rol PVE de tu Alter, podrás editarlo tantas veces como quieras')
                .setColor('DarkGold')

            alterRoles.forEach((role) => {
                alterRolesRow.components.push(
                    new ButtonBuilder()
                        .setCustomId(`roleSelector_${role.id}`)
                        .setLabel(role.label)
                        .setStyle(ButtonStyle.Primary)
                )
            });

            await channel.send({
                embeds: [embedAlterMessage],
                components: [alterRolesRow]
            })

            //process.exit();
        } catch (error) {
            console.log(error);
        }
    });
}

