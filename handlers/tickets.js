const Discord = require('discord.js');

module.exports = async client => {
    client.on('interactionCreate', async interaction => {

        client.tickets.ensure(interaction.guild.id, {
            category: '',
            role: ''
        })

        const db = client.tickets.get(interaction.guild.id);
        if (!interaction.isButton()) return;


        if (db) {
            switch (interaction.customId) {
                case 'crearTicket':
                    let channel;
                    if (db.role !== null) {
                        channel = await interaction.guild.channels.create({
                            name: `ticket-${interaction.member.user.username}`,
                            type: Discord.ChannelType.GuildText,
                            parent: db.category,
                            permissionOverwrites: [
                                {
                                    id: interaction.member.id,
                                    allow: ['ViewChannel', 'SendMessages', 'AttachFiles']
                                },
                                {
                                    id: interaction.guild.roles.everyone,
                                    deny: ['ViewChannel']
                                },
                                {
                                    id: db.role,
                                    allow: ['ViewChannel', 'SendMessages', 'AttachFiles']
                                }
                            ]
                        })
                    } else {
                        channel = await interaction.guild.channels.create({
                            name: `ticket-${interaction.member.user.username}`,
                            type: Discord.ChannelType.GuildText,
                            parent: db.category,
                            permissionOverwrites: [
                                {
                                    id: interaction.member.id,
                                    allow: ['ViewChannel', 'SendMessages', 'AttachFiles']
                                },
                                {
                                    id: interaction.guild.roles.everyone,
                                    deny: ['ViewChannel']
                                },
                                {
                                    id: db.role,
                                    allow: ['ViewChannel', 'SendMessages', 'AttachFiles']
                                }
                            ]
                        });
                    }

                    interaction.reply({ content: `✅ | Ticket enviado a ${channel}`, ephemeral: true })
                    channel.send({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setAuthor({ name: `Bienvenido, ${interaction.member.user.username}!`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                                .setDescription('Para continuar, responde a este mensaje con la siguiente información. Nombre in game, raza, clase, nivel actual y si estás ya en otra hermandad o no')
                                .setColor('DarkAqua')
                        ], components: [
                            new Discord.ActionRowBuilder()
                                .addComponents(
                                    new Discord.ButtonBuilder()
                                        .setLabel('Cerrar conversación')
                                        .setEmoji('❌')
                                        .setStyle(Discord.ButtonStyle.Danger)
                                        .setCustomId('cerrarTicket')
                                )
                        ]
                    })
                    break;
                case 'cerrarTicket': {
                    interaction.reply('🗑️ | El ticket se cerrará en 3 segundos.. ')
                    setTimeout(() => {
                        return interaction.channel.delete();
                    }, 3000);
                }
                default:
                    break;
            }
        }

    })
}