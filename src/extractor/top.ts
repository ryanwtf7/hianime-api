import { load } from 'cheerio';

export interface TopSearchAnime {
  title: string | null;
  link: string | null;
  id: string | null;
}

export const extractTopSearch = (html: string): TopSearchAnime[] => {
  const $ = load(html);
  const topSearch: TopSearchAnime[] = [];

  $('.xhashtag .item').each((i, el) => {
    const link = $(el).attr('href') || null;
    const id =
      link && !link.includes('/search?') ? link.split('/').pop()?.split('?')[0] || null : null;

    topSearch.push({
      title: $(el).text().trim() || null,
      link: link,
      id: id,
    });
  });

  return topSearch;
};
