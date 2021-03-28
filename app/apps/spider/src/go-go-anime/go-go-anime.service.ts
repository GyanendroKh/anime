import { HttpService, Injectable } from '@nestjs/common';
import { load as cheerioLoad } from 'cheerio';

@Injectable()
export class GoGoAnimeService {
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = 'https://gogoanime.ai';
  }

  async getAnimeList(pageNo: number) {
    const url = new URL('/anime-list.html', this.baseUrl);
    url.searchParams.set('page', String(pageNo));

    const res = await this.httpService.get(url.toString()).toPromise();
    const html = res.data;

    const $ = cheerioLoad(html);

    const list: { title: string; url: string }[] = [];

    $('.anime_list_body ul li').each((_, ele) => {
      const e = $(ele).children('a');

      const title = e.text().trim();
      const href = e.attr('href');

      list.push({ title, url: href });
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

  async getAnimeInfo(link: string): Promise<unknown> {
    const url = new URL(link, this.baseUrl);

    const res = await this.httpService.get(url.toString()).toPromise();
    const html = res.data;

    const $ = cheerioLoad(html);

    const animeInfoBody = $('.anime_info_body');
    const animeInfoBodyBg = animeInfoBody.children('.anime_info_body_bg');

    const movieId = $('input#movie_id.movie_id[type="hidden"]').attr('value');
    const image = animeInfoBodyBg.children('img').attr('src');
    const title = animeInfoBodyBg.children('h1').text().trim();

    const data = {
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

      const start = a.attr('ep_start');
      const end = a.attr('ep_end');

      data.episodePages.push({ start, end });
    });

    data.episodePages.forEach(d => {
      if (Number(d.end) > Number(data.episodeCount)) {
        data.episodeCount = d.end;
      }
    });

    return data;
  }

  async loadAnimeEpidoes(
    movideId: string,
    start: string,
    end: string
  ): Promise<unknown> {
    const url = new URL('https://ajax.gogo-load.com/ajax/load-list-episode');

    url.searchParams.set('id', movideId);
    url.searchParams.set('default_ep', '0');
    url.searchParams.set('ep_start', start);
    url.searchParams.set('ep_end', end);

    const res = await this.httpService.get(url.toString()).toPromise();
    const html = res.data;

    const $ = cheerioLoad(html);

    const episodes = [];

    $('ul#episode_related li').each((_, ele) => {
      const a = $(ele).children('a');

      const name = a.children('.name').text().trim();
      const href = a.attr('href').trim();

      episodes.push({ name, href });
    });

    return episodes;
  }
}
