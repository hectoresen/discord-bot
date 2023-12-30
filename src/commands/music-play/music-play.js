const Discord = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce una canción desde una URL o nombre')
        .addStringOption(options =>
            options
                .setName('query')
                .setDescription('Introduce nombre o url')
                .setRequired(true)
            ),

    run: async (client, interaction) => {
        try {
            const song = await interaction.options.getString('query');
            const player = useMainPlayer();
            await interaction.deferReply();

/*             console.log(client.player)
            const queue = client.player.getQueue(interaction.guild.id);
 */
            const channel = interaction.member?.voice?.channel;

            if (!channel) {
                return interaction.reply({ content: 'Primero debes unirte a un canal de voz', ephemeral: true });
            };

            if (channel.id !== interaction.member.voice.channelId) {
                return interaction.reply({ content: 'Ya estoy en un canal de voz diferente', ephemeral: true })
            };

            const result = await client.player.search(song, { requestedBy: interaction.user}).catch(() => { console.log('pedo')});

            const { track } = await player.play(channel, song, {
                nodeOptions: {
                    // nodeOptions are the options for guild node (aka your queue in simple word)
                    metadata: interaction // we can access this metadata object using queue.metadata later on
                }
            });

            return interaction.followUp(`**${track.title}** enqueued!`);
        } catch (error) {
            console.log('error', error)
            return interaction.followUp(`Something went wrong: ${error}`);
        }
    }
}