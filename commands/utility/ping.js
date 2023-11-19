const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ver la lactencia del bot'),

	run: (client, interaction) => {
		interaction.reply({ content: `El ping del ${config.serverName} es de ${client.ws.ping} ms` })
	}
};