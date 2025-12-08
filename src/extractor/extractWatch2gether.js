import * as cheerio from 'cheerio';

export const extractWatch2gether = (html) => {
    const $ = cheerio.load(html);
    const rooms = [];

    $('.live-item').each((i, el) => {
        const obj = {
            id: null,
            animeId: null,
            animeTitle: null,
            roomTitle: null,
            poster: null,
            episode: null,
            type: null,
            status: null,
            createdBy: null,
            createdAt: null,
            url: null,
        };

        obj.id = $(el).attr('data-id') || null;

        const link = $(el).find('.live-thumbnail').attr('href');
        obj.animeId = link?.split('/').pop() || null;
        obj.url = link || null;

        obj.animeTitle = $(el).find('.anime-name').text().trim() || null;
        obj.roomTitle = $(el).find('.live-name a').text().trim() || null;
        obj.poster = $(el).find('.live-thumbnail-img').attr('src') || null;
        obj.episode = $(el).find('.live-tick-eps').text().trim() || null;
        obj.type = $(el).find('.live-tick-type').text().trim() || null;

        const statusEl = $(el).find('.live-tick-pending');
        obj.status = statusEl.length ? statusEl.text().trim() : 'On-air';

        obj.createdBy = $(el).find('.uc-info strong').text().trim() || null;
        obj.createdAt = $(el).find('.uc-info .time').text().trim() || null;
        
        if (obj.id) {
            rooms.push(obj);
        }
    });

    return {
        rooms,
        total: rooms.length
    };
};
