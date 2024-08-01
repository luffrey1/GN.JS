require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('./config.json');

const clientId = config.CLIENT_ID;
const guildId = config.GUILD_ID;
const token = config.BOT_TOKEN;

const commandNameToUpdate = ''; // Nombre del comando que quieres actualizar
const updatedCommand = {
    name: 'ascenso',
    description: 'Asciende a un usuario a un nuevo rango (actualizado).',
    options: [
        {
            type: 6, // Tipo de opción: Usuario
            name: 'usuario',
            description: 'El usuario que será ascendido',
            required: true,
        },
        {
            type: 3, // Tipo de opción: String
            name: 'rango_anterior',
            description: 'El rango previo del usuario',
            required: true,
        },
        {
            type: 3, // Tipo de opción: String
            name: 'rango_nuevo',
            description: 'El nuevo rango del usuario',
            required: true,
        },
        {
            type: 3, // Tipo de opción: String
            name: 'motivo',
            description: 'Motivo del ascenso',
            required: true,
        },
    ],
};

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started updating application (/) command: ${commandNameToUpdate}.`);

        const existingCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
        const commandId = existingCommands.find(cmd => cmd.name === commandNameToUpdate)?.id;

        if (!commandId) {
            console.error(`No se encontró el comando ${commandNameToUpdate}`);
            return;
        }

        await rest.patch(Routes.applicationCommand(clientId, guildId, commandId), {
            body: updatedCommand,
        });

        console.log(`Successfully updated application (/) command: ${commandNameToUpdate}.`);
    } catch (error) {
        console.error('Error al actualizar el comando:', error);
    }
})();
