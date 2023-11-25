
module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        const command = client.commands.get(interaction.commandName);

        const customId = interaction.customId;

        if (customId && customId.startsWith('roleSelector_')) {
            try {
                const roleId = customId.split('_')[1];

                await interaction.deferReply({ ephemeral: true });
                const role = interaction.guild.roles.cache.get(roleId);

                if (!role) {
                    interaction.editReply({
                        content: 'Role not found'
                    });
                    return;
                };

                const hasRole = interaction.member.roles.cache.has(role.id);

                if (hasRole) {
                    await interaction.member.roles.remove(role);
                    return await interaction.editReply(`Tu rol ${role} ha sido eliminado`);
                };

                await interaction.member.roles.add(role);
                return await interaction.editReply(`El rol ${role} ha sido añadido`);
            } catch (error) {
                console.log(error)
            }
        };

        //Si es ticket no hacemos nada que ya se está manejando en envets/interactionCreate.js
        if (interaction.customId == 'crearTicket' || interaction.customId == 'cerrarTicket') {
            //A futuro podemos llamar a ticket.js
            return;
        }
        //Si es un comando reconocido, se ejecuta.
        if (command) {
            command.run(client, interaction);
        } else {
            interaction.reply({ content: 'El comando no existe o está desactivado' })
        }
    }
}