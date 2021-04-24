import { PipeTransform } from '@nestjs/common';
import { IPaginatedQuery } from '../types';
import { checkPagination } from '../utils';

export class PaginationDefaultPipe implements PipeTransform<IPaginatedQuery> {
  transform(data: IPaginatedQuery) {
    return checkPagination(data);
  }
}
