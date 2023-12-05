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
import { DevolucionesComponent } from '../devoluciones/devoluciones.component';

interface DialogData{
  id: number;
  data: any[];
  recurso: Recurso;
}

@Component({
  selector: 'app-bajas',
  templateUrl: './bajas.component.html',
  styleUrls: ['./bajas.component.scss']
})
export class BajasComponent implements OnInit {



  dataSource: any[]=[];// = new MatTableDataSource<Producto>([]);
  dataSourceSearch: any[] = [];
  transferencia: any[] = [];
  recursoResponse: BandejaProductoResponse = new BandejaProductoResponse();
  // displayedColumns: string[] = ['position', 'nombreCientifico', 'nombreComun', 'tipo','cantidad','descontar','unidadMedida','FlagAgregar'];
  inputTransferirBajas: FormGroup;
  tipoTransferencia: 'TPTRANS005';
  tipoDocumento: string = Constants.TIPO_DOCUMENTO;
  listTipoDocumento: Parametro[] = [];
  validaDNIClass: boolean = false;
  constructor(    public _dialogRef: MatDialogRef<BajasComponent>,
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
      this.inputTransferirBajas = this._formBuilder.group({
        numeroResolucion: ['', Validators.required],
        idAlmacen: ['', Validators.required],
        numeroActa: ['', Validators.required],
        observaciones: ['', ],
      });
      // this.inputTransferirBeneficiario.get('numeroActa').patchValue(this._data.recurso.numeroActa);
     }

  ngOnInit(): void {
    //console.log("_data-baja",this._data.data);
    this.dataSource = this._data.data;
    //this.getRecursosEspecies(this._data.id);
  }

  saveBajas(){
    let paramsList = [];

    this.dataSource.forEach( ds =>{
      let params = {
        nuIdRecurso: ds.nuIdRecurso,
        nuIdAlmacenOrigin : ds.lstTransferenciaDetalle[0].nuIdAlmacen,
        nroActaTraslado: this.inputTransferirBajas.value.numeroActa,
        nroResolucion: this.inputTransferirBajas.value.numeroResolucion,
        observaciones: this.inputTransferirBajas.value.observaciones,
        tipoTransferencia: 'TPTRANS005',
        lstTransferenciaDetalle: ds.lstTransferenciaDetalle,
      }
      paramsList.push(params);
    });

    //console.log("paramsList", paramsList)
    if(paramsList.length > 0){
      this.serviceTransferencia.postTransferencia(paramsList).subscribe((response: any) => {
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

  searchPass(){
    Swal.fire(
      'Consulta al PASS',
      'Devolución aceptada',
      'success'
    )
  }

  close() {
    //console.log("cerrar");
    this._dialogRef.close(-1);
  }

}
