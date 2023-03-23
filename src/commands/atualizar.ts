import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import createNovelEmbed from "../embeds/novel";
import RequestNovelService from "../services/ncode/RequestNovelService";

export const data = new SlashCommandBuilder()
  .setName("atualizar")
  .setDescription(
    "atualiza manualmente as informações sobre a WN de Re:Zero, e informa sobre o último capítulo"
  );

export async function execute(interaction: CommandInteraction) {
  const requestNovelService = new RequestNovelService();
  const data = await requestNovelService.getDataByNcode();
  const arc = 7; // Como identifico um arco? (Quebra só se ele postar algo tipo um EX ou quando vira o arco?)
  const chapter = 110; // Como identifico um capítulo de arco sem quebrar quando o autor postar um EX?
  const characterCount = 12345; // Devo armazenar a contagem de caracteres do capítulo passado num BD para conseguir mostrá-lo?
  const novelEmbed = createNovelEmbed({
    status: "updated",
    title: "Mais um capítulo foi lançado na Web Novel de Re:Zero!",
    url: `https://ncode.syosetu.com/${data?.ncode}/${data?.general_all_no}`,
    description: `Confira agora o capítulo ${chapter} do arco ${arc} no ncode syosetu!`,
    fields: [{ name: "Contagem de caracteres", value: characterCount.toString() + ' (valor ainda travado)' }],
    footer: {text: `Arco ${arc} - Capítulo ${chapter}`},
  });
  console.log("\n\n\nData:\n", JSON.stringify(data));
  return interaction.reply({ embeds: [novelEmbed] });
}
