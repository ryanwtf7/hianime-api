export interface NextEpisodeScheduleJson {
  success?: boolean;
  episode?: number;
  airing_at_iso?: string;
  timeUntilAiring?: number;
}

export interface NextEpisodeSchedule {
  episode: number | null;
  airingAt: string | null;
  timeUntilAiring: number | null;
}

export const extractNextEpisodeSchedule = (
  json: NextEpisodeScheduleJson
): NextEpisodeSchedule | null => {
  if (!json || typeof json.episode !== 'number') return null;
  return {
    episode: json.episode,
    airingAt: json.airing_at_iso || null,
    timeUntilAiring: typeof json.timeUntilAiring === 'number' ? json.timeUntilAiring : null,
  };
};
