const Discord = require('discord.js');
const fs = require('fs');
const commandsDir = `${process.cwd()}/src/commands`;
const config = require('../config/config');

module.exports = async client => {
    let commandsArray = [];
    let processedCommands = 0;

    client.commands = new Discord.Collection();

    fs.readdirSync(commandsDir).forEach(async dir => {
        const commands = fs.readdirSync(`${commandsDir}/${dir}`).filter(file => file.endsWith('.js'));

        for (const file of commands) {
            const command = require(`${commandsDir}/${dir}/${file}`);
            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());
            console.log(`✅ | Comando ${file.replace(/.js/, '')} cargado`);
            processedCommands ++;
        }

        await new Discord.REST({ version: 10 }).setToken(config.token).put(
            Discord.Routes.applicationGuildCommands(config.clientId, config.guildId), {
                body: commandsArray
            }
        );

        return console.log(`✅ | ${processedCommands} commands processed correctly`);
    })
}