export class RecursoPasResponse {
    data: RecursoPas[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
    pageNumber:number;
    success: boolean;
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

export class RecursoPas {
    nuIntervencionID: Number;
    txUbigeoCodigo: string;
    nuTipoInicioPASID: Number;
    nuLugarAutoridadID: Number;
    nuLugarAutoridad: Number;
    txCUT: string;
    txArchivoInicial: string;
    txLugarReferencia: string;
    txObservaciones: string;
    feFechaRegistro: Date;
    txDescripcionHechos: string;
    txJustificacionMedida: string;
    nuAutoridadInstructoraID: Number;
    nuAutoridadSancionadoraID: Number;
    nuUnidadMedidaIDArea: Number;
    nuCantidadArea: Number;
    txActivo: string;
    feSysFecha: Date;
    nuSysUsuario: Number;
    txNumActaResolInicio: string;
    txDireccionIntervencion: string;
    nuCoordenadaX: Number;
    nuCoordenadaY: Number;
    nuZonaUTM: Number;
    nuTipoSancion: Number;
    nuSancionComplementaria: Number;
    nuTipoEstablecimiento: Number;
    nuMetodoDeteccion: Number;
    nuTipoProductoEspecie: Number;
    txNumeroExpediente: string;
    txDepositarioMedida: string;
    txObservIntervenidos: string;
    txObservInfracciones: string;
    txObservEspecies: string;
    txObservMedidaProvisoria: string;
    nuIdAutoridad: Number;
    txDepositarioUbigeo: string;
    txDepositarioDepartamento: string;
    txDepositarioProvincia: string;
    txDepositarioDistrito: string;
    txDepositarioDireccion: string;
    feFechaCaducidad: Date;
    intervenidoPas:IntervenidoPas;
    lstIntervencionDetalle: IntervencionDetalleEntity[];
}

export class IntervenidoPas {

    FESysFecha: Date;
    FEFechaCaducidad: Date;
    nuintervenidoRolID: Number;
    nutipoDocumentoID: Number;
    txapellidoMaterno: string;
    txdireccionNotificacion: string;
    txnombreCompletoActa: string;
    txapellidoPaterno: string;
    txnumeroDocumento: string;
    txnumeroDocumentoActa: string;
    nuintervencionID: Number;
    txubigeoDirNotificacion: string;
    fefechaCaducidad: Date;
    txnombreCompleto: string;
    nuintervenidoID: Number;
    txnombres: string;
    txcolorSemaforo: string;
    txtipoDocumento: string;
    txdireccion: string;
    nuinfracciones: Number;
    txarchivado: string;
    txprovincia: string;
    nuestadoPASID: Number;
    fesysFecha: Date;
    nusysUsuario: Number;
    txobservaciones: string;
    txubigeoCodigo: string;
    txdepartamento: string;
    txdistrito: string;
    nupersonaID: Number;
    txactivo: string;
    txestadoActual: string;
}

export class IntervencionDetalleEntity {
    nuIntervencionEspecieID: Number;
    nuEspecieID: Number;
    nuIntervencionID: Number;
    nuTipoRecursoID: Number;
    nuProductoUnidadMedidaID: Number;
    txEspecie: string;
    txNombreComun: string;
    txDescripcion: string;
    nuCantidad: Number;
    nuEstadoID: Number;
    txActivo: string;
    nuCantidadActual: Number;
    feSysFecha: Date;
    nuSysUsuario: Number;
    txPresuntoOrigen: string;
    txPresuntoDestino: string;
    nuCantidadCria: Number;
    nuCantidadJuveniles: Number;
    nuCantidadAdultos: Number;
    txObservaciones: string;
    nuNoEncontradoLista: Number;
}