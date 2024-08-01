const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Cargar configuración desde config.json
const configPath = path.join(__dirname, 'config.json');
const { BOT_TOKEN, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Crear pool de conexión a la base de datos
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

// Crear cliente de Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot está en línea!');
});

// Iniciar sesión en Discord
client.login(BOT_TOKEN);

// Exportar pool para usar en otros archivos
module.exports = pool;
