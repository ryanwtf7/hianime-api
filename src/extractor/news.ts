import { load } from 'cheerio';

export interface News {
  id: string | null;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  uploadedAt: string | null;
  url: string | null;
}

export interface NewsResponse {
  news: News[];
  total: number;
}

export const extractNews = (html: string): NewsResponse => {
  const $ = load(html);
  const news: News[] = [];

  $('.zr-news-list .item').each((i, el) => {
    const obj: News = {
      id: null,
      title: null,
      description: null,
      thumbnail: null,
      uploadedAt: null,
      url: null,
    };

    const link = $(el).find('.zrn-title').attr('href');
    obj.id = link?.split('/').pop() || null;
    obj.url = link || null;

    obj.title = $(el).find('.news-title').text().trim() || null;
    obj.description = $(el).find('.description').text().trim() || null;
    obj.thumbnail = $(el).find('.zrn-image').attr('src') || null;
    obj.uploadedAt = $(el).find('.time-posted').text().trim() || null;

    if (obj.title) {
      news.push(obj);
    }
  });

  return {
    news,
    total: news.length,
  };
};
