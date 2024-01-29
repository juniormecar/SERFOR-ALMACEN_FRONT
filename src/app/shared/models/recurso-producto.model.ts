import { Parametro } from "./parametro.model";

export class RecursoProduco {
    nuIdRecursoProducto?:number;
    idEspecie?:Number;
    nombreCientifico?:string;
    nombreComun?:string;
    tipoProducto?:string;
    txEstado?:string;
    idUsuarioRegistro?:Number;
    feFechaRegistro?:Date;
    nuIdUsuarioModificacion?:Number;
    feFechaModificacion?:Date;
    nuIdUsuarioElimina?:Number;
    feFechaElimina?:Date;
    txObservaciones?:string;
    txCantidadProducto?:Number;
    txTotalProducto?:Number;
    unidadMedida?:string;
    type?:string;
    tipoAlmacenamiento?:string;
    capacidadUnidad?:string;
    tipoSubProducto?:string;
    txNombreAlmacen?:string;
    tipo?:string
    metroCubico?:Number;
    disponibilidadActa?:string;
    tipoIngreso?:string;
    disponibilidad?:boolean;
    descTipoProducto?:string;
    descUnidadMedida?:string;
    descSubProducto?:string;
    descTipoAlmacenamiento?:string;
    cantidadTotal?:Number;
}