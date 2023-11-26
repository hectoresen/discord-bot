"use strict";

var dotenv = require('dotenv').config();
var Discord = require('discord.js');
var config = require('../config/config');
module.exports = function (client) {
  client.on("guildMemberAdd", function (member) {
    var channelId = process.env.DISCORD_WELCOME_CHANNEL;

    //const message = "Bienvenido a **Season of Discovery**, " + member.user['username'] + "!";

    var channel = member.guild.channels.cache.get(channelId);

    //channel.send(message);

    channel.send({
      embeds: [new Discord.EmbedBuilder().setAuthor({
        name: "Bienvenido a ".concat(config.serverName, " ").concat(member.user.username),
        iconURL: member.user.displayAvatarURL()
      }).setDescription("Dispones de un canal para aplicar y de un chat temporal para invitados.").setColor('DarkAqua')]
    });
    var role = member.guild.roles.cache.find(function (role) {
      return role.name === "Invitado";
    });
    member.roles.add(role);
  });
};