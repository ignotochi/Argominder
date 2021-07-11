export interface Pagination {
    count?: number;
    current?: number;
    limit?: number;
    nextPage?: boolean;
    options?: object;
    order?: object;
    page?: number;
    pageCount?: number;
    paramType?: string;
    prevPage?: boolean;
    queryScope?: string;
}