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
import { invalid } from 'moment';


@Component({
  selector: 'app-reportes-donaciones',
  templateUrl: './reportes-donaciones.component.html',
  styleUrls: ['./reportes-donaciones.component.scss']
})

export class ReportesDonacionesComponent implements OnInit {

  dataSource = new MatTableDataSource<Reportes>([]);
  selection = new SelectionModel<Recurso>(true, []);
  listAlmacen: Almacen[] = [];
  almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
  displayedColumns: string[] = ['fecha','origen','destino', 'nombreCientifico', 'nombreComun', 'cantidad','tipoEspecie'];
  inputBandeja: FormGroup;
  resultsLength = 0;
  idAlmacen: any;
  reportesResponse: ReportesResponse = new ReportesResponse();
  numeroDocumento: string = '44691637';
  listReporte: Reportes[] = [];
  listPuestoControl: PuestoControl[] = [];
  listATF: ATF[] = [];
  reportesRequest:  Reportes = new Reportes();
  lstDecimal = new Decimal();
  cantidadPipe!: string;
  fechaInicio:any = '';
  fechaFin:any = '';
  cantidad!: number;
  redondeo!: string;
  nameAlmacen!: string;
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
      fechaInicio: [''], 
      fechaFin: [''], 
    });

    this.numeroDocumento = localStorage.getItem('usuario'); 
  }

  ngOnInit(): void {
   this.searchAlmacen();
   this.searchTipoEspecie();
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

  async SearchReportes() {

    this.fechaInicio = this.inputBandeja.get('fechaInicio').value;
    if( this.fechaInicio === undefined || this.fechaInicio === null || this.fechaInicio === '')
    { this.fechaInicio = null;}
    else{this.fechaInicio = new Date (this.inputBandeja.get('fechaInicio').value);}

    this.fechaFin = this.inputBandeja.get('fechaFin').value;
    if( this.fechaFin === undefined || this.fechaFin === null || this.fechaFin === '')
    { this.fechaFin = null;}
    else{this.fechaFin = new Date (this.inputBandeja.get('fechaFin').value);}

    this.dataSource = new MatTableDataSource<Reportes>([])
    this.reportesRequest.nuIdAlmacen = this.inputBandeja.get('almacen').value;
    this.reportesRequest.tipoEspecie = this.inputBandeja.get('tipoEspecie').value;    
    this.reportesRequest.tipoTransferencia = 'TPTRANS001'; 
    this.reportesRequest.fechaInicio = this.fechaInicio;
    this.reportesRequest.fechaFin = this.fechaFin;
    this.reportesRequest.numeroDocumento =  this.numeroDocumento;
    this._reportesService.getReporteSalidas(this.reportesRequest,this.reportesResponse.pageNumber,this.reportesResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
      if(response.success){
        this.reportesResponse = response;
        this.dataSource = new MatTableDataSource<Reportes>(response.data);
        this.resultsLength=response.totalRecords;
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
    this.inputBandeja.get('fechaInicio').setValue('');   
    this.inputBandeja.get('fechaFin').setValue('');   
    this.reportesResponse.pageNumber = 1;
    this.reportesResponse.pageSize = 10;
  }
  
  exportToExcel() {
    console.log('Datos a exportar:', this.listReporte);
    /*const dataToExport = this.listReporte; */
    const dataToExport = this.dataSource.data;
    var nombreAlmacen='';
    
    if(this.inputBandeja.get('almacen').value){
      nombreAlmacen=this.inputBandeja.get('almacen').value;
      const headers = ['Almacen','Fecha','Origen','Destino','Nombre Científico', 'Nombre Común', 'Cantidad', 'Tipo de Especie'];
      const data = [headers, ...dataToExport.map(item => [
        nombreAlmacen ,
        this.formatDateToUTC(item.feFechaRegistro),
        //item.feFechaRegistro,
        item.almacenOrigen,
        item.nombre,
        item.nombreCientifico,
        item.nombreComun,
        item.cantidadProducto,
        item.tipoEspecie === 'MAD' ? 'Maderable' :
        item.tipoEspecie === 'NOMAD' ? 'No Maderable' :
        item.tipoEspecie === 'FA' ? 'Fauna' : item.tipoEspecie
        //item.tipoEspecie
        
      ])];
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);        
    
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'ReporteDonaciones');
    
      XLSX.writeFile(wb, 'ReporteDonaciones.xlsx');
    }else{
      const headers = ['Fecha','Origen','Destino','Nombre Científico', 'Nombre Común', 'Cantidad', 'Tipo de Especie'];
      const data = [headers, ...dataToExport.map(item => [        
        //item.feFechaRegistro,
        this.formatDateToUTC(item.feFechaRegistro),
        item.almacenOrigen,
        item.nombre,
        item.nombreCientifico,
        item.nombreComun,
        item.cantidadProducto,
       //item.tipoEspecie
        item.tipoEspecie === 'MAD' ? 'Maderable' :
        item.tipoEspecie === 'NOMAD' ? 'No Maderable' :
        item.tipoEspecie === 'FA' ? 'Fauna' : item.tipoEspecie
        
      ])];
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);        
    
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'ReporteDonaciones');
    
      XLSX.writeFile(wb, 'ReporteDonaciones.xlsx');
    }
    
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
