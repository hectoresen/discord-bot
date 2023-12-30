const { Client } = require('discord.js');
const { IntentsBitField, Partials } = require('discord.js');
const dotenv = require('dotenv').config();
const config = require('../config/config');
const Enmap = require('enmap');
const path = require('path');
const { Player } = require("discord-player");

//https://ziad87.net/intents/
//https://discordapi.com/permissions.html#1095199883263
const client = new Client(
	{
		intents: [
			131071,
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildMembers,
			IntentsBitField.Flags.GuildMessages,
			IntentsBitField.Flags.MessageContent,
			IntentsBitField.Flags.GuildVoiceStates
		],
		partials: [
			Partials.GuildMember,
			Partials.GuildMessages,
		]
	}
);


client.login(config.token).then(() => {
	client.user.setActivity(`${config.serverName}`);
}).catch(error => console.log(error));


//Music https://discord-player.js.org/guide/welcome/welcome
client.player = new Player(client, {
	leaveOnEnd: true,
	leaveOnStop: true,
	leaveOnEmpty: true,
	levateOnEmptyCooldown: 60000,
	autoSelfDeaf: true,
	initialVolume: 100
});

//Initialize music player
async function initializePlayer() {
    await client.player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
}
initializePlayer().catch(console.error);


//DB
client.tickets = new Enmap({
    name: 'tickets',
    dataDir: path.join(__dirname, '../db/tickets')
});


module.exports = {
	client
}