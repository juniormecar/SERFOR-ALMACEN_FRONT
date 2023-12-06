import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Kardex } from 'app/shared/models/kardex.model';
import { KardexService } from 'app/service/kardex.service';
import {KardexResponse } from 'app/shared/models/response/kardex-response';
import { Router } from "@angular/router";
import Swal from 'sweetalert2'
import { Almacen } from 'app/shared/models/almacen.model';
import { AlmacenService } from 'app/service/almacen.service';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
import * as XLSX from 'xlsx';
import { Parametro } from 'app/shared/models/parametro.model';
import { ParametroService } from 'app/service/parametro.service';
import { Constants } from 'app/shared/models/util/constants';
import { ParametroResponse } from 'app/shared/models/response/parametro-response';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  dataSource = new MatTableDataSource<Kardex>([]);
  selection = new SelectionModel<Kardex>(true, []);
  kardexResponse: KardexResponse = new KardexResponse();
  kardexRequest:  Kardex = new Kardex();
  listAlmacen: Almacen[] = [];
  listKardex: Kardex[] = [];
  displayedColumns: string[] = ['fecha','Tipo','nombreCientifico','nombreComun','documento','tipoI','cantidadI','cantidadM3I', 'totalI','totalM3I' ];
  almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
  inputBandeja: FormGroup; 
  resultsLength = 0;
  numeroDocumento: string = '44691637';
  listTipoIngreso: Parametro[] = [];
  listTipoEspecie: Parametro[] = [];
  listPeriodo: Parametro[] = [];
  listDisponibilidadActa: Parametro[] = [];
  tipoIngreso: string = Constants.TIPO_INGRESO;
  disponibilidadActa: string = Constants.DISPONIBILIDAD_ACTA;
  tipoEspecie: string = Constants.TIPO_PRODUCTO_CATA;
  periodo: string = Constants.PERIODO;
  parametroResponse: ParametroResponse = new ParametroResponse();



  //multi: [];
  view: [number,number] = [1500, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Mes';
  showYAxisLabel: boolean = true;
  //yAxisLabel: string = 'Rango';
  legendTitle: string = 'Tipo'
  colorScheme = {
    domain: ['#43a047', '#C9E0C0', '#AAAAAA']
  };

    multi = [
    {
      "name": "Enero",
      "series": [
        {
          "name": "Entrada",
          "value": 73
        },
        {
          "name": "Salida",
          "value": 89
        }
      ]
    },
  
    {
      "name": "Febrero",
      "series": [
        {
          "name": "Entrada",
          "value": 78
        },
        {
          "name": "Salida",
          "value": 82
        }
      ]
    },
  
    {
      "name": "Marzo",
      "series": [
        {
          "name": "Entrada",
          "value": 50
        },
        {
          "name": "Salida",
          "value": 58
        }
      ]
    },
    {
      "name": "Abril",
      "series": [
        {
          "name": "Entrada",
          "value": 70
        },
        {
          "name": "Salida",
          "value": 48
        }
      ]
    },
    {
      "name": "Mayo",
      "series": [
        {
          "name": "Entrada",
          "value": 30
        },
        {
          "name": "Salida",
          "value": 28
        }
      ]
    },
    {
      "name": "Junio",
      "series": [
        {
          "name": "Entrada",
          "value": 90
        },
        {
          "name": "Salida",
          "value": 78
        }
      ]
    },
    {
      "name": "Julio",
      "series": [
        {
          "name": "Entrada",
          "value": 40
        },
        {
          "name": "Salida",
          "value": 78
        }
      ]
    }
  ];
  
  



  // constructor() {
  //   Object.assign(this, { multi })
  // }

 onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }









  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private kardexService: KardexService,
    private almacenService: AlmacenService,
    public _router: Router,
    private parametroService: ParametroService,    
    ) {
      //Object.assign(this, { multi });
     this.kardexResponse.pageNumber = 1;
     this.kardexResponse.pageSize = 10;
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
     this.parametroResponse.pageNumber = 1;
      this.parametroResponse.pageSize = 1000;
    this.inputBandeja = this._formBuilder.group({
      almacen: [''],      
      tipoIngreso: [''], 
      disponibilidadActa: [''], 
      especie: [''], 
      tipoEspecie: [''], 
      periodo: [''], 
    });    
    this.numeroDocumento = localStorage.getItem('usuario');
  }

  ngOnInit(): void {
    
    //this.Search();   
    this.searchAlmacen();
    this.searchTipoIngreso();
    this.searchTipoEspecie();
    this.searchPeriodo();
  }

  searchTipoIngreso() {
    let parametroRequest:Parametro = new Parametro;  
    parametroRequest.prefijo = this.tipoIngreso;
    this.parametroService.getParametroSearch(parametroRequest,this.parametroResponse.pageNumber,this.parametroResponse.pageSize).subscribe((response:ParametroResponse)=>{
      this.parametroResponse =response;
      this.listTipoIngreso=response.data;
    })
  }

  searchPeriodo() {
    let parametroRequest:Parametro = new Parametro;  
    parametroRequest.prefijo = this.periodo;
    this.parametroService.getParametroSearch(parametroRequest,this.parametroResponse.pageNumber,this.parametroResponse.pageSize).subscribe((response:ParametroResponse)=>{
      this.parametroResponse =response;
      this.listPeriodo=response.data;
    })
  }

  
  searchTipoEspecie() {
    let parametroRequest:Parametro = new Parametro;  
    parametroRequest.prefijo = this.tipoEspecie;
    this.parametroService.getParametroSearch(parametroRequest,this.parametroResponse.pageNumber,this.parametroResponse.pageSize).subscribe((response:ParametroResponse)=>{
      this.parametroResponse =response;
      this.listTipoEspecie=response.data;
    })
  }
 
  busquedaAvanzada() {    
    let url = 'reportes-avanzado/';
    this._router.navigate([url], { state: { idAlmacen: this.inputBandeja.get('almacen').value} });
  } 

  async Search() {
    
  }  

  async SearchPage() {
    this.dataSource = new MatTableDataSource<Kardex>([])
    this.kardexService.getKardexSearch(
    this.inputBandeja.get('almacen').value,
    this.inputBandeja.get('especie').value,
    this.inputBandeja.get('tipoEspecie').value,
    this.inputBandeja.get('tipoIngreso').value,
    this.inputBandeja.get('disponibilidadActa').value,
    this.kardexResponse.pageNumber,this.kardexResponse.pageSize).subscribe((response:KardexResponse)=>{
      if(response.success){
        debugger
        this.kardexResponse =response;
        this.dataSource = new MatTableDataSource<Kardex>(response.data);
        this.resultsLength=response.totalRecords;
      }
    })
  }  

 
  async searchAlmacen() {
    this.dataSource = new MatTableDataSource<Kardex>([])
    let almacenRequest:Almacen = new Almacen;
    almacenRequest.txNombreAlmacen='';
    almacenRequest.txNumeroDocumento = this.numeroDocumento;
    this.almacenService.getAlmacenSearch(almacenRequest,this.almacenResponse.pageNumber,this.almacenResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
    this.almacenResponse =response;
    this.listAlmacen=response.data;
    })
  }

  pageDataSource(e: PageEvent): PageEvent {
    debugger
    this.kardexResponse.pageNumber = e.pageIndex+1;
     this.kardexResponse.pageSize = e.pageSize;
     this.SearchPage();
     return e;
   } 

  limpiarCampos(): void {
    this.inputBandeja.get('almacen').setValue('');
    this.inputBandeja.get('especie').setValue('');
    this.inputBandeja.get('tipoEspecie').setValue('');
    this.inputBandeja.get('tipoIngreso').setValue('');
    this.inputBandeja.get('disponibilidadActa').setValue('');
    this.kardexResponse.pageNumber = 1;
     this.kardexResponse.pageSize = 10;
     this.Search();
  }

  exportToExcel() {
    debugger
    const dataToExport = this.listKardex;

    const headers = ['Fecha Registro','Tipo de Producto','ATF','Puesto Control','Nombre de Almacén','Nombre Científico', 'Nombre Común', 'Disponible', 'Tipo Ingreso', 'Cantidad Ingreso','Cantidad M3 Ingreso', 'Saldo Neto Ingreso','Saldo Neto M3 Ingreso',
                     'Tipo Salida', 'Cantidad Salida','Cantidad M3 Salida','Saldo Neto Salida','Saldo Neto M3 Salida'];
  
    const data = [headers, ...dataToExport.map(item => [
      this.formatDateToUTC(item.fechaRegistro),
      item.tipoProducto === 'MAD' ? 'Maderable' :
      item.tipoProducto === 'NOMAD' ? 'No Maderable' :
      item.tipoProducto === 'FA' ? 'Fauna' : item.tipoProducto,
      item.atf,
      item.puestoControl,
      item.nomAlmacen,
      item.nombreCientifico,
      item.nombreComun,
      item.disponible === 'D' ? 'Disponible' : 'No Disponible',
      item.tipoIngreso,
      item.cantidadIngreso,
      item.cantidadM3Ingreso,
      item.saldoTotalIngreso,
      item.saldoTotalM3Ingreso,
      item.tipoSAlida,
      item.cantidadSalida,
      item.cantidadM3Salida,
      item.saldoTotalSalida,
      item.saldoTotalM3Salida
    ])];
  
     const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);        
  
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Kardex');
  
     XLSX.writeFile(wb, 'kardex.xlsx');
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

