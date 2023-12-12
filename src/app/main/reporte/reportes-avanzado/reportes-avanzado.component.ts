import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { Almacen } from 'app/shared/models/almacen.model';
import { AlmacenService } from 'app/service/almacen.service';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
import { Router } from "@angular/router";
import { ParametroService } from 'app/service/parametro.service';
import { ATF } from 'app/shared/models/atf.model';
import { AtfService } from 'app/service/atf.service';
import { PuestoControl } from 'app/shared/models/puesto-control.model';
import { PuestoControlService } from 'app/service/puesto-control.service';
import Swal from 'sweetalert2'
import { CreateAlmacenResponse } from 'app/shared/models/response/create-almacen-response';
import { DeleteAlmacenResponse } from 'app/shared/models/response/delete-almacen-response';
import { Reportes } from 'app/shared/models/reportes.model';
import { ReportesResponse } from 'app/shared/models/response/reportes-response';
import { RecursoService } from 'app/service/recurso.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionMessageComponent } from 'app/main/popups-common/action-message/action-message.component';
import { ReportesService } from 'app/service/reportes.service';
import { TransferenciaService } from 'app/service/transferencia.service';
import { Constants } from 'app/shared/models/util/constants';
import { Parametro } from 'app/shared/models/parametro.model';
import { ParametroResponse } from 'app/shared/models/response/parametro-response';

@Component({
  selector: 'app-reportes-avanzado',
  templateUrl: './reportes-avanzado.component.html',
  styleUrls: ['./reportes-avanzado.component.scss']
})
export class ReportesAvanzadoComponent implements OnInit {
  reportesResponse: ReportesResponse = new ReportesResponse();
  almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
  cantidadTotal:number=0;
  dataSource = new MatTableDataSource<Reportes>([]);
  dataSource2 = new MatTableDataSource<Reportes>([]);
  resultsLength = 0;
  selection = new SelectionModel<Reportes>(true, []);
  reportesRequest:  Reportes = new Reportes();
  numeroDocumento: string = '44691637';
  displayedColumns: string[] = ['fecha','destino', 'tipo', 'acciones']; 
  displayedColumns2: string[] = ['nombreCientifico','nombreComun', 'tipoEspecie']; 
  inputReporteAvanzado: FormGroup;  
  listATF: ATF[] = [];
  listAlmacen: Almacen[] = [];
  listTipoTransferencia: Parametro[] = [];
  listPuestoControl: PuestoControl[] = [];
  tipoTransferencia: string = 'Salidas';
  transferenciaParametro: string = Constants.TIPO_TRANSFERENCIA;
  view: any[] = [450, 350];
  parametroResponse: ParametroResponse = new ParametroResponse();

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  idAlmacen:number=0;
  tipoTransferenciaDetalle:string=null;

  nombre:string='Destino';
  ocultarBoton: number=0;


  colorScheme = {
    domain: ['#4a962c', '#C9E0C0', '#89B361', '#AAAAAA']
  };

  capacidad = [
    {
      "name": "Ocupado",
      "value": 89
    },
    {
      "name": "Disponible",
      "value": 50
    }
  ];

  movimientos = [
    {
      "name": "Maderable",
      "value": 42
    },
    {
      "name": "No Maderable",
      "value": 51
    },
    {
      "name": "Fauna",
      "value": 25
    }
  ];
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private reportesService: TransferenciaService,
    private almacenService: AlmacenService,
    public _router: Router,
    private parametroService: ParametroService,
    private atfService: AtfService,
    private puestoControlService: PuestoControlService,
    private _recursoService: RecursoService,
     public dialog: MatDialog,
    ) {
      this.reportesResponse.pageNumber = 1;
      this.reportesResponse.pageSize = 10;
      this.parametroResponse.pageNumber = 1;
      this.parametroResponse.pageSize = 1000;



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

     this.idAlmacen = window.history.state.idAlmacen;

     
      //this.inputReporteAvanzado.get('almacen').patchValue(182);      
    

    this.inputReporteAvanzado = this._formBuilder.group({
      almacen: [''],
      tipoTransferenciaDetalle: ['']
     // tipoAlmacen: ['', Validators.required]
    });
    this.almacenResponse.pageNumber = 1;
    this.almacenResponse.pageSize = 10;
    this.numeroDocumento = localStorage.getItem('usuario');

    if(this.idAlmacen !== null && this.idAlmacen !== undefined)
    {
    this.inputReporteAvanzado.get("almacen").patchValue(this.idAlmacen);  
    }

  }

  

  salidas(){
    this.tipoTransferencia = 'Salidas'
    this.nombre = 'Destino';
    this.ocultarBoton = 0;
    this.searchReportesAvanzados();
  }
  entradas(){
    this.tipoTransferencia = 'Entradas'
    this.nombre = 'Origen';
    this.ocultarBoton = 1;
    this.searchReportesAvanzados();
  }
  

  

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
    this.searchReportesAvanzados();
    this.searchAlmacen();
    this.searchTipoTransferencia();
  } 

  
  searchTipoTransferencia() {
    this.parametroService.getParametroSearch(this.transferenciaParametro).subscribe((response: Parametro[]) => {
      this.listTipoTransferencia = response;
    });
  }
  
 
  cambioAlmacen()
  {
    this.idAlmacen = this.inputReporteAvanzado.get('almacen').value; 
    this.searchReportesAvanzados();
  }

  cambioTransferencia()
  {
    this.tipoTransferenciaDetalle = this.inputReporteAvanzado.get('tipoTransferenciaDetalle').value; 
    if(this.inputReporteAvanzado.get('tipoTransferenciaDetalle').value == undefined)
    {
      this.tipoTransferenciaDetalle = null;
    }
    this.searchReportesAvanzados();    
  }


  async searchAlmacen() {
    this.dataSource = new MatTableDataSource<Almacen>([])
    let almacenRequest:Almacen = new Almacen;
    almacenRequest.txNombreAlmacen='';
    almacenRequest.txNumeroDocumento = this.numeroDocumento;
    this.almacenService.getAlmacenSearch(almacenRequest,this.almacenResponse.pageNumber,this.almacenResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
    this.almacenResponse =response;
    this.listAlmacen=response.data;
    })
  }

  async searchReportesAvanzados() {    
    
    this.dataSource = new MatTableDataSource<Reportes>([])
    this.reportesRequest.nuIdAlmacen = this.idAlmacen; //this.inputReporteAvanzado.get('nombreAlmacen').value;
    this.reportesRequest.tipoTransferencia = this.tipoTransferencia;         
    this.reportesRequest.nuIdTransferencia = null;
    this.reportesRequest.tipoTransferenciaDetalle = this.tipoTransferenciaDetalle;
    this.reportesService.getReportesAvanzadosSearch(this.reportesRequest,this.reportesResponse.pageNumber,this.reportesResponse.pageSize).subscribe((response:ReportesResponse)=>{
      if(response.success){ 
        this.reportesResponse = response;
        this.dataSource = new MatTableDataSource<Reportes>(response.data);
        this.resultsLength=response.totalRecords;
      }
    })
  }
  
  verEspecies(nuIdTransferencia:number) { 
    this.dataSource2 = new MatTableDataSource<Reportes>([])
    this.reportesRequest.nuIdAlmacen = 182; //this.inputReporteAvanzado.get('nombreAlmacen').value;
    this.reportesRequest.tipoTransferencia = this.tipoTransferencia;    
    this.reportesRequest.nuIdTransferencia = nuIdTransferencia;   
    this.reportesService.getReportesAvanzadosSearch(this.reportesRequest,this.reportesResponse.pageNumber,this.reportesResponse.pageSize).subscribe((response:ReportesResponse)=>{
      if(response.success){ 
        this.reportesResponse = response;
        this.dataSource2 = new MatTableDataSource<Reportes>(response.data);
        this.resultsLength=response.totalRecords;
      }
    })     
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.reportesResponse.pageNumber = e.pageIndex+1;
    this.reportesResponse.pageSize = e.pageSize;
    this.searchReportesAvanzados();
    return e;
  } 
  

  limpiarCampos(): void {    
  }

  volver(){   
    this._router.navigate(['reportes']);       
  }

}

