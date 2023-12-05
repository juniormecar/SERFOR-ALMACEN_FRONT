import { Recurso } from 'app/shared/models/recurso.model';
import { Cubicacion } from '../cubicacion.model';
import { FaunaDetalle } from '../fauna-detalle.model';

export class DeleteRecursoResponse {
    data: Recurso;    
    success: boolean;
    constructor() { }
}

export class DeleteCubicacionResponse {
    data: Cubicacion;    
    success: boolean;
    constructor() { }
}

export class DeleteFaunaDetalleResponse {
    data: FaunaDetalle;    
    success: boolean;
    constructor() { }
}
