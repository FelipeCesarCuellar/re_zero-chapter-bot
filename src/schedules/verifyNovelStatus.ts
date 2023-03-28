import cron from "node-cron";
import fs from "fs";
import csv from "csv-parser";
import RequestNovelService from "../services/ncode/RequestNovelService";
import LocalStorageDTO from "../interfaces/LocalStorageDTO";
import { client, featureConfiguration } from "../bot";
import createNovelEmbed from "../embeds/novel";
import { TextChannel } from "discord.js";
import config from "../config";

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

      const today = new Date();

      if (api_novelupdated_at <= local_novelupdated_at) {
        console.log("❌ Nenhuma alteração na Web Novel | " + today.toString());
        return;
      }

      const channelId = config.TARGET_CHANNEL_ID;
      const channel = client.channels.cache.get(channelId) as TextChannel;

      const lastLocalChapter = parseInt(local[local.length - 1].last_chapter);

      if (!lastLocalChapter) {  
        const newRegister =
          today.toISOString() +
          "," +
          data.length.toString() + 
          "," +
          data.general_all_no +
          "," +
          api_novelupdated_at.toISOString() +
          "\n";

        fs.appendFile("./src/data/storage.csv", newRegister, (err) => {
          if (err) throw err;
          console.log("❗ Alimentando o banco (1º dado)  | " + today.toString());
        });
        return;
      }

      const characterCount =
        data.length - parseInt(local[local.length - 1].total_characters);


      if (data.general_all_no > lastLocalChapter) {
        console.log("✨ Capítulo publicado             | " + today.toString());

        if (channel) {

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

          const newRegister =
            today.toISOString() +
            "," +
            data.length +
            "," +
            data.general_all_no +
            "," +
            api_novelupdated_at.toISOString() +
            "\n";
          fs.appendFile("./src/data/storage.csv", newRegister, (err) => {
            if (err) throw err;
            console.log("🎉 Dados adicionados ao registro  | ");
          });

        }

        return;
      }

      console.log("⌛ Capítulo ainda não publicado   | " + today.toString());

      if (channel) {
        const embed = createNovelEmbed({
          status: "scheduled",
          title:
            "Detectamos uma alteração na Web Novel que deve ser publicada em breve!",
          url: `https://ncode.syosetu.com/${data?.ncode}/${data?.general_all_no}`,
          description: `Logo mais um capítulo de Re:Zero deve estar sendo lançado, bora lá!`,
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

        const newRegister =
          today.toISOString() +
          "," +
          local[0].total_characters + 
          "," +
          data.general_all_no +
          "," +
          api_novelupdated_at.toISOString() +
          "\n";
        fs.appendFile("./src/data/storage.csv", newRegister, (err) => {
          if (err) throw err;
          console.log("⤴️ Registrando capítulo pendente  | ");
        });
      }
    });
}

cron.schedule("*/15 * * * *", async () => {
  await verifyNovelStatus();
});
