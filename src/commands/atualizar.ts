import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import createNovelEmbed from "../embeds/novel";
import LocalStorageDTO from "../interfaces/LocalStorageDTO";
import RequestNovelService from "../services/ncode/RequestNovelService";
import csv from "csv-parser";
import fs from 'fs';

export const data = new SlashCommandBuilder()
  .setName("atualizar")
  .setDescription(
    "atualiza manualmente as informações sobre a WN de Re:Zero, e informa sobre o último capítulo"
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  const requestNovelService = new RequestNovelService();
  const data = await requestNovelService.getDataByNcode();
  if (!data) return;
  const local: LocalStorageDTO[] = [];
  fs.createReadStream("./src/data/storage.csv")
    .pipe(csv())
    .on("data", (storageData) => {
      local.push(storageData);
    })
    .on("end", () => {
      const characterCount =
      parseInt(local[local.length - 1].total_characters) - parseInt(local[local.length - 2].total_characters);
      const embed = createNovelEmbed({
        status: "still",
        title: "Esse é o último capítulo lançado na Web Novel de Re:Zero!",
        url: `https://ncode.syosetu.com/${data?.ncode}/${data?.general_all_no}`,
        description: `Confira-o agora no ncode syosetu!`,
        fields: [
          {
            name: "Contagem de caracteres",
            value: characterCount.toString(),
          },
        ],
        footer: { text: `Meu cérebro... estremece. ~ Petelgeuse Romanée Conti` },
      });
      return interaction.editReply({ embeds: [embed] });
    });
}
