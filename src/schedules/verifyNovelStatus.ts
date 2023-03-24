import cron from "node-cron";
import fs from "fs";
import csv from "csv-parser";
import RequestNovelService from "../services/ncode/RequestNovelService";
import LocalStorageDTO from "../interfaces/LocalStorageDTO";
import { client, featureConfiguration } from "../bot";
import createNovelEmbed from "../embeds/novel";
import { TextChannel } from "discord.js";

export async function verifyNovelStatus() {
  if (!featureConfiguration.getAutoCheckPermission()) return;
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
      const local_novelupdated_at = new Date(
        local[local.length - 1].novelupdated_at
      );
      const api_novelupdated_at = new Date(data.novelupdated_at);

      if (api_novelupdated_at <= local_novelupdated_at) {
        console.log("❌ Nenhuma alteração na Web Novel");
        return;
      }
      const channelId = "409525868264816662"; // ID do canal onde a mensagem deve ser enviada;
      const channel = client.channels.cache.get(channelId) as TextChannel;

      const local_general_lastup = new Date(
        local[local.length - 1].general_lastup
      );
      const api_general_lastup = new Date(data.general_lastup);
      const characterCount =
        data.length - parseInt(local[local.length - 1].total_characters);

      if (api_general_lastup > local_general_lastup) {
        console.log("✨ Capítulo publicado!");

        if (channel) {
          // const current_arc = 8; // Não encontrei um método bom o suficiente para identificar o arco atual automaticamente.
          // const chapter_arc_bias = 620 // Viés para indicar quantos capítulos há antes do arco -> Capítulos B estão quebrando a lógica de qualquer maneira.
          // const additional_bias = 0 // Viés para ser levado em conta na hora de enumerar o capítulo (caso seja publicado algo fora do arco).

          // A ideia inicial era calcular o capítulo do arco por `Valor total de capítulos - chapter_arc_bias - additional_bias`, atualizando manualmente sempre que algo assim ocorresse (não prático).

          const embed = createNovelEmbed({
            status: "updated",
            title: "Mais um capítulo foi lançado na Web Novel de Re:Zero!",
            url: `https://ncode.syosetu.com/${data?.ncode}/${data?.general_all_no}`,
            description: `Confira agora o capítulo no ncode syosetu!`,
            fields: [
              {
                name: "Contagem de caracteres",
                value: characterCount.toString(),
              },
            ],
            footer: {
              text: `Não dá pra levantar uma pedra Quayne sozinho ~ Garfiel`,
            },
          });

          channel.send({ embeds: [embed] });

          // Só atualizo no CSV quando realmente o capítulo lança (por programação defensiva).
          const today = new Date();

          const newRegister =
            today.toISOString() +
            "," +
            data.length +
            "," +
            data.general_all_no +
            "," +
            api_novelupdated_at.toISOString() +
            "," +
            api_general_lastup.toISOString() +
            "\n";
          fs.appendFile("./src/data/storage.csv", newRegister, (err) => {
            if (err) throw err;
            console.log("Dados adicionados ao registro!");
          });
        }
        return;
      }

      console.log("⌛ Capítulo ainda não foi publicado");
      if (channel) {
        const embed = createNovelEmbed({
          status: "scheduled",
          title:
            "Detectamos uma alteração na Web Novel que deve ser publicada em breve!",
          url: `https://ncode.syosetu.com/${data?.ncode}/${data?.general_all_no}`,
          description: `Logo logo mais um capítulo de Re:Zero deve estar sendo lançado, Hype!`,
          fields: [
            {
              name: "Contagem de caracteres",
              value: characterCount.toString(),
            },
          ],
          footer: {
            text: `"Um milhão de desculpas não é igual a um obrigado" ~ Emilia`,
          },
        });

        channel.send({ embeds: [embed] });

        if (JSON.stringify(local[0]) === "{}") {
          const today = new Date();

          const newRegister =
            today.toISOString() +
            "," +
            data.length +
            "," +
            data.general_all_no +
            "," +
            api_novelupdated_at.toISOString() +
            "," +
            api_general_lastup.toISOString() +
            "\n";
          fs.appendFile("./src/data/storage.csv", newRegister, (err) => {
            if (err) throw err;
            console.log("Criada a primeira linha pro caso de banco vazio.");
          });
        }
      }
    });
}

// cron.schedule('*/15 * * * *', async () => {
//    await verifyNovelStatus();
// });
