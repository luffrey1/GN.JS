require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('./config.json');

const clientId = config.CLIENT_ID;
const guildId = config.GUILD_ID;
const token = config.BOT_TOKEN;

const commandNameToDelete = ''; // Nombre del comando que quieres eliminar

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started deleting application (/) command: ${commandNameToDelete}.`);

        const existingCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
        const commandId = existingCommands.find(cmd => cmd.name === commandNameToDelete)?.id;

        if (!commandId) {
            console.error(`No se encontró el comando ${commandNameToDelete}`);
            return;
        }

        await rest.delete(Routes.applicationCommand(clientId, guildId, commandId));

        console.log(`Successfully deleted application (/) command: ${commandNameToDelete}.`);
    } catch (error) {
        console.error('Error al eliminar el comando:', error);
    }
})();
