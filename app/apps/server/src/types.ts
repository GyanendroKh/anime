export interface IPaginatedQuery {
  start: number;
  end: number;
}

export type IPaginatedData<T extends any> = IPaginatedQuery & {
  data: T[];
  count: number;
};
