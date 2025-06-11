export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiResponsePaginated<T> {
  data: {
    total: number;
    page: number;
    perPage: number;
    data: T;
  };
  success: boolean;
  message?: string;
}
