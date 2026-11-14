export interface Suggestion {
  title: string | null;
  alternativeTitle: string | null;
  poster: string | null;
  id: string | null;
  aired: string | null;
  type: string | null;
  duration: string | null;
}

export interface SuggestionJson {
  id?: string | number;
  slug?: string;
  title?: string;
  alternativeTitle?: string;
  titles?: { romaji?: string };
  poster?: string;
  images?: { poster?: string };
  year?: string | number;
  type?: string;
  duration?: string;
  jname_native?: string;
}

export interface SuggestionAjaxResponse {
  success?: boolean;
  response?: SuggestionJson[];
}

export const extractSuggestions = (json: SuggestionAjaxResponse): Suggestion[] => {
  const items = Array.isArray(json.response) ? json.response : [];
  return items.map(anime => ({
    title: anime.title || null,
    alternativeTitle: anime.alternativeTitle || anime.titles?.romaji || anime.jname_native || null,
    poster: anime.images?.poster || anime.poster || null,
    id: anime.slug || (anime.id !== undefined ? String(anime.id) : null),
    aired: anime.year !== undefined ? String(anime.year) : null,
    type: anime.type || null,
    duration: anime.duration || null,
  }));
};
