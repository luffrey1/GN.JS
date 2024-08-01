const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascenso')
        .setDescription('Asciende a un usuario y muestra la información en un mensaje.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('El usuario que será ascendido')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('rango_anterior')
                .setDescription('El rango anterior del usuario')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('rango_nuevo')
                .setDescription('El nuevo rango del usuario')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('motivo')
                .setDescription('Motivo del ascenso')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const rangoAnterior = interaction.options.getRole('rango_anterior');
        const rangoNuevo = interaction.options.getRole('rango_nuevo');
        const motivo = interaction.options.getString('motivo');

        // Verifica el rol del usuario que ejecuta el comando
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const inspectorRoleId = '1232449198788575232'; // Reemplaza con el ID real del rol Inspector

        if (!member.roles.cache.has(inspectorRoleId)) {
            console.log('Permiso denegado: El usuario no tiene el rol Inspector.');
            return interaction.reply('No tienes permisos para realizar este ascenso.');
        }

        try {
            // Obtén el canal donde enviar el mensaje usando el ID del canal
            const channelId = '1268627369258778676'; // Reemplaza con el ID real del canal
            const channel = await interaction.client.channels.fetch(channelId);
            
            console.log(`Canal encontrado: ${channel.name}`);
            
            // Crea y envía el embed
            const embed = new EmbedBuilder()
            .setTitle('# **Ascenso Registrado**')
            .setDescription(
                `## **Usuario:** 
                ${user.tag}\n\n` +
                `## **Rango Anterior:**
                ${rangoAnterior}\n\n` +
                `## **Nuevo Rango:** 
                ${rangoNuevo}\n\n` +
                `## **Motivo:**
                ${motivo}\n\n` +
                `## **Ascendido Por:**
                ${interaction.user.tag}`
            )
            .setThumbnail('https://images-ext-1.discordapp.net/external/D-33hzcdqBZrbVkEr6XzWSJn0qJ2Jcu-ZElZ7gW8-RM/%3Fformat%3Dwebp%26quality%3Dlossless%26width%3D568%26height%3D568/https/images-ext-1.discordapp.net/external/gHRNk0dfCdveWQaXnZ_RMNnsiNIItAsphTTZ0nzuong/%253Fsize%253D4096/https/cdn.discordapp.com/icons/1232447992678846517/a10dbb28e776b96a5217396099b731a9.png?format=webp&quality=lossless')
            .setColor('#00FF00');

            // Envía el mensaje al canal especificado
            await channel.send({ embeds: [embed] });

            await interaction.reply('Ascenso registrado y enviado al canal.');
        } catch (error) {
            console.error('Error al enviar el mensaje de ascenso:', error);
            await interaction.reply('Hubo un error al registrar el ascenso.');
        }
    },
};
