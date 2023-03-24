import { Client } from "discord.js";
import config, { FeatureConfiguration } from "./config";
import * as commandModules from "./commands";
import "./schedules/verifyNovelStatus";

const commands = Object(commandModules);

export const featureConfiguration = new FeatureConfiguration();
export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
  console.log("🤖 Discord bot online!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
});

client.login(config.DISCORD_TOKEN);
