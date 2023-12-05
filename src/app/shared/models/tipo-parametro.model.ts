import { Parametro } from "./parametro.model";

export class TipoParametro {
    idTipoParametro?:Number;
    prefijo?:string;
    nombre?: string;
    descripcion?:string;
    estado?: string;
    idUsuarioRegistro?: Number;
    fechaRegistro?: Date;
    idUsuarioModificacion?: Number;
    fechaModificacion?: Date;
    idUsuarioElimina?: Number;
    fechaElimina?:  Date;
    editable?: Number;
    lstParametro?: Parametro[] = [];
}
