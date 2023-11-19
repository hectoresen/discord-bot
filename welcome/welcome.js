const dotenv = require('dotenv').config();
const Discord = require('discord.js');
const config = require('../config/config');

module.exports = client => {
    client.on("guildMemberAdd", member => {
        const channelId = process.env.DISCORD_WELCOME_CHANNEL;

        //const message = "Bienvenido a **Season of Discovery**, " + member.user['username'] + "!";

        const channel = member.guild.channels.cache.get(channelId);

        //channel.send(message);

        channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                .setAuthor({ name: `Bienvenido a ${config.serverName} ${member.user.username}`, iconURL: member.user.displayAvatarURL()})
                .setDescription(`Dispones de un canal para aplicar y de un chat temporal para invitados.`)
                .setColor('DarkAqua')
            ]
        })

        const role = member.guild.roles.cache.find(role => role.name === "Invitado");
        member.roles.add(role);
    })
}