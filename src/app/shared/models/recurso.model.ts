import { RecursoProduco } from "./recurso-producto.model";
import { RecursoPersona } from 'app/shared/models/recurso-persona.model';

export class Recurso {
    nuIdRecurso?:number;
    txTipoRecurso?:string;
    txNombreRecurso?:string;
    txNombreComun?:string;
    txEstado?:string;
    nuIdUsuarioRegistro?:number;
    feFechaRegistro?:Date;
    nuIdUsuarioModificacion?:number;
    feFechaModificacion?:Date;
    nuIdUsuarioElimina?:number;
    feFechaElimina?:Date;
    txNroGuiaTransporteForestal?:string;
    txNombreAutoridadRegional?:string;
    nuCapacidadAlmacen?:number=0;
    feFechaExpedicion?:Date;
    txOrigenRecurso?:string;
    feFechaVencimiento?:Date;
    txObservaciones?:string;
    txTipoRegistro?:string;
    numeroActa?:string;
    tipoDocumento?:string;
    numeroDocumento?:string;
    nuIdAlmacen?:number;
    lstEspecie: RecursoProduco[] = [];

    nombreComun?:string;
    nombreCientifico?:string;

    txDescEstadoRecurso?:string;
    flagAgregar?: boolean;
    tipoIngreso?:string;
    tipoIngresoDesc?:string;
    foto?:string;
    nombres?:string;
    direccion?:string;
    type?:string;
    nombreAlmacen?:string;
    tipoInfraccion?:string;
    tipoSancion?:string;
    desctipoProducto?:string;
    volumen?:number;
    txCantidadProducto?:Number;
    metroCubico?:Number;
    disponibilidadActa?:string;
    tipo?:string
    tipoDocumentoConductor?:string;
    numeroDocumentoConductor?:string;
    nombresConductor?:string;
    placa?:string;
    fechaIngreso?:Date;
    horaIngreso?:string;
    unidadMedida?:string;
    intervenido: RecursoPersona;
    conductor: RecursoPersona;

    nuIdArchivoRecursoProducto?: string;
    nuIdArchivoRecurso?: string;

    nuIdDetTransferencia?: number;

}
    
