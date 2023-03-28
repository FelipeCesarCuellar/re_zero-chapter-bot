import dotenv from 'dotenv';

dotenv.config();
const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN, TARGET_CHANNEL_ID, NCODE } = process.env;

if (!CLIENT_ID || !GUILD_ID || !DISCORD_TOKEN || !TARGET_CHANNEL_ID || !NCODE) {
    throw new Error("Missing environment variables");
}

const config: Record<string, string> = {
    CLIENT_ID,
    GUILD_ID,
    DISCORD_TOKEN,
    TARGET_CHANNEL_ID,
    NCODE,
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