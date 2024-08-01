const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pool = require('../database'); // Ajusta la ruta si es necesario

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascenso')
        .setDescription('Asciende a un usuario y guarda la información en la base de datos.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario que será ascendido')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('rango_anterior')
                .setDescription('El rango anterior del usuario')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('rango_nuevo')
                .setDescription('El nuevo rango del usuario')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo del ascenso')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const rangoAnterior = interaction.options.getString('rango_anterior');
        const rangoNuevo = interaction.options.getString('rango_nuevo');
        const motivo = interaction.options.getString('motivo');

        // Verifica el rol del usuario que ejecuta el comando
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const inspectorRoleId = 'ID_DEL_ROL_INSPECTOR'; // Reemplaza con el ID real del rol Inspector
        const userRoles = member.roles.cache.map(role => role.id);

        if (!userRoles.includes(inspectorRoleId)) {
            return interaction.reply('No tienes permisos para realizar este ascenso.');
        }

        try {
            // Guarda el ascenso en la base de datos
            const [result] = await pool.execute(
                'INSERT INTO ascensos (user_id, rango_anterior, rango_nuevo, motivo, ascendido_por) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE rango_anterior = VALUES(rango_anterior), rango_nuevo = VALUES(rango_nuevo), motivo = VALUES(motivo), ascendido_por = VALUES(ascendido_por)',
                [user.id, rangoAnterior, rangoNuevo, motivo, interaction.user.username]
            );

            // Crea y envía el embed
            const embed = new EmbedBuilder()
                .setTitle('Ascenso Registrado')
                .setDescription(`**Usuario:** ${user.tag}\n**Rango Anterior:** ${rangoAnterior}\n**Nuevo Rango:** ${rangoNuevo}\n**Motivo:** ${motivo}\n**Ascendido Por:** ${interaction.user.tag}`)
                .setImage('https://images-ext-1.discordapp.net/external/D-33hzcdqBZrbVkEr6XzWSJn0qJ2Jcu-ZElZ7gW8-RM/%3Fformat%3Dwebp%26quality%3Dlossless%26width%3D568%26height%3D568/https/images-ext-1.discordapp.net/external/gHRNk0dfCdveWQaXnZ_RMNnsiNIItAsphTTZ0nzuong/%253Fsize%253D4096/https/cdn.discordapp.com/icons/1232447992678846517/a10dbb28e776b96a5217396099b731a9.png?format=webp&quality=lossless')
                .setColor('#00FF00');

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error al registrar el ascenso:', error);
            await interaction.reply('Hubo un error al registrar el ascenso.');
        }
    }
};
