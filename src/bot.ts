// import { Client } from "discord.js";
import express from "express";
// import config, { FeatureConfiguration } from "./config";
import cors from 'cors';
// import * as commandModules from "./commands";
// import "./schedules/verifyNovelStatus";

// const commands = Object(commandModules);

const app = express();
const port = 3333;
app.use(cors());
app.use(express.json());

// export const featureConfiguration = new FeatureConfiguration();
// export const client = new Client({
//   intents: ["Guilds", "GuildMessages", "DirectMessages"],
// });

// client.once("ready", () => {
//   console.log("🤖 Discord bot online!");
// });

// client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isCommand()) {
//     return;
//   }
//   const { commandName } = interaction;
//   commands[commandName].execute(interaction, client);
// });

// client.login(config.DISCORD_TOKEN);

app.get('/', (req, res) => {
  console.log('✅ Passed Health-Check');
  res.status(200).json({ status: 'ok', message: 'Bot online!' });
})

app.listen(process.env.PORT || port, () => console.log(`⬆️  Express server running on port ${process.env.PORT || port}`));

