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
import * as _moment from 'moment';



interface DialogData{ 
  id: number;
  data: any[];
  idAlmacen: number;
}

@Component({
  selector: 'app-fauna-salida',
  templateUrl: './fauna-salida.component.html',
  styleUrls: ['./fauna-salida.component.scss']
})
export class FaunaSalidaComponent implements OnInit {

  dataSource: any[]=[];// = new MatTableDataSource<Producto>([]);
  dataSourceSearch: any[] = [];
  transferencia: any[] = [];
  listDecimalRedondeo = new Parametro();
  types = [];
  recursoResponse: BandejaProductoResponse = new BandejaProductoResponse();
  // displayedColumns: string[] = ['position', 'nombreCientifico', 'nombreComun', 'tipo','cantidad','descontar','unidadMedida','FlagAgregar'];
  inputTransferir: FormGroup;
  tipoTransferencia: 'TPTRANS001';
  tipoDocumento: string = Constants.TIPO_DOCUMENTO;
  listTipoDocumento: Parametro[] = [];
  validaDNIClass: boolean = false;

  fechaActual:any;
  horaActual:any;



  constructor(    public _dialogRef: MatDialogRef<FaunaSalidaComponent>,
    private _recursoService: RecursoService,
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private serviceTransferencia: TransferenciaService,
    private parametroService: ParametroService,
    private pideService: PideService,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
    ) {
      this.recursoResponse.page = 1;
      this.recursoResponse.size = 5;
      this.inputTransferir = this._formBuilder.group({
        fechaTransferencia: ['', Validators.required],
        horaTransferencia: [''],
        tipo: ['', Validators.required],
        observaciones: [''],
        
        
      });
      this.types = [ 'Deceso', 'Eutanasia', 'Custodia', 'Liberación']
      // this.inputTransferirBeneficiario.get('numeroActa').patchValue(this._data.recurso.numeroActa);
     }

  ngOnInit(): void {
    console.log("_data",this._data);
    this.dataSource = this._data.data;
    this.fechaActual = this.fechaActual === undefined ? _moment() : this.fechaActual;
    this.horaActual = this.horaActual === undefined ? _moment(new Date()).format('HH:mm') : this.horaActual;
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.recursoResponse.page = e.pageIndex;
     this.recursoResponse.size = e.pageSize;
     //this.getRecursos(this.idAlmacen);
     return e;
   }

   

  saveFaunaSalida(){

    let paramsList = [];

    let fechaTransferencia = new Date(this.inputTransferir.get('fechaTransferencia').value)
    fechaTransferencia.setMinutes(fechaTransferencia.getMinutes() + fechaTransferencia.getTimezoneOffset());

    this.dataSource.forEach( ds =>{

      let params = {
        nuIdRecurso: ds.nuIdRecurso,
        faunaSalida: this.inputTransferir.value.tipo,
      observaciones: this.inputTransferir.value.observaciones,
      nuIdAlmacenOrigin : ds.lstTransferenciaDetalle[0].nuIdAlmacen,
      tipoTransferencia: 'TPTRANS006',
      lstTransferenciaDetalle: ds.lstTransferenciaDetalle,
      fechaTransferencia: fechaTransferencia,
        horaTransferencia: this.inputTransferir.get('horaTransferencia').value
      }
      paramsList.push(params);
    });

    //console.log("paramsList", paramsList)
    if(paramsList.length > 0){
      this.serviceTransferencia.postTransferencia(paramsList).subscribe((response: any) => {
        if (response.data && response.data[0].nuIdRecurso) {
          Swal.fire({
            title: 'Mensaje de Confirmación',
            text: "Salida realizada correctamente.",
            icon: 'success',
            //showCancelButton: true,
            confirmButtonColor: '#679738',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'
          })
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
  close() {
    //console.log("cerrar");
    this._dialogRef.close(-1);
  }
}

