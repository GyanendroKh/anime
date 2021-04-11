import { HttpService, Injectable } from '@nestjs/common';
import { load as cheerioLoad } from 'cheerio';
import {
  IAnimeEpisodeRet,
  IAnimeInfoRet,
  IAnimeListRet,
  IAnimeVideLink,
  INameLinkRet
} from './go-go-anime.interface';

@Injectable()
export class GoGoAnimeService {
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = 'https://gogoanime.ai';
  }

  async getAnimeList(pageNo: number): Promise<IAnimeListRet> {
    const url = new URL('/anime-list.html', this.baseUrl);
    url.searchParams.set('page', String(pageNo));

    const res = await this.httpService.get(url.toString()).toPromise();
    const html = res.data;

    const $ = cheerioLoad(html);

    const list: IAnimeListRet['list'] = [];

    $('.anime_list_body ul li').each((_, ele) => {
      const e = $(ele).children('a');

      const title = e.text().trim();
      const href = e.attr('href');

      list.push({ name: title, link: href });
    });

    const paginations: number[] = [];

    $('.pagination ul.pagination-list li').each((_, ele) => {
      const e = $(ele).children('a');

      const dataPage = e.attr('data-page');
      paginations.push(Number(dataPage));
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
    const html = res.data;

    const $ = cheerioLoad(html);

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
    const html = res.data;

    const $ = cheerioLoad(html);

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
    const html = res.data;

    const $ = cheerioLoad(html);

    const src = $('.play-video iframe').attr('src');

    const matches = src.match(/id=(?<id>\w+)/);

    if (!matches) {
      return null;
    }

    return matches.groups['id'];
  }

  async getAnimeVideoLinks(videoId: string): Promise<IAnimeVideLink[]> {
    const url = new URL('https://gogo-play.net/download');
    url.searchParams.set('id', videoId);

    const res = await this.httpService.get(url.toString()).toPromise();
    const html = res.data;

    const $ = cheerioLoad(html);

    const links: IAnimeVideLink[] = [];

    $('.mirror_link .dowload a[download]').each((_, ele) => {
      const a = $(ele);

      const text = a.text().replace('Download', '').trim();
      const href = a.attr('href');

      links.push({ name: text, link: href });
    });

    return links;
  }
}
