import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("exportar-dados")
  .setDescription(
    "Exporta o CSV do banco de dados do bot com as informações dos capítulos"
  );

export async function execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
        .setColor(0xffffff)
        .setTitle('Aqui está o arquivo CSV exportado do sistema')
        .setURL('attchment://src/data/storage.csv')
        .setDescription('Use-o quando for realizar o redeploy do bot, ou se quiser analisar os dados anteriores.')
        .setTimestamp()
    return interaction.reply({ embeds: [embed] })
}
