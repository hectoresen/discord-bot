"use strict";

var _require = require('discord.js'),
  SlashCommandBuilder = _require.SlashCommandBuilder;
var config = require('../../config/config');
module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Ver la lactencia del bot'),
  run: function run(client, interaction) {
    interaction.reply({
      content: "El ping del ".concat(config.serverName, " es de ").concat(client.ws.ping, " ms")
    });
  }
};