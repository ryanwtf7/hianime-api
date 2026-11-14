import { load } from 'cheerio';

export interface AnimeAppearance {
  title: string | null;
  alternativeTitle: string | null;
  id: string | null;
  poster: string | null;
  role: string | null;
  type: string | null;
}

export interface VoiceActorShort {
  name: string | null;
  imageUrl: string | null;
  id: string | null;
  language: string | null;
}

export interface VoiceActingRole {
  anime: {
    title: string | null;
    poster: string | null;
    id: string | null;
    typeAndYear: string | null;
  };
  character: {
    name: string | null;
    imageUrl: string | null;
    id: string | null;
    role: string | null;
  };
}

export interface CharacterDetail {
  name: string | null;
  type: 'people' | 'character' | string;
  japanese: string | null;
  imageUrl: string | null;
  bio: string | null;
  animeAppearances?: AnimeAppearance[];
  voiceActors?: VoiceActorShort[];
  voiceActingRoles?: VoiceActingRole[];
}

export const extractCharacterDetail = (html: string): CharacterDetail => {
  const $ = load(html);

  const transformId = (id: string | undefined): string | null => {
    if (!id) return null;
    return id.replace(/^\//, '').replace('/', ':');
  };

  const whoIsHe =
    $('nav .breadcrumb .active').prev().find('a').text() === 'People' ? 'people' : 'character';

  const obj: CharacterDetail = {
    name: null,
    type: whoIsHe,
    japanese: null,
    imageUrl: null,
    bio: null,
  };

  obj.imageUrl = $('.actor-page-wrap .avatar img').attr('src') || null;
  const allDetails = $('.apw-detail');
  obj.name = allDetails.find('.name').text().trim() || null;
  obj.japanese = allDetails.find('.sub-name').text().trim() || null;

  obj.bio = allDetails.find('.tab-content #bio .bio').html()?.trim() || null;

  if (whoIsHe === 'character') {
    obj.animeAppearances = [];

    allDetails.find('.tab-content #animeography .anif-block-ul .ulclear li').each((i, el) => {
      const innerObj: AnimeAppearance = {
        title: null,
        alternativeTitle: null,
        id: null,
        poster: null,
        role: null,
        type: null,
      };
      const titleEl = $(el).find('.dynamic-name');
      innerObj.title = titleEl.attr('title') || null;
      innerObj.alternativeTitle = titleEl.attr('data-jname') || null;
      innerObj.id = transformId(titleEl.attr('href'));

      innerObj.poster = $(el).find('.film-poster .film-poster-img').attr('src') || null;
      innerObj.role =
        $(el).find('.fd-infor .fdi-item').first().text().trim().split(' ').shift() || null;
      innerObj.type = $(el).find('.fd-infor .fdi-item').last().text().trim() || null;

      obj.animeAppearances?.push(innerObj);
    });

    obj.voiceActors = [];
    allDetails.find('#voiactor .sub-box-list .per-info').each((i, el) => {
      const innerObj: VoiceActorShort = {
        name: null,
        imageUrl: null,
        id: null,
        language: null,
      };
      innerObj.imageUrl = $(el).find('.pi-avatar img').attr('src') || null;
      innerObj.name = $(el).find('.pi-name a').text().trim() || null;
      innerObj.id = transformId($(el).find('.pi-name a').attr('href'));

      innerObj.language = $(el).find('.pi-cast').text().trim() || null;

      obj.voiceActors?.push(innerObj);
    });
  } else {
    obj.voiceActingRoles = [];
    $('#voice .bac-list-wrap .bac-item').each((i, el) => {
      const animeInfo = $(el).find('.per-info.anime-info');
      const characterInfo = $(el).find('.per-info.rtl');

      const innerObj: VoiceActingRole = {
        anime: {
          title: null,
          poster: null,
          id: null,
          typeAndYear: null,
        },
        character: {
          name: null,
          imageUrl: null,
          id: null,
          role: null,
        },
      };

      innerObj.anime.title = animeInfo.find('.pi-name a').text().trim();
      innerObj.anime.id = animeInfo.find('.pi-name a').attr('href')?.split('/').pop() || null;
      innerObj.anime.poster = animeInfo.find('.pi-avatar img').attr('src') || null;
      innerObj.anime.typeAndYear = animeInfo.find('.pi-cast').text().trim();

      innerObj.character.name = characterInfo.find('.pi-name a').text().trim();
      innerObj.character.id = transformId(characterInfo.find('.pi-name a').attr('href'));
      innerObj.character.imageUrl = characterInfo.find('.pi-avatar img').attr('src') || null;
      innerObj.character.role = characterInfo.find('.pi-cast').text().trim();

      obj.voiceActingRoles?.push(innerObj);
    });
  }

  return obj;
};
