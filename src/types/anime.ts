export interface AnimeEpisodes {
  sub: number | null;
  dub: number | null;
  eps: number | null;
}

export interface AnimeCommon {
  title: string | null;
  alternativeTitle: string | null;
  id: string | null;
  poster: string | null;
}

export interface AnimeFeatured extends AnimeCommon {
  type: string | null;
  duration?: string | null;
  episodes: AnimeEpisodes;
}

export interface SpotlightAnime extends AnimeFeatured {
  rank: number;
  quality: string | null;
  duration: string | null;
  aired: string | null;
  synopsis: string | null;
}

export interface TrendingAnime extends AnimeCommon {
  rank: number;
}

export interface HomePage {
  spotlight: SpotlightAnime[];
  trending: TrendingAnime[];
  topAiring: AnimeFeatured[];
  mostPopular: AnimeFeatured[];
  mostFavorite: AnimeFeatured[];
  latestCompleted: AnimeFeatured[];
  latestEpisode: AnimeFeatured[];
  newAdded: AnimeFeatured[];
  topUpcoming: AnimeFeatured[];
  top10: {
    today: TrendingAnime[] | null;
    week: TrendingAnime[] | null;
    month: TrendingAnime[] | null;
  };
  genres: string[];
}

export interface Season {
  title: string | null;
  id: string | null;
  alternativeTitle: string | null;
  poster: string | null;
  isActive: boolean;
}

export interface DetailAnime extends AnimeFeatured {
  japanese: string | null;
  rating: string | null;
  is18Plus: boolean;
  synopsis: string | null;
  synonyms: string | null;
  aired: {
    from: string | null;
    to: string | null;
  };
  premiered: string | null;
  duration: string | null;
  status: string | null;
  MAL_score: string | null;
  genres: string[];
  studios: string[];
  producers: string[];
  moreSeasons: Season[];
  related: AnimeFeatured[];
  mostPopular: AnimeFeatured[];
  recommended: (AnimeFeatured & { is18Plus: boolean; duration: string | null })[];
}
