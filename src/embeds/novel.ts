import { EmbedBuilder, EmbedFooterOptions } from '@discordjs/builders';
import { APIEmbedField } from 'discord.js';

interface ICreateNovelEmbed {
    status: 'updated' | 'still' | 'scheduled';
    title: string;
    url: string;
    description: string;
    fields: APIEmbedField[];
    footer: EmbedFooterOptions;
}

const createNovelEmbed = ({ status, title, url, description, fields, footer }: ICreateNovelEmbed) => {
    let color = 0x0081F1;
    let thumbnail = 'https://i.imgur.com/pNAtlFu.png';
    let image = 'https://i.imgur.com/Ci5xEtd.png';
    if (status === 'updated') {
        color = 0x93C926;
        thumbnail = 'https://i.imgur.com/zoJVpRk.png';
        image = 'https://i.imgur.com/QaGUWx2.png';
    }
    if (status === 'scheduled') {
        color = 0xF7CE00;
        thumbnail = 'https://i.imgur.com/QDS13wu.png';
        image = 'https://i.imgur.com/R8nis4W.jpg';
    }
    const novelEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setURL(url)
        .setDescription(description)
        .setThumbnail(thumbnail)
        .addFields(fields)
        .setImage(image)
        .setTimestamp()
        .setFooter(footer);
    return novelEmbed;
}

export default createNovelEmbed;