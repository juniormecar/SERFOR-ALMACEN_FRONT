import { ActaIntervencion } from "../acta-intervencion.model";

export class CreateActaResponse {
    codigo: string;
    data: ActaIntervencion[];
    informacion: string;
    message: string;
    messageExeption: string;
    success:boolean;
    totalRecords: number;

    pageable: Pageable;
    last: boolean;
    totalPages: number;
    pageSize: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
    pageNumber:number;
   
    constructor() { }
}

export class ActaResponse {
    codigo: string;
    data: ActaIntervencion;
    informacion: string;
    message: string;
    messageExeption: string;
    success:boolean;
    totalRecords: number;
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    pageSize: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
    pageNumber:number;
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
