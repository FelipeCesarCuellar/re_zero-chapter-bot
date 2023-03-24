import dotenv from 'dotenv';

dotenv.config();
const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN, PORT } = process.env;

if (!CLIENT_ID || !GUILD_ID || !DISCORD_TOKEN || !PORT) {
    throw new Error("Missing environment variables");
}

const config: Record<string, string> = {
    CLIENT_ID,
    GUILD_ID,
    DISCORD_TOKEN,
    PORT,
};

export class FeatureConfiguration {
    private autoCheck;
    constructor() {
        this.autoCheck = true;
    }
    toogleAutoCheckPermission() {
        this.autoCheck = !this.autoCheck;
        return this.autoCheck;
    }
    getAutoCheckPermission() {
        return this.autoCheck;
    }
}

export default config;