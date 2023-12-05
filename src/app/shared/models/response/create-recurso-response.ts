import { Recurso } from "../recurso.model";

export class CreateRecursoResponse {
    codigo: string;
    data: Recurso;
    informacion: string;
    message: string;
    messageExeption: string;
    success:boolean;
    totalRecords: number;
    constructor() { }
}