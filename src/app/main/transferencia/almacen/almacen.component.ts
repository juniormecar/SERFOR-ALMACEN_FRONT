import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecursoService } from 'app/service/recurso.service';
import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { PageEvent } from '@angular/material/paginator';
import { TransferenciaService } from 'app/service/transferencia.service';
import { Almacen } from 'app/shared/models/almacen.model';
import { MatTableDataSource } from '@angular/material/table';
import { AlmacenService } from 'app/service/almacen.service';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
import { ParametroService } from 'app/service/parametro.service';
import { Parametro } from 'app/shared/models/parametro.model';
import { Constants } from 'app/shared/models/util/constants';
import Swal from 'sweetalert2';
import { AtfService } from 'app/service/atf.service';
import { ATF } from 'app/shared/models/atf.model';
import { PuestoControl } from 'app/shared/models/puesto-control.model';
import { PuestoControlService } from 'app/service/puesto-control.service';
import { ActaService } from 'app/service/acta.service';
import { finalize } from 'rxjs/operators';
import * as _moment from 'moment';


interface DialogData{
  id: number;
  data: any[];
  idAlmacen: number;
}

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.scss']
})
export class AlmacenComponent implements OnInit {

  dataSource: any[]=[];// = new MatTableDataSource<Producto>([]);
  dataSourceSearch: any[] = [];
  transferencia: any[] = [];
  recursoResponse: BandejaRecursoResponse = new BandejaRecursoResponse();
  //displayedColumns: string[] = ['position', 'nombreCientifico', 'nombreComun', 'tipo','cantidad','descontar','unidadMedida','FlagAgregar'];
  inputTransferirAlmacen: FormGroup;
  listTipoDocumento: Parametro[] = [];
  tipoTransferencia: 'TPTRANS002';
  tipoDocumento: string = Constants.PUNTO_CONTROL;
  lstAlmacen: any[]=[];// new MatTableDataSource<Almacen>([]);
  listATF: ATF[] = [];
  listPuestoControl: PuestoControl[] = [];
  consolidadoActa: any = null;
  fechaActual:any;
  horaActual:any;


  constructor(public _dialogRef: MatDialogRef<AlmacenComponent>,
    private _recursoService: RecursoService,
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private serviceTransferencia: TransferenciaService,
    private parametroService: ParametroService,
    private atfService: AtfService,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData,
    private puestoControlService: PuestoControlService,
    private almacenService: AlmacenService,
    private actaService: ActaService) {
      this.recursoResponse.pageNumber = 1;
      this.recursoResponse.pageSize = 5;
      this.inputTransferirAlmacen = this._formBuilder.group({
        fechaTransferencia: ['', Validators.required],
        horaTransferencia: [''],
        numeroATF: ['', Validators.required],
        idPuntoControl: ['', Validators.required],
        idAlmacen: ['', Validators.required],
        nroActaTraslado: ['', Validators.required],
        observaciones: ['', ],
      });
     }

  ngOnInit(): void {
    this.dataSource = this._data.data;
    //this.getRecursosEspecies(this._data.id);
    //this.getAlmacen();
    this.searchATF();
    this.fechaActual = this.fechaActual === undefined ? _moment() : this.fechaActual;
    this.horaActual = this.horaActual === undefined ? _moment(new Date()).format('HH:mm') : this.horaActual;
  }

  getRecursosEspecies(idRecurso: any) {
       
    this.dataSource = []; //= new MatTableDataSource<Recurso>([])
    this.dataSourceSearch = [];
    this._recursoService.getRecursoEspeciesSearch(null, idRecurso,
    this.recursoResponse.pageNumber,this.recursoResponse.pageSize)
    .subscribe((response:any)=>{
    response.data.forEach((det:any) => {
      let data = {
        idEspecie: det.idEspecie,
        nuIdRecurso: det.nuIdRecurso,
        nuIdRecursoProducto: det.nuIdRecursoProducto,
        nuIdUser: 1,
        nombreCientifico: det.nombreCientifico,
        nombreComercial: det.nombreComercial,
        nombreComun: det.nombreComun,
        familia: det.familia,
        nuCantidadProducto: det.txCantidadProducto,
        descontar: 0,
        flag: false
      }
      this.dataSourceSearch.push(data);
    });
     
    this.dataSource =this.dataSourceSearch;
    })
  }


  searchAlmacen() {
    let almacenRequest:Almacen = new Almacen;
    almacenRequest.txNumeroATF=this.inputTransferirAlmacen.get('numeroATF').value;
    almacenRequest.txPuestoControl=this.inputTransferirAlmacen.get('idPuntoControl').value;
    almacenRequest.txNombreAlmacen='';
    this.almacenService.getAlmacenSearch(almacenRequest,1,100).subscribe((response:BandejaAlmacenResponse)=>{
    this.lstAlmacen = response.data//new MatTableDataSource<Almacen>(response.data)
    //console.log("this._data.idAlmacen ",this._data.idAlmacen);
    this.lstAlmacen = this.lstAlmacen.filter(item=>item.nuIdAlmacen!==this._data.idAlmacen)

    this.lstAlmacen = this.eliminarDuplicadosAlmacenes(this.lstAlmacen);

    ////console.log("eliminarAlmacenes",eliminarAlmacenes(this.lstAlmacen));
    //console.log("response.data ",this.lstAlmacen);
    })
  }

  eliminarDuplicadosAlmacenes(lstAlmacen: any){
    const almacenesMap = lstAlmacen.map(almacen => {
      return [almacen.txNombreAlmacen, almacen]
    });
    return [...new Map(almacenesMap).values()];
  }

  searchATF() {
    this.atfService.getATFSearch().subscribe((response: ATF[]) => {
      this.listATF = response;
    });
  }

  searchPuestoControl() {
    this.puestoControlService.getPuestoControlSearch(this.inputTransferirAlmacen.get('numeroATF').value).subscribe((response: PuestoControl[]) => {
      this.listPuestoControl= response;
    });
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.recursoResponse.pageNumber = e.pageIndex;
     this.recursoResponse.pageSize = e.pageSize;
     //this.getRecursos(this.idAlmacen);
     this.getRecursosEspecies(this._data.id)
     return e;
   }

   saveTransferencia(){
    let paramsList = [];

    let fechaTransferencia = new Date(this.inputTransferirAlmacen.get('fechaTransferencia').value)
    fechaTransferencia.setMinutes(fechaTransferencia.getMinutes() + fechaTransferencia.getTimezoneOffset());

    this.dataSource.forEach( ds =>{
      let params = {
        nuIdRecurso: ds.nuIdRecurso,
        nuIdAlmacenOrigin : ds.lstTransferenciaDetalle[0].nuIdAlmacen,
        txCodigoPuntoControl: this.inputTransferirAlmacen.value.idPuntoControl,
        nuIdAlmacen: this.inputTransferirAlmacen.value.idAlmacen,
        observaciones: this.inputTransferirAlmacen.value.observaciones,
        tipoTransferencia: 'TPTRANS002',
        lstTransferenciaDetalle: ds.lstTransferenciaDetalle,
        nroActaTraslado: this.inputTransferirAlmacen.value.nroActaTraslado,
        fechaTransferencia: fechaTransferencia,
        horaTransferencia: this.inputTransferirAlmacen.get('horaTransferencia').value
      }
      paramsList.push(params);
    });

    console.log("paramsList", paramsList)
   if(paramsList.length > 0){
      this.serviceTransferencia.postTransferencia(paramsList)
      .pipe(finalize(() => this.generarActa(paramsList)))
      .subscribe((response: any) => {
        if (response.data && response.data[0].nuIdRecurso > 0) {
          Swal.fire(
            'Mensaje de Confirmación',
            'Transferecia realizada correctamente.',
            'success'
          )
        this._dialogRef.close(1);
        }  else {
          Swal.fire(
            'Mensaje!',
            'Error inesperado al generar la transferencia.  ',
            'error'
          )
        }
      }, error => {
        //console.log("error ",error)
      })
    }else{
      Swal.fire(
        'Mensaje!',
        'No se selecciono recursos ',
        'error'
      )
    }
  }

  

  generarActa(paramsList:any) {

    this.actaService
      .consolidadoActaSalida(paramsList)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.consolidadoActa = res;
          this.descargarArchivo(this.consolidadoActa);
        } else {

        }
      }, err => {
      });
  }

  descargarArchivo(archivoResponse: any) {
    if (this.isNullOrEmpty(archivoResponse)) {
      console.error("Archivo nulo");
      return;
    }
    const { archivo, nombeArchivo, contenTypeArchivo } = archivoResponse;
    if (
      this.isNullOrEmpty(archivo) ||
      this.isNullOrEmpty(nombeArchivo) ||
      this.isNullOrEmpty(contenTypeArchivo)
    ) {
      console.error("Archivo o nombre archivo o content type nulo ");
      return;
    }
    this.DownloadFile(archivo, nombeArchivo, contenTypeArchivo);
  }

  
isNullOrEmpty(value: any | number | string): boolean {
  return value == null || value == undefined || value == "";
}

DownloadFile(base64: string, name: string, mediaType: string) {
  let blob = this.Base64toBlob(base64, mediaType);
  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = name;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

Base64toBlob(base64Data: string, contentType: string): Blob {
  contentType = contentType || "";
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data.replace(/['"]+/g, ""));
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


  searchPuntoControl() {
    this.parametroService.getParametroSearch(this.tipoDocumento).subscribe((response: Parametro[]) => {
      this.listTipoDocumento = response;
    });
  }

  close() {
    //console.log("cerrar");
    this._dialogRef.close(-1);
  }

}
