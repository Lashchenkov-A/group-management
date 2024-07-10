export interface Paged<T> {
  page: number;
  total: number;
  totalPages: number;
  pageSize: number;
  data: T[];
}
