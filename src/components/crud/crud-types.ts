export interface ResponseMeta {
  current: number;
  pageSize: number;
  pages: number;
  totalItem: number;
}

export interface PagingResponse {
  items: any[];
  meta: ResponseMeta;
}
