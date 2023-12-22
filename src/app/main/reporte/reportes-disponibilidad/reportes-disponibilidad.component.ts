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
  
  
  @Component({
    selector: 'app-reportes-disponibilidad',
    templateUrl: './reportes-disponibilidad.component.html',
    styleUrls: ['./reportes-disponibilidad.component.scss']
  })
  export class ReportesDisponibilidadComponent implements OnInit {
  
    dataSource = new MatTableDataSource<Reportes>([]);
    dataSource2 = new MatTableDataSource<Reportes>([]);
    selection = new SelectionModel<Recurso>(true, []);
    listAlmacen: Almacen[] = [];
    almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
    displayedColumns: string[] = ['atf', 'puestoControl', 'almacen','maderables','noMaderables','fauna'];
    displayedColumns2: string[] = ['maderables','noMaderables', 'fauna'];
    inputBandeja: FormGroup;
    resultsLength = 0;
    idAlmacen: any;
    reportesResponse: ReportesResponse = new ReportesResponse();
    reportesResponse2: ReportesResponse = new ReportesResponse();
    numeroDocumento: string = '44691637';
    listReporte: Reportes[] = [];
    listPuestoControl: PuestoControl[] = [];
    listATF: ATF[] = [];
    reportesRequest:  Reportes = new Reportes();
    listPeriodoTri: Parametro[] = [];
    listPeriodoSe: Parametro[] = [];
    periodoTri: string = Constants.PERIODO_TRI;
    periodoSe: string = Constants.PERIODO_SE;
    listTipoAccion: Parametro[] = [];
    periodo: string = Constants.PERIODO_TRI;
    tipoAccion: string = Constants.TIPOACCION;
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
      this.reportesResponse2.pageNumber = 1;
      this.reportesResponse2.pageSize = 10;
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
        almacen: [''] 
      });
  
      this.numeroDocumento = localStorage.getItem('usuario'); 
    }
  
    ngOnInit(): void {
     this.searchAlmacen();
     this.searchTipoEspecie();     
     this.searchPeriodoTrimestral();
     this.searchPeriodoSemestral();
     this.searchTipoAccion();
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
  
    searchTipoAccion() {
      this.parametroService.getParametroSearch(this.tipoAccion).subscribe((response: Parametro[]) => {
        this.listTipoAccion= response;
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
      this.dataSource = new MatTableDataSource<Reportes>([])
      this.reportesRequest.nuIdAlmacen = this.inputBandeja.get('almacen').value;        
      this.reportesRequest.numeroDocumento =  this.numeroDocumento;
      this._reportesService.getReporteDisponibilidad(this.reportesRequest,this.reportesResponse.pageNumber,this.reportesResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
        if(response.success){
          this.reportesResponse = response;
          this.dataSource = new MatTableDataSource<Reportes>(response.data);
          this.dataSource2 = new MatTableDataSource<Reportes>();
          this.reportesResponse.totalRecords=this.dataSource.data.length;
          
        }
      })
    }
  
    verDetalle (nuIdAlmacen:number){
      //consultar las especies
      console.log('nuIdAlmacen',nuIdAlmacen);      
    }
    
    
   
    pageDataSource(e: PageEvent): PageEvent {
      this.reportesResponse.pageNumber = e.pageIndex + 1;
      this.reportesResponse.pageSize = e.pageSize;
      this.SearchReportes();
      return e;
    }
  
    limpiarCampos(): void {
      this.inputBandeja.get('almacen').setValue('');
      this.reportesResponse.pageNumber = 1;
      this.reportesResponse.pageSize = 10;
      this.reportesResponse2.pageNumber = 1;
      this.reportesResponse2.pageSize = 10;
    }
  
  
  
  
    exportToExcel() {
      const dataToExport = this.dataSource.data;     
      
        const headers = ['Almacén','Acción', 'Cantidad Total'];
        const data = [headers, ...dataToExport.map(item => [
          item.almacenOrigen,
          item.tipoAccion === 'I' ? 'Ingresos': 'Salidas'   ,    
          item.tipoAccion === 'I' ? Number(item.cantidadTotalIngresos): Number(item.cantidadTotalSalidas)       
          
          
        ])];
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);        
      
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte-Indicadores');
      
        XLSX.writeFile(wb, 'Reporte-Indicadores.xlsx');
      }
      
        
      
    
  
  }
  