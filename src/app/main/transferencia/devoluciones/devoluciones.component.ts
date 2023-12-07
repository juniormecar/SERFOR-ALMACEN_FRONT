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


interface DialogData{
  id: number;
  data: any[];
  recurso: Recurso;
}

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent implements OnInit {

  dataSource: any[]=[];// = new MatTableDataSource<Producto>([]);
  dataSourceSearch: any[] = [];
  transferencia: any[] = [];
  recursoResponse: BandejaProductoResponse = new BandejaProductoResponse();
  // displayedColumns: string[] = ['position', 'nombreCientifico', 'nombreComun', 'tipo','cantidad','descontar','unidadMedida','FlagAgregar'];
  inputTransferirBeneficiario: FormGroup;
  tipoTransferencia: 'TPTRANS001';
  tipoDocumento: string = Constants.TIPO_DOCUMENTO;
  listTipoDocumento: Parametro[] = [];
  validaDNIClass: boolean = false;
  constructor(    public _dialogRef: MatDialogRef<DevolucionesComponent>,
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
      this.inputTransferirBeneficiario = this._formBuilder.group({
        nombreBeneficiario: ['', Validators.required],
        // apellidosBeneficiario: ['', Validators.required],
        tipoDocumento: ['', Validators.required],
        numeroDocumento: ['', Validators.required],
        numeroActa: ['', Validators.required],
        observaciones: ['', ],
      });
      // this.inputTransferirBeneficiario.get('numeroActa').patchValue(this._data.recurso.numeroActa);
     }

  ngOnInit(): void {
    //console.log("_data",this._data.data);
    this.getRecursosEspecies(this._data.id);
    this.searchTipoDocumento();
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.recursoResponse.page = e.pageIndex;
     this.recursoResponse.size = e.pageSize;
     //this.getRecursos(this.idAlmacen);
     this.getRecursosEspecies(this._data.id)
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

  saveBeneficiario(){
    //console.log("this.inputTransferirBeneficiario",this.inputTransferirBeneficiario);
    //console.log("this.dataSource",this.dataSource);
    let dataSourceFilter = this.dataSource.filter((t: any) => t.flag == true);

    let params = {
      nuIdRecurso: this._data.id,
      nombre: this.inputTransferirBeneficiario.value.nombreBeneficiario,
      apellidos: this.inputTransferirBeneficiario.value.apellidosBeneficiario,
      nroActa: this.inputTransferirBeneficiario.value.numeroActa,
      documento: this.inputTransferirBeneficiario.value.numeroDocumento,
      observaciones: this.inputTransferirBeneficiario.value.observaciones,
      tipoDocumento: this.inputTransferirBeneficiario.value.tipoDocumento,
      tipoTransferencia: 'TPTRANS001',
      lstTransferenciaDetalle: dataSourceFilter
    }

    this.serviceTransferencia.postTransferencia(params).subscribe((response: any) => {
      if (response.data && response.data.nuIdRecurso > 0) {
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

  }

  searchPass(){
    Swal.fire(
      'Consulta al PASS',
      'Devolución aceptada',
      'success'
    )
  }
  /*FUNCION DE BTN VALIDAR DNI*/ 
  validarDNI() {
    //console.log('validarDNI');
    let params = { "numDNIConsulta": this.inputTransferirBeneficiario.get("numDoc").value }
    //console.log("params ", params)
    this.pideService.consultarDNI(params).subscribe((result: any) => {
      //console.log("result ", result)
      // 
      if (result.dataService && result.dataService) {
        this.validaDNIClass = true;
        if (result.dataService.datosPersona) {
          let persona = result.dataService.datosPersona;
          let nombreBeneficiario, paterno, materno;
          nombreBeneficiario = persona.prenombres != null ? persona.prenombres : '';
          paterno = persona.apPrimer != null ? persona.apPrimer : '';
          materno = persona.apSegundo != null ? persona.apSegundo : '';
          this.inputTransferirBeneficiario.get("nombres").patchValue(nombreBeneficiario + ' ' + paterno + ' ' + materno);
          this.inputTransferirBeneficiario.get("direccion").patchValue(persona.direccion);
          Swal.fire(
            'Mensaje de Confirmación',
            'Se validó el DNI en RENIEC.',
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
          'Hay errores con el servicio de validación de DNI. Contactar con el administrador del sistema.',
          'error'
        )
      }
    }, () => {
    }
    )
  }
  close() {
    //console.log("cerrar");
    this._dialogRef.close(-1);
  }
}
