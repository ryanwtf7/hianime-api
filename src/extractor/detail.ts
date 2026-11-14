import { load } from 'cheerio';
import { Element } from 'domhandler';
import { DetailAnime, AnimeFeatured, Season } from '../types/anime';

export const extractDetailpage = (html: string): DetailAnime => {
  const $ = load(html);

  const obj: DetailAnime = {
    title: null,
    alternativeTitle: null,
    japanese: null,
    id: null,
    poster: null,
    rating: null,
    type: null,
    is18Plus: false,
    episodes: {
      sub: null,
      dub: null,
      eps: null,
    },
    synopsis: null,
    synonyms: null,
    aired: {
      from: null,
      to: null,
    },
    premiered: null,
    duration: null,
    status: null,
    MAL_score: null,
    genres: [],
    studios: [],
    producers: [],
    moreSeasons: [],
    related: [],
    mostPopular: [],
    recommended: [],
  };

  const main = $('#ani_detail .anis-content');
  const moreSeasons = $('#main-content .block_area-seasons');
  const relatedAndMostPopular = $('#main-sidebar .block_area');
  const recommended = $(
    '.block_area.block_area_category .tab-content .block_area-content .film_list-wrap .flw-item'
  );

  obj.poster =
    main.find('.film-poster .film-poster-img').attr('src') ||
    main.find('.film-poster .film-poster-img').attr('data-src') ||
    null;
  obj.is18Plus = Boolean(main.find('.film-poster .tick-rate').length > 0);

  const titleEl = main.find('.anisc-detail .film-name');
  obj.title = titleEl.text().trim() || null;
  obj.alternativeTitle = titleEl.attr('data-jname') || null;

  const info = main.find('.film-stats .tick');

  obj.rating = info.find('.tick-pg').text().trim() || null;
  obj.episodes.sub = Number(info.find('.tick-sub').text()) || null;
  obj.episodes.dub = Number(info.find('.tick-dub').text()) || null;
  obj.episodes.eps = info.find('.tick-eps').length
    ? Number(info.find('.tick-eps').text()) || null
    : Number(info.find('.tick-sub').text()) || null;

  obj.type = info.find('.item').first().text().trim() || null;

  const idLink = main.find('.film-buttons .btn');

  obj.id = idLink.length ? idLink.attr('href')?.split('?')[0].split('/').at(-1) || null : null;

  const moreInfo = main.find('.anisc-info-wrap .anisc-info .item');

  moreInfo.each((i: number, el: Element) => {
    const name = $(el).find('.item-head').text();

    switch (name) {
      case 'Overview:':
        obj.synopsis = $(el).find('.text').text().trim() || null;
        break;
      case 'Japanese:':
        obj.japanese = $(el).find('.name').text().trim() || null;
        break;
      case 'Synonyms:':
        obj.synonyms = $(el).find('.name').text().trim() || null;
        break;
      case 'Aired:': {
        const aired = $(el).find('.name').text().split('to');
        obj.aired.from = aired[0].trim() || null;
        if (aired.length > 1) {
          const secondPart = aired[1].trim();
          obj.aired.to = secondPart === '?' || !secondPart ? null : secondPart;
        } else {
          obj.aired.to = null;
        }

        break;
      }
      case 'Premiered:':
        obj.premiered = $(el).find('.name').text().trim() || null;
        break;
      case 'Duration:':
        obj.duration = $(el).find('.name').text().trim() || null;
        break;
      case 'Status:':
        obj.status = $(el).find('.name').text().trim() || null;
        break;
      case 'MAL Score:':
        obj.MAL_score = $(el).find('.name').text().trim() || null;
        break;
      case 'Genres:':
        obj.genres = $(el)
          .find('a')
          .map((i: number, genre: Element) => $(genre).text().trim())
          .get();
        break;
      case 'Studios:':
        obj.studios = $(el)
          .find('a')
          .map((i: number, studio: Element) => $(studio).attr('href')?.split('/').at(-1))
          .get() as string[];
        break;
      case 'Producers:':
        obj.producers = $(el)
          .find('a')
          .map((i: number, producer: Element) => $(producer).attr('href')?.split('/').at(-1))
          .get() as string[];
        break;
      default:
        break;
    }
  });

  if (moreSeasons.length) {
    $(moreSeasons)
      .find('.os-list .os-item')
      .each((i, el) => {
        const innerObj: Season = {
          title: null,
          alternativeTitle: null,
          id: null,
          poster: null,
          isActive: false,
        };
        innerObj.title = $(el).attr('title') || null;
        innerObj.id = $(el).attr('href')?.split('/').pop() || null;
        innerObj.alternativeTitle = $(el).find('.title').text();
        const posterStyle = $(el).find('.season-poster').attr('style');

        if (posterStyle) {
          const match = posterStyle.match(/url\((['"])?(.*?)\1\)/);
          innerObj.poster = match ? match[2] : null;
        }

        innerObj.isActive = $(el).hasClass('active');

        obj.moreSeasons.push(innerObj);
      });
  }

  const extractRelatedAndMostPopular = (index: number, array: AnimeFeatured[]) => {
    relatedAndMostPopular
      .eq(index)
      .find('.cbox .ulclear li')
      .each((i, el) => {
        const innerObj: AnimeFeatured = {
          title: null,
          alternativeTitle: null,
          id: null,
          poster: null,
          type: null,
          episodes: {
            sub: null,
            dub: null,
            eps: null,
          },
        };

        const titleEl = $(el).find('.film-name .dynamic-name');
        innerObj.title = titleEl.text().trim() || null;
        innerObj.alternativeTitle = titleEl.attr('data-jname') || null;
        innerObj.id = titleEl.attr('href')?.split('/').pop() || null;

        const infor = $(el).find('.fd-infor .tick');

        innerObj.type = infor
          .contents()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((i: number, el: any) => {
            return el.type === 'text' && $(el).text().trim() !== '';
          })
          .text()
          .trim();

        innerObj.episodes.sub = Number(infor.find('.tick-sub').text()) || null;
        innerObj.episodes.dub = Number(infor.find('.tick-dub').text()) || null;

        const epsEl = infor.find('.tick-eps').length
          ? infor.find('.tick-eps').text()
          : infor.find('.tick-sub').text();

        innerObj.episodes.eps = Number(epsEl) || null;

        innerObj.poster = $(el).find('.film-poster .film-poster-img').attr('data-src') || null;

        array.push(innerObj);
      });
  };
  if (relatedAndMostPopular.length > 1) {
    extractRelatedAndMostPopular(0, obj.related);
    extractRelatedAndMostPopular(1, obj.mostPopular);
  } else {
    extractRelatedAndMostPopular(0, obj.mostPopular);
  }

  recommended.each((i: number, el: Element) => {
    const innerObj: AnimeFeatured & { is18Plus: boolean; duration: string | null } = {
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
      is18Plus: false,
    };
    const titleEl = $(el).find('.film-detail .film-name .dynamic-name');
    innerObj.title =
      titleEl.attr('title') || titleEl.attr('data-title') || titleEl.text().trim() || null;
    innerObj.alternativeTitle = titleEl.attr('data-jname') || null;
    innerObj.id = titleEl.attr('href')?.split('?')[0].split('/').pop() || null;
    innerObj.type = $(el).find('.fd-infor .fdi-item').first().text().trim() || null;
    innerObj.duration =
      $(el).find('.fd-infor .fdi-duration').text().trim() ||
      $(el).find('.fd-infor .fdi-item').eq(1).text().trim() ||
      null;

    innerObj.poster =
      $(el).find('.film-poster .film-poster-img').attr('data-src') ||
      $(el).find('.film-poster .film-poster-img').attr('src') ||
      null;
    innerObj.is18Plus = $(el).find('.film-poster').has('.tick-rate').length > 0;

    innerObj.episodes.sub = Number($(el).find('.film-poster .tick .tick-sub').text()) || null;
    innerObj.episodes.dub = Number($(el).find('.film-poster .tick .tick-dub').text()) || null;
    const epsText = $(el).find('.film-poster .tick .tick-eps').length
      ? $(el).find('.film-poster .tick .tick-eps').text()
      : $(el).find('.film-poster .tick .tick-sub').text();

    innerObj.episodes.eps = Number(epsText) || null;

    obj.recommended.push(innerObj);
  });

  return obj;
};
