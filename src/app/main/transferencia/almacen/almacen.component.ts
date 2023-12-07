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
  constructor(public _dialogRef: MatDialogRef<AlmacenComponent>,
    private _recursoService: RecursoService,
    public _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private serviceTransferencia: TransferenciaService,
    private parametroService: ParametroService,
    private atfService: AtfService,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData,
    private puestoControlService: PuestoControlService,
    private almacenService: AlmacenService) {
      this.recursoResponse.pageNumber = 1;
      this.recursoResponse.pageSize = 5;
      this.inputTransferirAlmacen = this._formBuilder.group({
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
      }
      paramsList.push(params);
    });

    console.log("paramsList", paramsList)
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
