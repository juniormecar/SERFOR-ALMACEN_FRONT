import { Especie } from "../especie.model";

export class EspecieResponse {
    data: Especie[];
    codigo: string;
    message: string;
    success: boolean;
    page:number;
    size: number;
    totalRecords: number;
    constructor() { }
}
