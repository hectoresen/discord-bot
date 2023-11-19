const Discord = require('discord.js');
//const Enmap = require('enmap');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('tickets')
        .setDescription('Crea tu sistema de tickets')
        .addStringOption(options =>
            options
                .setName('name')
                .setDescription('Especifica el nombre del panel de tickets')
                .setRequired(true)
        )
        .addStringOption(options =>
            options
                .setName('description')
                .setDescription('Especifica la descripción del panel de tickets')
                .setRequired(true)
        )
        .addChannelOption(options =>
            options
                .setName('channel')
                .setDescription('Especifica el canal donde quieres crear el panel de tickets')
                .setRequired(true)
        )
        .addChannelOption(options =>
            options
                .setName('category')
                .setDescription('Especifica la categoría donde caerán los nuevos tickets')
                .setRequired(true)
        )
        .addRoleOption(options =>
            options
                .setName('role')
                .setDescription('Especifica que rol puede manegar los tickets')
                .setRequired(true)
        ),

    run: async (client, interaction) => {

        client.tickets.ensure(interaction.guild.id, {
            category: '',
            role: ''
        })
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');
        const channel = interaction.options.getChannel('channel');

        if (channel.type !== Discord.ChannelType.GuildText) return interaction.reply(
            {
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('El canal que has específico no es de texto')
                        .setDescription('No puedo enviar mensajes en un canal que no es de texto')
                        .setColor('Red')
                ]
            });

        const category = interaction.options.getChannel('category');

        if (category && category.type !== Discord.ChannelType.GuildCategory) return interaction.reply(
            {
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('Debes especificar una categoría correcta')
                        .setDescription('No puedo crear canales dentro de otros canales')
                        .setColor('Red')
                ]
            }
        );
        const role = interaction.options.getRole('role');

        interaction.reply(
            {
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('✅ | Sistema de tickets configurado!')
                        .setDescription(`*Sistema de tickets enviado a ${channel}*`)
                        .setColor('Green')
                ]
            }
        )
        channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(name)
                    .setDescription(description)
                    .setColor('DarkAqua')
            ], components: [
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setLabel('Aplicar')
                    .setEmoji('📥')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId('crearTicket')
                )
            ]
        })

        client.tickets.set(interaction.guild.id, {
            category: category ? category.id : null,
            role: role ? role.id : null
        })
    }
}