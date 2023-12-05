import { AlmacenResponsable } from "./almacen-responsable.model";

export class Almacen {
    nuIdAlmacen?:number;
    txUbigeo?:string;
    txNombreAlmacen?:string;
    txTipoAlmacen?:string;
    txTipoDocumento?:string;
    txNumeroDocumento?:string;
    txNombresEncargado?:string;
    nuCapacidadAlmacen?:number=0;
    nuIdUsuarioModificacion?:number;
    feFechaModificacion?:Date;
    txEstado?:string;
    nuIdUsuarioElimina?:number;
    feFechaElimina?:Date;
    nuIdUsuarioRegistro?:number;
    feFechaRegistro?:Date;
    txPuestoControl?:string;
    txNumeroATF?:string;
    descrATF?:string;
    descrPuestoControl?:string;
    descrTipoAlmacen?:string;
    foto?:string;
    direccionAlmacen?:string;
    lstAlmacenResponsable: AlmacenResponsable[] = [];
}