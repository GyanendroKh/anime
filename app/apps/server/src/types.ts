export interface IPaginatedQuery {
  offset: number;
  limit: number;
}

export type IPaginatedData<T extends any> = IPaginatedQuery & {
  data: T[];
  count: number;
};
