import { Client } from "discord.js";
import express from "express";
import config, { FeatureConfiguration } from "./config";
import cors from 'cors';
import * as commandModules from "./commands";
import "./schedules/verifyNovelStatus";
import http from 'http';

http.createServer(function (req, res) {   
  res.write("I'm alive");   
  res.end(); 
}).listen(8080);

// const app = express();
// const port = config.port;
// app.use(cors());
// app.use(express.json());

// let firstInteraction = true;

// app.get('/', (req, res) => {
//   if (firstInteraction) {
//     console.log('✅ Passed Health-Check');
//     firstInteraction = false;
//   }
  
//   res.status(200).json({ status: 'ok', message: 'Bot online!' });
// })

// app.listen(process.env.PORT || port, () => console.log(`⬆️  Express server running on port ${process.env.PORT || port}`));

const commands = Object(commandModules);

export const featureConfiguration = new FeatureConfiguration();
export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
  console.log("🤖 Discord bot online!");
  let activities = [`1`, `2`, `3`], i = 0;
  // @ts-ignore
  setInterval(() => client.user.setActivity(`${activities[i++ %  activities.length]}`), 5000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
});

client.login(config.DISCORD_TOKEN);
