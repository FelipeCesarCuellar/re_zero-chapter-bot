import { ActivityType, Client } from "discord.js";
import config, { FeatureConfiguration } from "./config";
import * as commandModules from "./commands";
import "./schedules/verifyNovelStatus";
import http from 'http';
import { verifyNovelStatus } from "./schedules/verifyNovelStatus";

http.createServer(function (req, res) {   
  res.write("I'm alive");   
  res.end(); 
}).listen(8080);

const commands = Object(commandModules);

export const featureConfiguration = new FeatureConfiguration();
export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

const today = new Date();

client.once('ready', () => {
  console.clear();
  console.log('🤖      Discord bot online!       | ' + today.toString());
  verifyNovelStatus(); // Primeira alimentação de dados (não espera o tempo inicial pra ocorrer)
  let activities = ['1ª Temporada de Re:Zero', '2ª Temporada de Re:Zero', 'Re:Zero - Frozen Bonds'], i = 0;
  setInterval(() => {
    client.user?.setActivity(`${activities[i++ % activities.length]}`, { type: ActivityType.Watching });
    if (i >= 2999) i = 0; // Prevenção de overflow
  }, 5000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
});

client.login(config.DISCORD_TOKEN);
