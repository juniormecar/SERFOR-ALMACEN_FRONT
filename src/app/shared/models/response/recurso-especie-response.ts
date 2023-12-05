
import { RecursoProduco } from "../recurso-producto.model";

export class CreateRecursoProductoResponse {
    codigo: string;
    data: RecursoProduco;
    informacion: string;
    message: string;
    messageExeption: string;
    success:boolean;
    totalRecords: number;
    constructor() { }
}