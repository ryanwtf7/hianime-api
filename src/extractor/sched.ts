export interface ScheduledAnime {
  title: string | null;
  alternativeTitle: string | null;
  id: string | null;
  time: string | null;
  episode: number | null;
}

export type ScheduleJson = ZangetsuScheduleJson;

export interface ZangetsuScheduleJson {
  id?: string | number;
  slug?: string;
  title?: string;
  name?: string;
  alternativeTitle?: string;
  episode?: number;
  episodes?: { sub?: number; dub?: number; eps?: number };
  time?: string;
}

export const extractSchedule = (items: ZangetsuScheduleJson[]): ScheduledAnime[] => {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    title: item.title || item.name || null,
    alternativeTitle: item.alternativeTitle || null,
    id: item.slug || (item.id !== undefined ? String(item.id) : null),
    time: item.time || null,
    episode: typeof item.episode === 'number' ? item.episode : null,
  }));
};
