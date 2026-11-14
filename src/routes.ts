import { Hono, Context } from 'hono';
import { load } from 'cheerio';
import handler from './utils/handler';
import filterOptions, { genreNames } from './utils/filter';
import { NotFoundError, validationError } from './utils/errors';
import { animeNumId, getHtml } from './fetch';
import { extractHomepage } from './extractor/home';
import { extractDetailpage } from './extractor/detail';
import {
  extractFilterResults,
  extractListPage,
  FilterAjaxResponse,
  ListPageResponse,
} from './extractor/list';
import { getEpisodes } from './extractor/eps';
import { getServers, ServerType } from './extractor/servers';
import { getCharacters } from './extractor/chars';
import { extractCharacterDetail } from './extractor/char';
import { extractNews } from './extractor/news';
import { extractSchedule, ScheduledAnime, ScheduleJson } from './extractor/sched';
import { extractNextEpisodeSchedule, NextEpisodeScheduleJson } from './extractor/next';
import { extractSuggestions, SuggestionAjaxResponse } from './extractor/suggest';
import { extractTopSearch } from './extractor/top';

const router = new Hono();

const GENRES = [
  'action',
  'adventure',
  'cars',
  'comedy',
  'dementia',
  'demons',
  'drama',
  'ecchi',
  'fantasy',
  'game',
  'harem',
  'historical',
  'horror',
  'isekai',
  'josei',
  'kids',
  'magic',
  'martial arts',
  'mecha',
  'military',
  'music',
  'mystery',
  'parody',
  'police',
  'psychological',
  'romance',
  'samurai',
  'school',
  'sci-fi',
  'seinen',
  'shoujo',
  'shoujo ai',
  'shounen',
  'shounen ai',
  'slice of life',
  'space',
  'sports',
  'super power',
  'supernatural',
  'thriller',
  'vampire',
  'yaoi',
  'yuri',
];

const LIST_QUERIES = [
  'top-airing',
  'most-popular',
  'most-favorite',
  'completed',
  'recently-added',
  'recently-updated',
  'top-upcoming',
  'genre',
  'producer',
  'az-list',
  'subbed-anime',
  'dubbed-anime',
  'movie',
  'tv',
  'ova',
  'ona',
  'special',
  'events',
];

router.get(
  '/home',
  handler(async () => {
    const result = await getHtml('/home');
    if (!result.success || !result.data) {
      throw new validationError(result.message || 'Failed to fetch homepage');
    }
    return extractHomepage(result.data);
  })
);

router.get(
  '/top-search',
  handler(async () => {
    const result = await getHtml('/');
    if (!result.success || !result.data) {
      throw new validationError(result.message || 'Failed to fetch top search');
    }
    return extractTopSearch(result.data);
  })
);

router.get(
  '/schedules',
  handler(async (c: Context) => {
    const today = new Date();
    const dateParam = c.req.query('date');
    let startDate = today;
    if (dateParam) {
      const [year, month, day] = dateParam.split('-').map(Number);
      startDate = new Date(year, month - 1, day);
      if (isNaN(startDate.getTime())) {
        throw new validationError('Invalid date format. Use YYYY-MM-DD');
      }
    }

    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      );
    }

    const results = await Promise.all(
      dates.map(async date => {
        try {
          const result = await getHtml(`/ajax/schedules?date=${date}`);
          if (!result.success || !result.data) throw new Error(result.message || 'Failed to fetch');
          const jsonData = JSON.parse(result.data) as Record<string, unknown>;
          const byData = jsonData.data as Record<string, unknown> | undefined;
          const items = (jsonData[date] || byData?.[date] || []) as ScheduleJson[];
          return { date, shows: extractSchedule(items) };
        } catch {
          return { date, shows: [] as ScheduledAnime[] };
        }
      })
    );

    const response: Record<string, ScheduledAnime[]> = {};
    results.forEach(r => {
      response[r.date] = r.shows;
    });
    return response;
  })
);

router.get(
  '/schedule/next/:id',
  handler(async (c: Context) => {
    const id = c.req.param('id');
    if (!id) throw new validationError('id is required');
    const data = await getHtml(`/ajax/schedule?animeId=${encodeURIComponent(animeNumId(id))}`);
    if (!data.success || !data.data) {
      throw new validationError(data.message || 'make sure id is correct');
    }
    const json = JSON.parse(data.data) as NextEpisodeScheduleJson;
    const response = extractNextEpisodeSchedule(json);
    if (!response) throw new validationError('no upcoming episode found for this anime');
    return response;
  })
);

router.get(
  '/anime/:id',
  handler(async (c: Context) => {
    const id = c.req.param('id');
    const result = await getHtml(`/${id}`);
    if (!result.success || !result.data) {
      throw new validationError(
        result.message || 'Failed to fetch detail page',
        'maybe id is incorrect : ' + id
      );
    }
    return extractDetailpage(result.data);
  })
);

router.get(
  '/animes/:query/:category?',
  handler(async (c: Context) => {
    const query = c.req.param('query')?.toLowerCase() || '';
    if (!LIST_QUERIES.includes(query)) {
      throw new validationError('invalid query', { validateQueries: LIST_QUERIES });
    }
    let category = c.req.param('category') || null;
    const page = c.req.query('page') || '1';
    if ((query === 'genre' || query === 'producer') && !category) {
      throw new validationError(`category is require for query ${query}`);
    }
    if (query !== 'genre' && query !== 'producer' && query !== 'az-list' && category) {
      category = null;
    }
    const normalized = category && category.replaceAll(' ', '-').toLowerCase();
    const endpoint = category ? `/${query}/${normalized}?page=${page}` : `/${query}?page=${page}`;
    const result = await getHtml(endpoint);
    if (!result.success || !result.data) {
      throw new validationError(result.message || 'make sure given endpoint is correct');
    }
    const response = extractListPage(result.data);
    if (response.response.length < 1) throw new NotFoundError();
    return response;
  })
);

router.get(
  '/search',
  handler(async (c: Context) => {
    const keyword = c.req.query('keyword') || null;
    const page = c.req.query('page') || '1';
    if (!keyword) throw new validationError('query is required');
    const noSpaceKeyword = keyword.trim().toLowerCase().replace(/\s+/g, '+');
    const result = await getHtml(`/search?keyword=${noSpaceKeyword}&page=${page}`);
    if (!result.success || !result.data) {
      throw new validationError(result.message || 'make sure given endpoint is correct');
    }
    const response = extractListPage(result.data);
    if (response.response.length < 1) throw new NotFoundError('page not found');
    return response;
  })
);

router.get(
  '/filter/options',
  handler(async () => filterOptions)
);

router.get(
  '/filter',
  handler(async (c: Context): Promise<ListPageResponse> => {
    const {
      keyword = null,
      sort = null,
      genres = null,
      type = null,
      status = null,
      rated = null,
      score = null,
      season = null,
      language = null,
      start_date = null,
      end_date = null,
      page = '1',
    } = c.req.query();

    if (keyword) {
      const noSpaceKeyword = keyword.trim().replace(/\s+/g, '+');
      const pageNum = Number(page) || 1;
      const url =
        pageNum > 1
          ? `/search?keyword=${encodeURIComponent(noSpaceKeyword)}&page=${pageNum}`
          : `/search?keyword=${encodeURIComponent(noSpaceKeyword)}`;
      const result = await getHtml(url);
      if (!result.success || !result.data) {
        throw new validationError(result.message || 'something went wrong will queries');
      }
      return extractListPage(result.data);
    }

    const params = new URLSearchParams();
    if (sort && filterOptions.sort.includes(sort)) params.set('sort', sort);
    if (type && filterOptions.type.includes(type) && type !== 'all') params.set('type', type);
    if (status && filterOptions.status.includes(status) && status !== 'all')
      params.set('status', status);
    if (rated && filterOptions.rated.includes(rated) && rated !== 'all') params.set('rated', rated);
    if (score && filterOptions.score.includes(score) && score !== 'all') params.set('score', score);
    if (season && filterOptions.season.includes(season) && season !== 'all')
      params.set('season', season);
    if (language && filterOptions.language.includes(language) && language !== 'all') {
      params.set('language', language);
    }
    if (genres) {
      const names = genres
        .split(',')
        .map(g => genreNames[g.trim().toLowerCase().replaceAll(' ', '-').replaceAll('_', '-')])
        .filter((n): n is string => typeof n === 'string');
      if (names.length > 0) params.set('genres', names.join(','));
    }
    const setDate = (value: string, prefix: 's' | 'e') => {
      const [y, m, d] = value.split('-').map(Number);
      if (!y || !m || !d) return;
      params.set(`${prefix}y`, String(y));
      params.set(`${prefix}m`, String(m));
      params.set(`${prefix}d`, String(d));
    };
    if (start_date) setDate(start_date, 's');
    if (end_date) setDate(end_date, 'e');
    params.set('page', String(Number(page) || 1));

    const result = await getHtml(`/ajax/filter?${params.toString()}`);
    if (!result.success || !result.data) {
      throw new validationError(result.message || 'something went wrong will queries');
    }
    return extractFilterResults(JSON.parse(result.data) as FilterAjaxResponse);
  })
);

router.get(
  '/suggestion',
  handler(async (c: Context) => {
    const keyword = c.req.query('keyword') || null;
    if (!keyword) throw new validationError('query is required');
    const noSpaceKeyword = keyword.trim().replace(/\s+/g, '+');
    const result = await getHtml(`/ajax/search?keyword=${encodeURIComponent(noSpaceKeyword)}`);
    if (!result.success || !result.data) {
      throw new validationError(result.message || 'suggestion not found');
    }
    return extractSuggestions(JSON.parse(result.data) as SuggestionAjaxResponse);
  })
);

router.get(
  '/characters/:id',
  handler(async (c: Context) => {
    const id = c.req.param('id');
    if (!id) throw new validationError('id is required');
    const page = Number(c.req.query('page') || '1') || 1;
    return getCharacters(id, page);
  })
);

router.get(
  '/character/:id',
  handler(async (c: Context) => {
    const id = c.req.param('id');
    if (!id) throw new validationError('id is required');
    // accept 4314 | character:4314 | character/4314 | people:7111
    const path =
      id.includes(':') || id.includes('/') ? `/${id.replace(':', '/')}` : `/character/${id}`;
    const result = await getHtml(path);
    if (!result.success || !result.data) {
      throw new validationError(result.message || 'make sure given endpoint is correct');
    }
    return extractCharacterDetail(result.data);
  })
);

router.get(
  '/episodes/:id',
  handler(async (c: Context) => {
    const id = c.req.param('id');
    if (!id) throw new validationError('id is required');
    return getEpisodes(id);
  })
);

router.get(
  '/servers/:episodeId',
  handler(async (c: Context) => {
    const episodeId = c.req.param('episodeId');
    if (!episodeId) throw new validationError('episodeId is required');
    const type = (c.req.query('type') || 'sub').toLowerCase();
    if (type !== 'sub' && type !== 'dub') throw new validationError('type must be sub or dub');
    return getServers(
      episodeId,
      type as ServerType,
      c.req.query('ani') || null,
      c.req.query('mal') || null,
      c.req.query('fx') || null
    );
  })
);

router.get(
  '/genres',
  handler(async () => GENRES)
);

router.get(
  '/news',
  handler(async (c: Context) => {
    const page = c.req.query('page') || '1';
    const endpoint = page === '1' ? '/news' : `/news?page=${page}`;
    const result = await getHtml(endpoint);
    if (!result.success || !result.data) {
      throw new validationError(result.message || 'Failed to fetch news');
    }
    return extractNews(result.data);
  })
);

router.get(
  '/random',
  handler(async () => {
    const result = await getHtml('/home');
    if (!result.success || !result.data) {
      throw new validationError(result.message || 'Failed to fetch homepage for random selection');
    }
    const $ = load(result.data);
    const animes: string[] = [];
    $('.flw-item').each((_, el) => {
      const link = $(el).find('.film-name .dynamic-name').attr('href');
      const id = link?.split('/').pop();
      if (id) animes.push(id);
    });
    if (animes.length === 0) throw new validationError('No anime found');
    return { id: animes[Math.floor(Math.random() * animes.length)] };
  })
);

export default router;
