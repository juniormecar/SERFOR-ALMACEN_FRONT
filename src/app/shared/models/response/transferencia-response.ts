import { Transferencia } from 'app/shared/models/transferencia.model';

export class TransferenciaResponse {
    data: Transferencia[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
    pageNumber:number;
    success: boolean;
    constructor() { }
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}