import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecursoService } from 'app/service/recurso.service';
import { BandejaProductoResponse } from 'app/shared/models/response/producto-response';
import { PageEvent } from '@angular/material/paginator';
import { TransferenciaService } from 'app/service/transferencia.service';
import Swal from 'sweetalert2';
import { ParametroService } from 'app/service/parametro.service';
import { Constants } from 'app/shared/models/util/constants';
import { Parametro } from 'app/shared/models/parametro.model';
import { Recurso } from 'app/shared/models/recurso.model';
import { PideService } from 'app/service/pide.service';
import { finalize } from 'rxjs/operators';
import { ActaService } from 'app/service/acta.service';
interface DialogData{ 
  id: number;
  data: any[];
  idAlmacen: number;
}

@Component({
  selector: 'app-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.scss']
})
export class BeneficiarioComponent implements OnInit {

  dataSource: any[]=[];// = new MatTableDataSource<Producto>([]);
  dataSourceSearch: any[] = [];
  transferencia: any[] = [];
  recursoResponse: BandejaProductoResponse = new BandejaProductoResponse();
  //displayedColumns: string[] = ['position', 'nombreCientifico', 'nombreComun', 'tipo','cantidad','descontar','unidadMedida','FlagAgregar'];
  inputTransferirBeneficiario: FormGroup;
  tipoTransferencia: 'TPTRANS001';
  tipoDocumento: string = Constants.TIPO_DOCUMENTO;
  validaRUCClass: boolean = false;
  listTipoDocumento: Parametro[] = [];
  consolidadoActa: any = null;
  constructor(    public _dialogRef: MatDialogRef<BeneficiarioComponent>,
    private _recursoService: RecursoService,
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private serviceTransferencia: TransferenciaService,
    private parametroService: ParametroService,
    private pideService: PideService,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData,
    private actaService: ActaService,
    ) {
      this.recursoResponse.page = 1;
      this.recursoResponse.size = 5;
      this.inputTransferirBeneficiario = this._formBuilder.group({
        nombreBeneficiario: ['', Validators.required],
        //apellidosBeneficiario: ['', Validators.required],
        tipoDocumento: ['RUC', Validators.required],
        numeroDocumento: ['', Validators.required],
        nroActaTransferencia: ['', Validators.required],
        nroResolucion: ['', Validators.required],
        observaciones: ['', ],
      });
      //this.inputTransferirBeneficiario.get('numeroActa').patchValue(this._data.recurso.numeroActa);
     }

  ngOnInit(): void {
    //console.log("_data",this._data.data);
    //this.getRecursosEspecies(this._data.id);
    this.dataSource = this._data.data;
    this.searchTipoDocumento();
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.recursoResponse.page = e.pageIndex;
     this.recursoResponse.size = e.pageSize;
     //this.getRecursos(this.idAlmacen);
     //this.getRecursosEspecies(this._data.id)
     return e;
   }

   searchTipoDocumento() {
    this.parametroService.getParametroSearch(this.tipoDocumento).subscribe((response: Parametro[]) => {
      this.listTipoDocumento = response;
    });
  }

   getRecursosEspecies(idRecurso: any) {
       
    this.dataSource = []; //= new MatTableDataSource<Recurso>([])
    this.dataSourceSearch = [];
    this._recursoService.getRecursoEspeciesSearch(null, idRecurso,
    this.recursoResponse.page,this.recursoResponse.size)
    .subscribe((response:any)=>{
    //console.log("response",response.data )
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
    //console.log("this.dataSource",this.dataSource);
    //console.log("response-getRecursosEspecies",this.dataSource);
    })
  }

  saveTransferencia(){
    let paramsList = [];
    //console.log("this.dataSource ", this.dataSource)
    this.dataSource.forEach( ds =>{
      //console.log("ds ",ds)
      let params = {
        nuIdRecurso: ds.nuIdRecurso,
        nuIdAlmacenOrigin : ds.lstTransferenciaDetalle[0].nuIdAlmacen,
        nombre: this.inputTransferirBeneficiario.value.nombreBeneficiario,
        //apellidos: this.inputTransferirBeneficiario.value.apellidosBeneficiario,        
        documento: this.inputTransferirBeneficiario.value.numeroDocumento,
        observaciones: this.inputTransferirBeneficiario.value.observaciones,
        tipoDocumento: this.inputTransferirBeneficiario.value.tipoDocumento,
        tipoTransferencia: 'TPTRANS001',
        lstTransferenciaDetalle: ds.lstTransferenciaDetalle,
        nroActaTransferencia: this.inputTransferirBeneficiario.value.nroActaTransferencia,
        nroResolucion: this.inputTransferirBeneficiario.value.nroResolucion,
      }
      paramsList.push(params);
    });

    //console.log("paramsList", paramsList)
    if(paramsList.length > 0){
      this.serviceTransferencia.postTransferencia(paramsList)
      .pipe(finalize(() => this.generarActa(paramsList)))
      .subscribe((response: any) => {
        if (response.data && response.data[0].nuIdRecurso) {
          Swal.fire(
            'Mensaje de Confirmación',
            'Transferecia realizada correctamente.',
            'success'
          )
        this._dialogRef.close(1);
        } else {
          Swal.fire(
            'Mensaje!',
            'Error inesperado al generar la transferencia.  ',
            'error'
          )
        }
      }, error => {
        //console.log("error ",error)
      })
    } else{
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


  validarRUC() {
    //console.log('validarDNI');
    let params = { "numRUC": this.inputTransferirBeneficiario.get("numeroDocumento").value }
    //console.log("params ", params)
    this.pideService.consultarRazonSocial(params).subscribe((result: any) => {
      //console.log("result ", result)
      if (result.dataService && result.dataService) {
        this.validaRUCClass = true;
        if (result.dataService.respuesta) {
          let empresa = result.dataService.respuesta;
          let razonSocial;
          razonSocial = empresa.ddp_nombre!=null?empresa.ddp_nombre:'';                  
          this.inputTransferirBeneficiario.get("nombreBeneficiario").patchValue(razonSocial);          
          Swal.fire(
            'Mensaje de Confirmación',
            'Se validó el RUC.',
            'success'
          )
        } else {

          Swal.fire(
            'Mensaje de Confirmación',
            result.dataService.deResultado,
            'warning'
          )
        }
      } else {
        Swal.fire(
          'Mensaje de error',
          'Hay errores con el servicio de validación de RUC. Contactar con el administrador del sistema.',
          'error'
        )
      }
    }, () => {

      // this.toast.error('Hay errores con el servicio de validación de DNI. Contactar con el administrador del sistema.');
    }
    )
  }
  
  close() {
    //console.log("cerrar");
    this._dialogRef.close(-1);
  }
}
