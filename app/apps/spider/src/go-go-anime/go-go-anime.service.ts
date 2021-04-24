import { HttpService, Injectable } from '@nestjs/common';
import { load as cheerioLoad } from 'cheerio';
import {
  IAnimeEpisodeRet,
  IAnimeInfoRet,
  IAnimeListRet,
  INameLinkRet
} from './go-go-anime.interface';

@Injectable()
export class GoGoAnimeService {
  public readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = 'https://gogoanime.ai';
  }

  async getGenres(): Promise<string[]> {
    const res = await this.httpService.get(this.baseUrl).toPromise();
    const $ = cheerioLoad(res.data);

    const genres = new Array<string>();

    $('nav.menu_series.genre ul li').each((_, ele) => {
      const a = $(ele).children('a');

      genres.push(a.attr('title'));
    });

    return genres;
  }

  async getRecentRelease(pageNo: number): Promise<IAnimeListRet> {
    const url = new URL(
      'https://ajax.gogo-load.com/ajax/page-recent-release.html'
    );
    url.searchParams.set('page', String(pageNo));

    const res = await this.httpService.get(url.toString()).toPromise();
    const $ = cheerioLoad(res.data);

    const paginations = new Array<number>();
    const series = new Array<INameLinkRet>();

    $(
      'div.anime_name_pagination.intro div.pagination.recent ul.pagination-list li'
    ).each((_, ele) => {
      const a = $(ele).children('a');

      const number = a.data('page');

      paginations.push(number);
    });

    $('div.last_episodes.loaddub ul.items li').each((_, ele) => {
      const a = $(ele).find('p.name a');

      const link = a.attr('href');
      const name = a.attr('title');

      series.push({ link, name });
    });

    return {
      list: series,
      pageNo,
      paginations
    };
  }

  async getPopular(pageNo: number): Promise<IAnimeListRet> {
    const url = new URL(
      'https://ajax.gogo-load.com/ajax/page-recent-release-ongoing.html'
    );
    url.searchParams.set('page', String(pageNo));

    const res = await this.httpService.get(url.toString()).toPromise();
    const $ = cheerioLoad(res.data);

    const paginations = new Array<number>();
    const series = new Array<INameLinkRet>();

    $(
      'div.anime_name_pagination div.pagination.popular ul.pagination-list li'
    ).each((_, ele) => {
      const a = $(ele).children('a');

      paginations.push(Number(a.data('page')));
    });

    $('div.added_series_body.popular ul li').each((_, ele) => {
      const a = $(ele).children('a');

      const link = a.attr('href');
      const name = a.attr('title');

      series.push({ link, name });
    });

    return {
      pageNo,
      list: series,
      paginations
    };
  }

  async getRecentlyAdded(): Promise<Array<INameLinkRet>> {
    const res = await this.httpService.get(this.baseUrl).toPromise();
    const $ = cheerioLoad(res.data);

    const series = new Array<INameLinkRet>();

    $('div.added_series_body.final ul.listing li').each((_, ele) => {
      const a = $(ele).children('a');

      const link = a.attr('href');
      const name = a.attr('title');

      series.push({ link, name });
    });

    return series;
  }

  async getNewSeasons(pageNo: number): Promise<IAnimeListRet> {
    const url = new URL('/new-season.html', this.baseUrl);
    url.searchParams.set('page', String(pageNo));

    const res = await this.httpService.get(url.toString()).toPromise();
    const $ = cheerioLoad(res.data);

    const paginations = new Array<number>();
    const series = new Array<INameLinkRet>();

    $('div.anime_name_pagination div.pagination ul.pagination-list li').each(
      (_, ele) => {
        const a = $(ele).children('a');

        const number = a.data('page');

        paginations.push(number);
      }
    );

    $('div.last_episodes ul.items li').each((_, ele) => {
      const a = $(ele).find('p.name a');

      const link = a.attr('href');
      const name = a.attr('title');

      series.push({ link, name });
    });

    return {
      pageNo,
      list: series,
      paginations
    };
  }

  async getMovieList(pageNo: number): Promise<IAnimeListRet> {
    const url = new URL('/anime-movies.html', this.baseUrl);
    url.searchParams.set('page', String(pageNo));

    const res = await this.httpService.get(url.toString()).toPromise();
    const $ = cheerioLoad(res.data);

    const series = new Array<INameLinkRet>();
    const paginations = new Array<number>();

    $('div.anime_name_pagination div.pagination ul.pagination-list li').each(
      (_, ele) => {
        const a = $(ele).children('a');

        const page = a.data('page');

        paginations.push(page);
      }
    );

    $('div.last_episodes ul.items li').each((_, ele) => {
      const a = $(ele).find('p.name a');
      const link = a.attr('href');
      const name = a.attr('title');

      series.push({ link, name });
    });

    return {
      list: series,
      pageNo,
      paginations
    };
  }

  async getAnimeList(pageNo: number): Promise<IAnimeListRet> {
    const url = new URL('/anime-list.html', this.baseUrl);
    url.searchParams.set('page', String(pageNo));

    const res = await this.httpService.get(url.toString()).toPromise();
    const $ = cheerioLoad(res.data);

    const paginations = new Array<number>();
    const list = new Array<INameLinkRet>();

    $('.pagination ul.pagination-list li').each((_, ele) => {
      const e = $(ele).children('a');

      const dataPage = e.attr('data-page');
      paginations.push(Number(dataPage));
    });

    $('.anime_list_body ul li').each((_, ele) => {
      const e = $(ele).children('a');

      const title = e.text().trim();
      const href = e.attr('href');

      list.push({ name: title, link: href });
    });

    return {
      pageNo,
      list,
      paginations
    };
  }

  async getAnimeInfo(link: string): Promise<IAnimeInfoRet> {
    const url = new URL(link, this.baseUrl);

    const res = await this.httpService.get(url.toString()).toPromise();
    const $ = cheerioLoad(res.data);

    const animeInfoBody = $('.anime_info_body');
    const animeInfoBodyBg = animeInfoBody.children('.anime_info_body_bg');

    const movieId = $('input#movie_id.movie_id[type="hidden"]').attr('value');
    const image = animeInfoBodyBg.children('img').attr('src');
    const title = animeInfoBodyBg.children('h1').text().trim();

    const data: IAnimeInfoRet = {
      link,
      movieId,
      image,
      title,
      type: null,
      summary: null,
      genres: [],
      released: null,
      status: null,
      otherNames: [],
      episodeCount: 0,
      episodePages: []
    };

    animeInfoBodyBg.children('p.type').each((_, ele) => {
      const p = $(ele);

      const type = p
        .children('span')
        .text()
        .trim()
        .replace(':', '')
        .toLowerCase();

      let text = p.text();
      text = text.slice(`${type} :`.length).trim();

      if (type === 'type') {
        data.type = text;
        return;
      }

      if (type === 'plot summary') {
        data.summary = text;
        return;
      }

      if (type === 'genre') {
        data.genres = text.split(', ');
        return;
      }

      if (type === 'status') {
        data.status = text;
        return;
      }

      if (type === 'released') {
        data.released = text;
        return;
      }

      if (type === 'other name') {
        data.otherNames = text.split(', ');
        return;
      }
    });

    $('.anime_video_body ul#episode_page li').each((_, ele) => {
      const a = $(ele).children('a');

      const start = Number(a.attr('ep_start'));
      const end = Number(a.attr('ep_end'));

      data.episodePages.push({ start, end });
    });

    data.episodePages.forEach(d => {
      if (d.end > data.episodeCount) {
        data.episodeCount = d.end;
      }
    });

    return data;
  }

  async getAnimeEpisodes(
    movieId: string,
    start: number,
    end: number
  ): Promise<IAnimeEpisodeRet> {
    const url = new URL('https://ajax.gogo-load.com/ajax/load-list-episode');

    url.searchParams.set('id', movieId);
    url.searchParams.set('default_ep', '0');
    url.searchParams.set('ep_start', start + '');
    url.searchParams.set('ep_end', end + '');

    const res = await this.httpService.get(url.toString()).toPromise();
    const $ = cheerioLoad(res.data);

    const episodes: INameLinkRet[] = [];

    $('ul#episode_related li').each((_, ele) => {
      const a = $(ele).children('a');

      const name = a.children('.name').text().trim();
      const href = a.attr('href').trim();

      episodes.push({ name, link: href });
    });

    return {
      movieId,
      episodes
    };
  }

  async getAnimeEpisodeId(link: string): Promise<string> {
    const res = await this.httpService.get(link).toPromise();
    const $ = cheerioLoad(res.data);

    const src = $('.play-video iframe').attr('src');

    const matches = src.match(/id=(?<id>\w+)/);

    if (!matches) {
      return null;
    }

    return matches.groups['id'];
  }

  async getAnimeVideoLinks(videoId: string): Promise<INameLinkRet[]> {
    const url = new URL('https://gogo-play.net/ajax.php');
    url.searchParams.set('id', videoId);

    const res = await this.httpService.get(url.toString()).toPromise();

    return (res.data.source as any[]).map(s => ({
      name: s.label,
      link: s.file
    }));
  }
}
