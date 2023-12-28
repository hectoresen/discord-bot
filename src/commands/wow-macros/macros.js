const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('macro')
        .setDescription('Obtiene una macro específica')
        .addSubcommand(subcommand =>
            subcommand.setName('clase')
                .setDescription('Elige una clase')
                // Añade aquí las opciones para las clases
                .addStringOption(option => option.setName('tipo').setDescription('Tipo de clase').setRequired(true)
                    .addChoices(
                        { name: 'Cazador', value: 'cazador' },
                        { name: 'Pícaro', value: 'picaro' },
                        { name: 'Druida', value: 'druida' },
                        { name: 'Chamán', value: 'chaman'},
                        { name: 'Sacerdote', value: 'sacerdote'},
                        { name: 'Mago', value: 'mago'},
                        { name: 'Brujo', value: 'brujo' }
                    )
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('profesion')
                .setDescription('Elige una profesión')
                // Añade aquí las opciones para las profesiones
                .addStringOption(option => option.setName('tipo').setDescription('Tipo de profesión').setRequired(true)
                    .addChoices(
                        { name: 'Pesca', value: 'pesca' },
                        { name: 'Minería', value: 'mineria' },
                        { name: 'Herrería', value: 'herreria' },
                        { name: 'Ingeniería', value: 'ingenieria'},
                        { name: 'Alquimia', value: 'alquimia' },
                        { name: 'Herboristería', value: 'herboristeria' },
                        { name: 'Cocina', value: 'cocina' },
                        { name: 'Primeros auxilios', value: 'auxilios'},
                        { name: 'Desollador', value: 'desollador' },
                        { name: 'Peletero', value: 'peletero'}
                    )
                )
        ),
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        let response = '';

        switch (subcommand) {
            case 'clase':
                const clase = interaction.options.getString('tipo');
                const macrosClase = {
                    cazador: 'No se han añadido macros para esta clase',
                    picaro: 'No se han añadido macros para esta clase',
                    druida: 'No se han añadido macros para esta clase',
                    chaman: 'No se han añadido macros para esta clase',
                    sacerdote: 'No se han añadido macros para esta clase',
                    mago: 'No se han añadido macros para esta clase',
                    brujo: 'No se han añadido macros para esta clase'
                }
                response = macrosClase[clase] || 'Clase no encontrada';
                break;
            case 'profesion':
                const profesion = interaction.options.getString('tipo');
                const macrosProfesion = {
                    pesca: '/console SoftTargetInteractRange 10\n/console SoftTargetInteractRange 30',
                    mineria: 'No se ha añadido una macro para esta profesión',
                    herrería: 'No se han añadido macros para esta profesión',
                    ingenieria: 'No se han añadido macros para esta profesión',
                    alquimia: 'No se han añadido macros para esta profesión',
                    herboristeria: 'No se han añadido macros para esta profesión',
                    cocina: 'No se han añadido macros para esta profesión',
                    auxilios: 'No se han añadido macros para esta profesión',
                    desollador: 'No se han añadido macros para esta profesión',
                    peletero: 'No se han añadido macros para esta profesión'
                };
                response = macrosProfesion[profesion] || 'Profesión no encontrada.';
                break;
            default:
                response = 'Subcomando no reconocido.';
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(`Macro: ${subcommand.charAt(0).toUpperCase() + subcommand.slice(1)}`)
            .setDescription(response)
            .setColor('DarkAqua')
            .setFooter({
                text: `Solicitado por ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
