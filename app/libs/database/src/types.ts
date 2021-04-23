export interface IPaginatedQuery {
  offset: number;
  limit: number;
}

export type IPaginatedData<T extends any> = IPaginatedQuery & {
  data: T[];
  count: number;
};

export interface IAnimeVideoLink {
  name: string;
  link: string;
}
