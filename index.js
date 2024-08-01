const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

// Cargar configuración desde config.json
const configPath = path.join(__dirname, 'config.json');
const { BOT_TOKEN } = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Crear cliente de Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Almacenar los comandos en una colección
client.commands = new Map();

// Cargar los comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Bot está en línea!');
});

// Manejar interacciones de comandos
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.log(`No se encontró el comando: ${interaction.commandName}`);
        return;
    }

    try {
        console.log(`Ejecutando el comando: ${interaction.commandName}`);
        await command.execute(interaction);
    } catch (error) {
        console.error('Error al ejecutar el comando:', error);
        await interaction.reply('Hubo un error al ejecutar este comando.');
    }
});

// Iniciar sesión en Discord
client.login(BOT_TOKEN);
