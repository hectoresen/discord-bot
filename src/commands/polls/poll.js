const Discord = require('discord.js');
const { poll } = require('discord.js-poll');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('encuesta')
		.setDescription('Create poll: Title + Option 1 + Option 2 + Option 3 + etc')
		.addStringOption(options =>
			options
				.setName('title')
				.setDescription('Título de la encuesta')
				.setRequired(true)
			)
        .addStringOption(options =>
            options
                .setName('duration')
                .setDescription('Duración en minutos')
                .setRequired(true)
            )
		.addStringOption(options =>
			options
				.setName('option1')
				.setDescription('Opción 1')
				.setRequired(true)
			)
		.addStringOption(options =>
			options
				.setName('option2')
				.setDescription('Opción 2')
				.setRequired(true)
			)
		.addStringOption(options =>
			options
				.setName('option3')
				.setDescription('Opción 3, opcional')
				.setRequired(false)
			)
		.addStringOption(options =>
			options
				.setName('option4')
				.setDescription('Opción 4, opcional')
				.setRequired(false)
			)
		.addStringOption(options =>
			options
				.setName('option5')
				.setDescription('Opción 5, opcional')
				.setRequired(false)
			),

	run: async(client, interaction) => {

        const title = interaction.options.getString('title');
        const duration = parseInt(interaction.options.getString('duration')) || 1;

        const options = [];
        for (let i = 1; i <= 5; i++) {
            const option = interaction.options.getString('option' + i);
            if (option) options.push(option);
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle('📊 ' + title)
            .setColor('DarkAqua')
            .setTimestamp();

        options.forEach((option, index) => {
            embed.addFields({ name: `Opción ${index + 1}`, value: `${String.fromCharCode(97 + index)}. ${option}` });
        });

        embed.setFooter({ 
            text: `Reacciona para votar. La encuesta cierra en ${duration} minutos. Encuesta creada por ${interaction.user.username}`, 
            iconURL: interaction.user.displayAvatarURL() 
        });

        const sentMessage = await interaction.channel.send({ embeds: [embed] });

        const reactions = ['🇦', '🇧', '🇨', '🇩', '🇪']; // Asegúrate de tener suficientes reacciones
        for (let i = 0; i < options.length && i < reactions.length; i++) {
            await sentMessage.react(reactions[i]);
        }

        // Temporizador para finalizar la encuesta
        setTimeout(async () => {
            try {
                const message = await interaction.channel.messages.fetch(sentMessage.id);
                let results = "";
                let maxVotes = 0;
                let winningOption = "";

                for (let i = 0; i < options.length && i < reactions.length; i++) {
                    const reaction = message.reactions.cache.get(reactions[i]);
                    const count = reaction ? reaction.count - 1 : 0; // Restar 1 para no contar la reacción del bot
                    results += `${String.fromCharCode(97 + i)}. ${options[i]}: ${count} votos\n`;
                    if (count > maxVotes) {
                        maxVotes = count;
                        winningOption = `${String.fromCharCode(97 + i)}. ${options[i]}`;
                    }
                }

                const resultsEmbed = new Discord.EmbedBuilder()
                    .setTitle('📊 Resultados de la Encuesta: ' + title)
                    .setDescription(`La encuesta ha finalizado. Aquí están los resultados:\n\n${results}\nGanador: ${winningOption}`)
                    .setColor('Green')
                    .setTimestamp();

                await message.edit({ embeds: [resultsEmbed] });
                await message.reactions.removeAll();
            } catch (error) {
                console.error("Error al finalizar la encuesta: ", error);
            }
        }, duration * 60 * 1000);

        await interaction.reply({ content: 'Encuesta creada!', ephemeral: true });
    }
};
