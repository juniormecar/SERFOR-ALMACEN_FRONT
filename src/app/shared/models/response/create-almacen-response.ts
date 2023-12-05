import { Almacen } from "../almacen.model";

export class CreateAlmacenResponse {
    codigo: string;
    data: Almacen[];
    informacion: string;
    message: string;
    messageExeption: string;
    success:boolean;
    totalRecords: number;
    constructor() { }
}