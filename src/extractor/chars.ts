import { load } from 'cheerio';
import { getHtml } from '../fetch';
import { validationError } from '../utils/errors';

export interface Character {
  name: string | null;
  id: string | null;
  imageUrl: string | null;
  role: string | null;
  voiceActors: VoiceActor[];
}

export interface VoiceActor {
  name: string | null;
  id: string | null;
  imageUrl: string | null;
  cast?: string | null;
}

export interface CharactersResponse {
  pageInfo?: {
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
  };
  response: Character[];
}

const PAGE_SIZE = 12;

const idFromHref = (href: string | undefined, kind: 'character' | 'people'): string | null => {
  if (!href) return null;
  const m = href.match(new RegExp(`/${kind}/(\\d+)`));
  return m ? `${kind === 'character' ? 'character' : 'people'}:${m[1]}` : null;
};

/** Scrape characters from anime detail HTML (no external CDN API). */
export const extractCharacters = (html: string): Character[] => {
  const $ = load(html);
  const root = $('#modalVoiceActors .bac-item').length
    ? $('#modalVoiceActors .bac-item')
    : $('#characters-section .bac-item, #main-character-list .bac-item');

  const out: Character[] = [];
  root.each((_, el) => {
    const item = $(el);
    const charLink = item.find('.per-info.ltr a.pi-avatar, .per-info.ltr a.dynamic-name').first();
    const href = charLink.attr('href') || item.find('.per-info.ltr a').first().attr('href');
    const name =
      item.find('.per-info.ltr .pi-name .dynamic-name').attr('data-title') ||
      item.find('.per-info.ltr .pi-name a').text().trim() ||
      item.find('.per-info.ltr img').attr('alt') ||
      null;
    const imageUrl =
      item.find('.per-info.ltr img').attr('src') ||
      item.find('.per-info.ltr img').attr('data-src') ||
      null;
    const role = item.find('.per-info.ltr .pi-cast').first().text().trim() || null;

    const voiceActors: VoiceActor[] = [];
    item.find('.per-info.rtl').each((__, vaEl) => {
      const va = $(vaEl);
      const vaHref =
        va.find('a.pi-avatar, a.dynamic-name').first().attr('href') || va.find('a').attr('href');
      voiceActors.push({
        name:
          va.find('.pi-name .dynamic-name').attr('data-title') ||
          va.find('.pi-name a').text().trim() ||
          va.find('img').attr('alt') ||
          null,
        id: idFromHref(vaHref, 'people'),
        imageUrl: va.find('img').attr('src') || va.find('img').attr('data-src') || null,
        cast: va.find('.pi-cast').text().trim() || null,
      });
    });

    if (!name && !href) return;
    out.push({
      name,
      id: idFromHref(href, 'character'),
      imageUrl,
      role,
      voiceActors,
    });
  });
  return out;
};

export const getCharacters = async (id: string, page = 1): Promise<CharactersResponse> => {
  const result = await getHtml(`/${id}`);
  if (!result.success || !result.data) throw new validationError('characters not found');

  const all = extractCharacters(result.data);
  if (all.length < 1) throw new validationError('characters not found');

  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;

  return {
    pageInfo: {
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
    },
    response: all.slice(start, start + PAGE_SIZE),
  };
};
