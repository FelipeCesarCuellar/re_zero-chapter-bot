import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName("exportar")
  .setDescription(
    "Exporta o CSV do bot com as informações dos capítulos"
  );

export async function execute(interaction: CommandInteraction) {
    const file = new AttachmentBuilder('src/data/storage.csv', { name: 'storage.csv' });
    const today = new Date();
    console.log("📁 Arquivo CSV exportado          | " +today.toString());
    return interaction.reply({ files: [file] });
}