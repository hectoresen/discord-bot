const { Client } = require('discord.js');
const { IntentsBitField, Partials } = require('discord.js');
const dotenv = require('dotenv').config();
const config = require('../config/config');
const Enmap = require('enmap');
const path = require('path');

const client = new Client(
	{
		intents: [
			131071,
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildMembers,
			IntentsBitField.Flags.GuildMessages,
			IntentsBitField.Flags.MessageContent,
		],
		partials: [
			Partials.GuildMember,
			Partials.GuildMessages
		]
	}
);
//https://ziad87.net/intents/
//https://discordapi.com/permissions.html#1095199883263

client.login(config.token).then(() => {
	client.user.setActivity(`${config.serverName}`);
}).catch(error => console.log(error));

//DB
client.tickets = new Enmap({
    name: 'tickets',
    dataDir: path.join(__dirname, '../db/tickets')
});


module.exports = {
	client
}