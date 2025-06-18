import type { ApiResponsePaginated } from '@/types/axiosResponce';

export const defaultPaginatedData = <T>(): ApiResponsePaginated<T[]>['data'] => ({
  total: 0,
  page: 1,
  perPage: 10,
  data: [],
});
