import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { featureConfiguration } from "../bot";

export const data = new SlashCommandBuilder()
  .setName("autocheck")
  .setDescription(
    "Ativa ou desativa a verificação automática de capítulos novos"
  );

export async function execute(interaction: CommandInteraction) {
  const outcome = featureConfiguration.toogleAutoCheckPermission();
  return interaction.reply(outcome ? 'A verificação automática foi ativada!' : 'A verificação automática foi desativada!');
}
