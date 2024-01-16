  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
  import { FuseConfigService } from '@fuse/services/config.service';
  import { MatTableDataSource } from '@angular/material/table';
  import { SelectionModel } from '@angular/cdk/collections';
  import { MatPaginator, PageEvent } from '@angular/material/paginator';
  import { Router } from "@angular/router";
  import Swal from 'sweetalert2'
  import { Almacen } from 'app/shared/models/almacen.model';
  import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
  import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
  import { DetalleComponent } from 'app/main/inventario/detalle/detalle/detalle.component';
  import { DetalleAlmacenComponent } from 'app/main/inventario/detalle-almacen/detalle-almacen/detalle-almacen.component';
  import { RecursoService } from 'app/service/recurso.service';
  import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
  import { Recurso } from 'app/shared/models/recurso.model';
  import { PuestoControlService } from 'app/service/puesto-control.service';
  import { PuestoControl } from 'app/shared/models/puesto-control.model';
  import { ATF } from 'app/shared/models/atf.model';
  import { AtfService } from 'app/service/atf.service';
  import { AlmacenService } from 'app/service/almacen.service';
  import { Decimal } from 'app/shared/models/settings.model';
  import * as XLSX from 'xlsx';
  import { ParametroService } from 'app/service/parametro.service';
  import { Parametro } from 'app/shared/models/parametro.model';
  import { Constants } from 'app/shared/models/util/constants';
  import { ReportesResponse } from 'app/shared/models/response/reportes-response';
  import { Reportes } from 'app/shared/models/reportes.model';
  import { ReportesService } from 'app/service/reportes.service';
  import { ModalDetalleDonacionComponent } from '../reportes-donaciones/modal/modal-detalle-donacion/modal-detalle-donacion.component';
import { finalize } from 'rxjs/operators';

  
  
  @Component({
    selector: 'app-reportes-salidas',
  templateUrl: './reportes-salidas.component.html',
  styleUrls: ['./reportes-salidas.component.scss']
  })
  export class ReportesSalidasComponent implements OnInit {
  
    dataSource = new MatTableDataSource<Reportes>([]);
    dataSourceExcel = new MatTableDataSource<Reportes>([]);
    selection = new SelectionModel<Recurso>(true, []);
    listAlmacen: Almacen[] = [];
    almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
    displayedColumns: string[] = ['fecha','origen','destino', 'nroActa', 'observaciones', 'acciones'];
    inputBandeja: FormGroup;
    resultsLength = 0;
    idAlmacen: any;
    reportesResponse: ReportesResponse = new ReportesResponse();
    reportesResponseExcel: ReportesResponse = new ReportesResponse();
    numeroDocumento: string = '44691637';
    listReporte: Reportes[] = [];
    listPuestoControl: PuestoControl[] = [];
    listATF: ATF[] = [];
    reportesRequest:  Reportes = new Reportes();
    listPeriodoTri: Parametro[] = [];
    listPeriodoSe: Parametro[] = [];
    periodoTri: string = Constants.PERIODO_TRI;
    periodoSe: string = Constants.PERIODO_SE;
    lstDecimal = new Decimal();    
    cantidadPipe!: string;
    cantidad!: number;
    redondeo!: string;
    nameAlmacen!: string;
    varPeriodo:string = null;
    listTipoIngreso: Parametro[] = [];
    listDisponibilidadActa: Parametro[] = [];
    tipoIngreso: string = Constants.TIPO_INGRESO;
    disponibilidadActa: string = Constants.DISPONIBILIDAD_ACTA;
    tipoEspecie: string = Constants.TIPO_PRODUCTO_CATA;
    listTipoEspecie: Parametro[] = [];
    constructor(
      private _fuseConfigService: FuseConfigService,
      private _formBuilder: FormBuilder,
      public _router: Router,
      public _dialog: MatDialog,
      private _reportesService: ReportesService,
      private puestoControlService: PuestoControlService,
      private atfService: AtfService,
      private almacenService: AlmacenService,
      private parametroService: ParametroService, 
    ) {
      this.reportesResponse.pageNumber = 1;
      this.reportesResponse.pageSize = 10;
      this._fuseConfigService.config = {
        layout: {
          navbar: {
            hidden: false
          },
          toolbar: {
            hidden: true
          },
          footer: {
            hidden: true
          },
          sidepanel: {
            hidden: true
          }
        }
      };
      this.almacenResponse.pageNumber = 1;
       this.almacenResponse.pageSize = 1000;
      this.inputBandeja = this._formBuilder.group({
        almacen: [''],      
        tipoEspecie: [''], 
        periodo: [''], 
        periodoSe: [''], 
      });
  
      this.numeroDocumento = localStorage.getItem('usuario'); 
    }
  
    ngOnInit(): void {
     this.searchAlmacen();
     this.searchTipoEspecie();     
     this.searchPeriodoTrimestral();
     this.searchPeriodoSemestral();
     //this.Search();
    }
  
    async searchAlmacen() {
      this.dataSource = new MatTableDataSource<Reportes>([])
      let almacenRequest:Almacen = new Almacen;
      almacenRequest.txNombreAlmacen='';
      almacenRequest.txNumeroDocumento = this.numeroDocumento;
      this.almacenService.getAlmacenSearch(almacenRequest,this.almacenResponse.pageNumber,this.almacenResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
      this.almacenResponse =response;
      this.listAlmacen=response.data;
      })
    }
   
    searchTipoEspecie() {
      this.parametroService.getParametroSearch(this.tipoEspecie).subscribe((response: Parametro[]) => {
        this.listTipoEspecie = response;
      });
    }

    searchPeriodoTrimestral() {
      this.parametroService.getParametroSearch(this.periodoTri).subscribe((response: Parametro[]) => {
        this.listPeriodoTri = response;
      });
    }

    searchPeriodoSemestral() {
      this.parametroService.getParametroSearch(this.periodoSe).subscribe((response: Parametro[]) => {
        this.listPeriodoSe = response;
      });
    }


    changePeridoTrimestral() {
      this.varPeriodo = this.inputBandeja.get('periodo').value;
      this.inputBandeja.get('periodoSe').setValue('');  
    }

    changePeridoSemestral() {
      this.varPeriodo = this.inputBandeja.get('periodoSe').value;
      this.inputBandeja.get('periodo').setValue('');  
    }


    async SearchReportes() {

      if(( this.inputBandeja.get('periodo').value === undefined || this.inputBandeja.get('periodo').value === null || this.inputBandeja.get('periodo').value === '') &&
      (this.inputBandeja.get('periodoSe').value === undefined || this.inputBandeja.get('periodoSe').value === null || this.inputBandeja.get('periodoSe').value === '') &&
      ( this.inputBandeja.get('almacen').value === undefined ||  this.inputBandeja.get('almacen').value === null ||  this.inputBandeja.get('almacen').value === '') &&
      ( this.inputBandeja.get('tipoEspecie').value === undefined ||  this.inputBandeja.get('tipoEspecie').value === null ||  this.inputBandeja.get('tipoEspecie').value === '') )
{
  Swal.fire({
    title: 'Alerta!',
    text: "Debe llenar alguno de los filtros.",
    icon: 'warning',
    //showCancelButton: true,
    confirmButtonColor: '#679738',
    cancelButtonColor: '#d33',
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
        //
  }) 
}
else{

      this.dataSource = new MatTableDataSource<Reportes>([])
      this.reportesRequest.nuIdAlmacen = this.inputBandeja.get('almacen').value;
      this.reportesRequest.tipoEspecie = this.inputBandeja.get('tipoEspecie').value;    
      this.reportesRequest.periodo = this.varPeriodo;
      this.reportesRequest.tipo =  'G';
      this.reportesRequest.numeroDocumento =  this.numeroDocumento;
      this._reportesService.getReporteSalidas(this.reportesRequest,this.reportesResponse.pageNumber,this.reportesResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
        if(response.success){
          this.reportesResponse = response;
          this.dataSource = new MatTableDataSource<Reportes>(response.data);
          this.resultsLength=response.totalRecords;
        }
      })
    }
    }


    async SearchReportesExcel() {

      if(( this.inputBandeja.get('periodo').value === undefined || this.inputBandeja.get('periodo').value === null || this.inputBandeja.get('periodo').value === '') &&
      (this.inputBandeja.get('periodoSe').value === undefined || this.inputBandeja.get('periodoSe').value === null || this.inputBandeja.get('periodoSe').value === '') &&
      ( this.inputBandeja.get('almacen').value === undefined ||  this.inputBandeja.get('almacen').value === null ||  this.inputBandeja.get('almacen').value === '') &&
      ( this.inputBandeja.get('tipoEspecie').value === undefined ||  this.inputBandeja.get('tipoEspecie').value === null ||  this.inputBandeja.get('tipoEspecie').value === '') )
{
  Swal.fire({
    title: 'Alerta!',
    text: "Debe llenar alguno de los filtros.",
    icon: 'warning',
    //showCancelButton: true,
    confirmButtonColor: '#679738',
    cancelButtonColor: '#d33',
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
        //
  }) 
}
else{
      this.reportesResponseExcel.pageNumber = 1;
      this.reportesResponseExcel.pageSize = 100000;
      this.dataSourceExcel = new MatTableDataSource<Reportes>([])
      this.reportesRequest.nuIdAlmacen = this.inputBandeja.get('almacen').value;
      this.reportesRequest.tipoEspecie = this.inputBandeja.get('tipoEspecie').value;    
      this.reportesRequest.periodo = this.varPeriodo;
      this.reportesRequest.tipo =  'GD';
      this.reportesRequest.numeroDocumento =  this.numeroDocumento;
      this._reportesService.getReporteSalidas(this.reportesRequest,this.reportesResponseExcel.pageNumber,this.reportesResponseExcel.pageSize)
      .pipe(finalize(() => this.exportToExcel()))
      .subscribe((response:BandejaAlmacenResponse)=>{
        if(response.success){
          this.dataSourceExcel = new MatTableDataSource<Reportes>(response.data);
        }
      })
    }
    }

    verDetalleSalida(tipoTransferencia:string,nroActa:string,nuIdTransferencia:number) {
      if(tipoTransferencia==='TPTRANS006'){
        nroActa=null;
      }
      const dialogRef = this._dialog.open(ModalDetalleDonacionComponent, {
        width: '1000px',
        height: '600px',
        data: { nroActa: nroActa, nuIdTransferencia :nuIdTransferencia }
      });
  
      dialogRef.afterClosed().subscribe(result => {  
        console.log('result',result);
        if (result == 999) {
          
         this.SearchReportes();
        }
      })
      
    }
    
    
   
    pageDataSource(e: PageEvent): PageEvent {
      this.reportesResponse.pageNumber = e.pageIndex + 1;
      this.reportesResponse.pageSize = e.pageSize;
      this.SearchReportes();
      return e;
    }
  
    limpiarCampos(): void {
      this.inputBandeja.get('almacen').setValue('');
      this.inputBandeja.get('tipoEspecie').setValue('');   
      this.inputBandeja.get('periodo').setValue('');   
      this.inputBandeja.get('periodoSe').setValue('');  
      this.varPeriodo = null; 
      this.reportesResponse.pageNumber = 1;
      this.reportesResponse.pageSize = 10;
      
    }
  
  
    exportToExcel() {
      const dataToExport = this.dataSourceExcel.data;
      console.log('eeeeeeeeee',this.dataSourceExcel.data);
        const headers = ['Fecha','Origen','Destino', 'Nombre Científico','Nombre Común', 'Cantidad','U. de Medida', 'Tipo de Especie','Tipo de Transferencia'];
        const data = [headers, ...dataToExport.map(item => [
          this.formatDateToUTC(item.feFechaRegistro),
          item.almacenOrigen,
          
          item.tipoTransferencia === 'TPTRANS001' ?  item.nombre :
          item.tipoTransferencia === 'TPTRANS006' ?  item.faunaSalida :
          item.tipoTransferencia === 'TPTRANS002' ?  item.almacenDestino : item.almacenDestino,
          item.nombreCientifico,
          item.nombreComun,
          Number(item.cantidadProducto),
          item.unidadMedida,
          item.tipoEspecie === 'MAD' ? 'Maderable' :
          item.tipoEspecie === 'NOMAD' ? 'No Maderable' :
          item.tipoEspecie === 'FA' ? 'Fauna' : item.tipoEspecie,
          item.tipoTransferenciaDetalle
          
          
          
        ])];
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);        
      
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ReporteSalidas');
      
        XLSX.writeFile(wb, 'ReporteSalidas.xlsx');
    
      
        
      
    }
  
    formatDateToUTC(date) {
      const dateInUTC = new Date(date);
      const year = dateInUTC.getUTCFullYear();
      const month = dateInUTC.getUTCMonth() + 1;
      const day = dateInUTC.getUTCDate();
      const hours = dateInUTC.getUTCHours();
      const minutes = dateInUTC.getUTCMinutes();
      const seconds = dateInUTC.getUTCSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; 
      const formattedDate = `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
      return formattedDate;
    }

  }
  