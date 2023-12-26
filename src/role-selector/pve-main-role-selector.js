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
        },
    ];

    client.on('ready', async (c) => {
        try {
            const channel = await client.channels.cache.get(process.env.DISCORD_ROLE_CHANNEL);
            if (!channel) return;

            const mainRow = new ActionRowBuilder();
            const mainEmbedMessage = new EmbedBuilder()
                .setTitle('Sistema de roles PVE')
                .setDescription('Escoge el rol PVE de tu Main, podrás editarlo tantas veces como quieras.')
                .setColor('Gold')

            mainRoles.forEach((role) => {
                mainRow.components.push(
                    new ButtonBuilder()
                        .setCustomId(`roleSelector_${role.id}`)
                        .setLabel(role.label)
                        .setStyle(ButtonStyle.Primary)
                );
            });

            await channel.send({
                embeds: [mainEmbedMessage],
                components: [mainRow],
            });
            //process.exit();
        } catch (error) {
            console.log(error);
        }
    });
}

