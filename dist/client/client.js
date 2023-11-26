"use strict";

var _require = require('discord.js'),
  Client = _require.Client;
var _require2 = require('discord.js'),
  IntentsBitField = _require2.IntentsBitField,
  Partials = _require2.Partials;
var dotenv = require('dotenv').config();
var config = require('../config/config');
var Enmap = require('enmap');
var path = require('path');
var client = new Client({
  intents: [131071, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent],
  partials: [Partials.GuildMember, Partials.GuildMessages]
});
//https://ziad87.net/intents/
//https://discordapi.com/permissions.html#1095199883263

client.login(config.token).then(function () {
  client.user.setActivity("Unso es gay en ".concat(config.serverName));
})["catch"](function (error) {
  return console.log(error);
});

//DB
client.tickets = new Enmap({
  name: 'tickets',
  dataDir: path.join(__dirname, '../db/tickets') // Usar path.join para construir la ruta
});

module.exports = {
  client: client
};