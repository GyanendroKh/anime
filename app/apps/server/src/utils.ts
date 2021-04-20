import { DEFAULT_PAGINATION } from './dto';
import { IPaginatedQuery } from './types';

export const checkPagination = (query?: IPaginatedQuery): IPaginatedQuery => {
  if (query) {
    return {
      offset: query.offset ?? DEFAULT_PAGINATION.offset,
      limit: query.limit ?? DEFAULT_PAGINATION.limit
    };
  }

  return DEFAULT_PAGINATION;
};
