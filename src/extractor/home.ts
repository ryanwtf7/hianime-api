import { load } from 'cheerio';
import { Element } from 'domhandler';
import { HomePage, SpotlightAnime, TrendingAnime, AnimeFeatured } from '../types/anime';

export const extractHomepage = (html: string): HomePage => {
  const $ = load(html);

  const response: HomePage = {
    spotlight: [],
    trending: [],
    topAiring: [],
    mostPopular: [],
    mostFavorite: [],
    latestCompleted: [],
    latestEpisode: [],
    newAdded: [],
    topUpcoming: [],
    top10: {
      today: null,
      week: null,
      month: null,
    },
    genres: [],
  };

  const $spotlight = $('.deslide-wrap .swiper-wrapper .swiper-slide');
  const $featured = $('.anif-blocks .row .anif-block');
  const $home = $('section.block_area');
  const $top10 = $('.block_area .cbox');
  const $genres = $('.sb-genre-list');

  $($spotlight).each((i: number, el: Element) => {
    const obj: SpotlightAnime = {
      title: null,
      alternativeTitle: null,
      id: null,
      poster: null,
      rank: i + 1,
      type: null,
      quality: null,
      duration: null,
      aired: null,
      synopsis: null,
      episodes: {
        sub: null,
        dub: null,
        eps: null,
      },
    };
    const hrefs = $(el)
      .find('.desi-buttons a')
      .toArray()
      .map(a => $(a).attr('href') || '');
    const detailHref = hrefs.find(h => h && !h.startsWith('/watch')) || hrefs[0] || '';
    obj.id = detailHref.split('?')[0].split('/').at(-1) || null;
    obj.poster =
      $(el).find('.deslide-cover .film-poster-img').attr('data-src') ||
      $(el).find('.deslide-cover-img img').attr('src') ||
      null;

    const titles = $(el).find('.desi-head-title');
    obj.title = titles.text().trim() || null;
    obj.alternativeTitle = titles.attr('data-jname') || null;

    obj.synopsis = $(el).find('.desi-description').text().trim();

    const details = $(el).find('.sc-detail');
    obj.type = details.find('.scd-item').eq(0).text().trim();
    obj.duration = details.find('.scd-item').eq(1).text().trim();
    obj.aired = details.find('.scd-item.m-hide').text().trim();
    obj.quality = details.find('.scd-item .quality').text().trim();

    obj.episodes.sub = Number(details.find('.tick-sub').text().trim()) || null;
    obj.episodes.dub = Number(details.find('.tick-dub').text().trim()) || null;

    const epsText = details.find('.tick-eps').length
      ? details.find('.tick-eps').text().trim()
      : details.find('.tick-sub').text().trim();
    obj.episodes.eps = Number(epsText) || null;

    response.spotlight.push(obj);
  });
  $('#tl-trending .swiper-wrapper .swiper-slide').each((i: number, el: Element) => {
    const card = $(el).find('.tl-card');
    const titleEl = card.find('.tl-rank-title');
    const linkEl = card.find('a.tl-poster-link');
    response.trending.push({
      title: titleEl.attr('data-title') || titleEl.text().trim() || null,
      alternativeTitle: titleEl.attr('data-jname') || null,
      rank: i + 1,
      poster:
        card.find('img.tl-poster-img').attr('data-src') ||
        card.find('img.tl-poster-img').attr('src') ||
        null,
      id: card.attr('data-id') || linkEl.attr('href')?.split('?')[0].split('/').at(-1) || null,
    });
  });
  $($featured).each((i: number, el: Element) => {
    const data = $(el)
      .find('.anif-block-ul ul li')
      .map((index: number, item: Element) => {
        const obj: AnimeFeatured = {
          title: null,
          alternativeTitle: null,
          id: null,
          poster: null,
          type: null,
          duration: null,
          episodes: {
            sub: null,
            dub: null,
            eps: null,
          },
        };
        const titleEl = $(item).find('.film-detail .film-name a');
        obj.title =
          titleEl.attr('title') || titleEl.attr('data-title') || titleEl.text().trim() || null;
        obj.alternativeTitle = titleEl.attr('data-jname') || null;
        obj.id = titleEl.attr('href')?.split('?')[0].split('/').at(-1) || null;

        obj.poster =
          $(item).find('.film-poster .film-poster-img').attr('data-src') ||
          $(item).find('.film-poster .film-poster-img').attr('src') ||
          null;

        // Extract type (first fdi-item) and duration (second fdi-item if exists)
        const infoItems = $(item).find('.fd-infor .fdi-item');
        obj.type = infoItems.eq(0).text().trim() || null;
        obj.duration = infoItems.eq(1).text().trim() || null;

        obj.episodes.sub = Number($(item).find('.tick .tick-sub').text()) || null;
        obj.episodes.dub = Number($(item).find('.tick .tick-dub').text()) || null;

        const epsText = $(item).find('.fd-infor .tick-eps').length
          ? $(item).find('.fd-infor .tick-eps').text()
          : $(item).find('.fd-infor .tick-sub').text();

        obj.episodes.eps = Number(epsText) || null;

        return obj;
      })
      .get();

    const dataType = $(el).find('.anif-block-header').text().replace(/\s+/g, '');
    const normalizedDataType = (dataType.charAt(0).toLowerCase() +
      dataType.slice(1)) as keyof HomePage;

    (response[normalizedDataType] as AnimeFeatured[]) = data as AnimeFeatured[];
  });

  $($home).each((i: number, el: Element) => {
    const data = $(el)
      .find('.tab-content .film_list-wrap .flw-item')
      .map((index: number, item: Element) => {
        const obj: AnimeFeatured = {
          title: null,
          alternativeTitle: null,
          id: null,
          poster: null,
          type: null, // Default
          episodes: {
            sub: null,
            dub: null,
            eps: null,
          },
        };
        const titleEl = $(item).find('.film-detail .film-name .dynamic-name');
        obj.title =
          titleEl.attr('title') || titleEl.attr('data-title') || titleEl.text().trim() || null;
        obj.alternativeTitle = titleEl.attr('data-jname') || null;
        obj.id = titleEl.attr('href')?.split('?')[0].split('/').at(-1) || null;

        obj.poster =
          $(item).find('.film-poster img').attr('data-src') ||
          $(item).find('.film-poster img').attr('src') ||
          null;

        const episodesEl = $(item).find('.film-poster .tick');
        obj.episodes.sub = Number($(episodesEl).find('.tick-sub').text()) || null;
        obj.episodes.dub = Number($(episodesEl).find('.tick-dub').text()) || null;

        const epsText = $(episodesEl).find('.tick-eps').length
          ? $(episodesEl).find('.tick-eps').text()
          : $(episodesEl).find('.tick-sub').text();

        obj.episodes.eps = Number(epsText) || null;

        return obj;
      })
      .get();

    const dataType = $(el).find('.cat-heading').first().text().replace(/\s+/g, '');
    const normalizedDataType = (dataType.charAt(0).toLowerCase() +
      dataType.slice(1)) as keyof HomePage;

    if (data.length < 1) return;
    if (normalizedDataType in response) {
      const current = response[normalizedDataType] as unknown;
      if (Array.isArray(current) && current.length > 0) return;
      (response[normalizedDataType] as AnimeFeatured[]) = data as AnimeFeatured[];
    }
  });

  const extractTopTen = (id: string): TrendingAnime[] => {
    const res = $top10
      .find(`${id} ul li`)
      .map((i: number, el: Element) => {
        const linkEl = $(el).find('.film-name a');
        const obj: TrendingAnime = {
          title: linkEl.attr('title') || linkEl.text().trim() || null,
          rank: i + 1,
          alternativeTitle: linkEl.attr('data-jname') || null,
          id: linkEl.attr('href')?.split('?')[0].split('/').pop() || null,
          poster:
            $(el).find('.film-poster img').attr('data-src') ||
            $(el).find('.film-poster img').attr('src') ||
            null,
        };
        return obj;
      })
      .get();
    return res;
  };

  response.top10.today = extractTopTen('#top-viewed-day');
  response.top10.week = extractTopTen('#top-viewed-week');
  response.top10.month = extractTopTen('#top-viewed-month');
  $($genres)
    .find('li')
    .each((i: number, el: Element) => {
      const genre = $(el).find('a').attr('title')?.toLocaleLowerCase() || '';
      response.genres.push(genre);
    });
  return response;
};
