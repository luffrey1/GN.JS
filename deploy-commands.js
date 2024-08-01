require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const clientId = config.CLIENT_ID;
const guildId = config.GUILD_ID;
const token = config.BOT_TOKEN;

const commands = [
    {
        name: 'ascenso',
        description: 'Asciende a un usuario a un nuevo rango.',
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
    },
    // Agrega más comandos aquí si es necesario
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error al registrar comandos:', error);
    }
})();
