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


@Component({
  selector: 'app-bandeja-inventario',
  templateUrl: './bandeja-inventario.component.html',
  styleUrls: ['./bandeja-inventario.component.scss']
})
export class BandejaInventarioComponent implements OnInit {

  dataSource = new MatTableDataSource<Recurso>([]);
  selection = new SelectionModel<Recurso>(true, []);
  listAlmacen: Almacen[] = [];
  almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
  displayedColumns: string[] = ['position','Tipo','disponibilidad', 'nombreCientifico', 'nombreComun', 'txCantidadProducto','metroCubico'];
  inputBandeja: FormGroup;
  resultsLength = 0;
  idAlmacen: any;
  recursoResponse: BandejaRecursoResponse = new BandejaRecursoResponse();
  numeroDocumento: string = '44691637';
  listInventario: Recurso[] = [];
  listPuestoControl: PuestoControl[] = [];
  listATF: ATF[] = [];

  lstDecimal = new Decimal();
  cantidadPipe!: string;
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
    private _recursoService: RecursoService,
    private puestoControlService: PuestoControlService,
    private atfService: AtfService,
    private almacenService: AlmacenService,
    private parametroService: ParametroService, 
  ) {
    this.recursoResponse.pageNumber = 1;
    this.recursoResponse.pageSize = 10;
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
      nombreEspecie: [''],
      numeroATF: [''],
      puestoControl: [''],
      almacen: [''],   
      tipoIngreso: [''],
      disponibilidadActa: [''], 
      tipoEspecie: [''], 
    });

    this.lstDecimal = JSON.parse(sessionStorage.getItem('listDecimal'));
    this.cantidad = Number(this.lstDecimal.cantidad);
    this.cantidadPipe = '0.0-' + this.cantidad;
    this.redondeo = this.lstDecimal.redondeo;
    this.numeroDocumento = localStorage.getItem('usuario'); 
  }

  ngOnInit(): void {
   
   this.searchATF();
   this.searchTipoIngreso();
   this.searchDisponibilidadActa();
   this.searchTipoEspecie();
  }

  searchTipoIngreso() {
    this.parametroService.getParametroSearch(this.tipoIngreso).subscribe((response: Parametro[]) => {
      this.listTipoIngreso = response;
    });
  }
  searchDisponibilidadActa() {
    this.parametroService.getParametroSearch(this.disponibilidadActa).subscribe((response: Parametro[]) => {
      this.listDisponibilidadActa = response;
    });
  }
  searchTipoEspecie() {
    this.parametroService.getParametroSearch(this.tipoEspecie).subscribe((response: Parametro[]) => {
      this.listTipoEspecie = response;
    });
  }

  async Search() {
    this.recursoResponse.pageNumber = 1;
    this.recursoResponse.pageSize = 10;
    this.nameAlmacen = this.inputBandeja.get('almacen').value;
    this._recursoService.getRecursoSearchVerProductos(null, null, null, this.inputBandeja.get('nombreEspecie').value, null, null, this.numeroDocumento, null,null,null,
    this.inputBandeja.get('numeroATF').value,
    this.inputBandeja.get('puestoControl').value,    
    this.inputBandeja.get('almacen').value,
    this.inputBandeja.get('tipoEspecie').value,null,
    this.inputBandeja.get('tipoIngreso').value,
    this.inputBandeja.get('disponibilidadActa').value,
      this.recursoResponse.pageNumber, this.recursoResponse.pageSize,'DESC')
      .subscribe((response: BandejaRecursoResponse) => {
        if (response.success) {
          this.listInventario = response.data;
          //console.log("this.listInventario ",this.listInventario)
          this.SearchInventario();
        }
      })
  }

  async SearchInventario() {
    this.dataSource = new MatTableDataSource<Recurso>([])
        if (this.listInventario.length>0) {
          this.recursoResponse.data = this.listInventario;
          this.recursoResponse.totalRecords = this.listInventario.length;
          if(this.recursoResponse.totalRecords>=10){
            let actual = this.recursoResponse.pageNumber * this.recursoResponse.pageSize
            this.recursoResponse.data = this.listInventario.slice(
              (actual - this.recursoResponse.pageSize),
              actual
            );
          }
          this.dataSource = new MatTableDataSource<Recurso>(this.recursoResponse.data);
          this.dataSource.data.forEach((element: any) => {
            element.metroCubico  = this.cutDecimalsWithoutRounding(element.metroCubico, this.cantidad);
            element.cantidadProducto  = this.cutDecimalsWithoutRounding(element.cantidadProducto, this.cantidad) ;
          });
        }
  }
  
  async searchAlmacen() {
    this.dataSource = new MatTableDataSource<Recurso>([])
    let almacenRequest:Almacen = new Almacen;
    almacenRequest.txNombreAlmacen='';
    almacenRequest.txNumeroDocumento = this.numeroDocumento;
    almacenRequest.txPuestoControl = this.inputBandeja.get('puestoControl').value
    this.almacenService.getAlmacenSearch(almacenRequest,this.almacenResponse.pageNumber,this.almacenResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
    this.almacenResponse =response;
    this.listAlmacen=response.data;
    })
  }

  searchATF() {
    this.atfService.getATFSearch().subscribe((response: ATF[]) => {
      this.listATF = response;
    });
  }

  searchPuestoControl() {
    this.puestoControlService.getPuestoControlSearch(this.inputBandeja.get('numeroATF').value).subscribe((response: PuestoControl[]) => {
      this.listPuestoControl= response;
      this.listAlmacen = [];
    });
  }
 
  pageDataSource(e: PageEvent): PageEvent {
    this.recursoResponse.pageNumber = e.pageIndex + 1;
    this.recursoResponse.pageSize = e.pageSize;
    this.SearchInventario();
    return e;
  }

  limpiarCampos(): void {
    this.inputBandeja.get('nombreEspecie').setValue('');
    this.inputBandeja.get('numeroATF').setValue('');
    this.inputBandeja.get('puestoControl').setValue('');
    this.inputBandeja.get('almacen').setValue('');
    this.inputBandeja.get('tipoIngreso').setValue('');
    this.inputBandeja.get('disponibilidadActa').setValue('');
    this.inputBandeja.get('tipoEspecie').setValue('');
    this.recursoResponse.pageNumber = 1;
    this.recursoResponse.pageSize = 10;
  }

  verDetalleProducto(idEspecie: number, nombreCientifico: string, nombreComun: string) {
    console.log("bandeja",this.inputBandeja.get('almacen').value)
    let data = [];
    const dialogRef = this._dialog.open(DetalleComponent, {
      width: '1200px',
      height: '700px',
      data: { idEspecie: idEspecie, nombreCientifico: nombreCientifico, nombreComun: nombreComun, nombreAlmacen: this.inputBandeja.get('almacen').value}
    });
  }

  verDetalleAlmacen(idEspecie: number, nombreCientifico: string, nombreComun: string) {
    console.log("bandeja",this.inputBandeja.get('almacen').value)
    let data = [];
    const dialogRef = this._dialog.open(DetalleAlmacenComponent, {
      width: '1200px',
      height: '700px',
      data: { idEspecie: idEspecie, nombreCientifico: nombreCientifico, nombreComun: nombreComun, nombreAlmacen: this.inputBandeja.get('almacen').value }
    });
  }

  cutDecimalsWithoutRounding(numFloat: number, toFixed: number) {

    let numFloat_bf = '0';
    let numFloat_af  = '0';

    if(this.redondeo === 'Mayor'){
      //console.log("numFloat",numFloat);
      return (numFloat > 0) ? Number(numFloat).toFixed(this.cantidad): numFloat;
    } else{
      let isNegative = false;

        if ( numFloat < 0 ) {
          numFloat *= -1; // Equivale a Math.abs();     
          isNegative = true;
        }
        // Recogemos el valor ANTES del separador
        if(numFloat !== undefined ){
          numFloat_bf = numFloat.toString().split('.')[0];
        // Recogemos el valor DESPUÉS del separador
         numFloat_af = numFloat.toString().split('.')[1];
        }
         
  
        if(numFloat_af != null || numFloat_af != undefined){
          // Recortar los decimales según el valor de 'toFixed'
          if (numFloat_af.length > toFixed ) {
            numFloat_af = `.${numFloat_af.slice(0, -numFloat_af.length + toFixed)}`; 
          } else {
            numFloat_af = `.`+`${numFloat_af}`; 
          }

          return parseFloat(`${( isNegative ? '-': '' )}${numFloat_bf}${numFloat_af}`);
      } else {
        return (numFloat > 0) ? Number(numFloat).toFixed(this.cantidad): numFloat;
      }

    }

  }


  /*exportToExcel() {
    
    const dataToExport = this.dataSource.data;
  
    const headers = ['Nombre Científico','Nombre Comun','Cantidad','Metro Cubico'];
  
    const data = [headers, ...dataToExport.map(item => [
      item.nombreCientifico,
      item.nombreComun,
      item.txCantidadProducto,
      item.metroCubico,
    ])];
    
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);        
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
 
    XLSX.writeFile(wb, 'Inventario.xlsx');
  }*/

  exportToExcel() {
    const dataToExport = this.listInventario; 
    var nombreAlmacen='';
    
    if(this.inputBandeja.get('almacen').value){
      nombreAlmacen=this.inputBandeja.get('almacen').value;
      const headers = ['Almacen','Tipo de Producto','Nombre Científico', 'Nombre Comun','Disponibilidad', 'Cantidad', 'Metro Cubico'];
      const data = [headers, ...dataToExport.map(item => [
        nombreAlmacen ,
        item.tipo === 'MAD' ? 'Maderable' :
        item.tipo === 'NOMAD' ? 'No Maderable' :
        item.tipo === 'FA' ? 'Fauna' : item.tipo,
        item.nombreCientifico,
        item.nombreComun,
        item.disponibilidadActa === 'D' ? 'Disponible' : 'No Disponible',
        item.txCantidadProducto,
        item.metroCubico,
        
      ])];
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);        
    
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    
      XLSX.writeFile(wb, 'Inventario.xlsx');
    }else{
      const headers = ['Tipo de Producto','Nombre Científico', 'Nombre Comun','Disponibilidad', 'Cantidad', 'Metro Cubico'];
      const data = [headers, ...dataToExport.map(item => [
        item.tipo === 'MAD' ? 'Maderable' :
        item.tipo === 'NOMAD' ? 'No Maderable' :
        item.tipo === 'FA' ? 'Fauna' : item.tipo,
        item.nombreCientifico,
        item.nombreComun,
        item.disponibilidadActa === 'D' ? 'Disponible' : 'No Disponible',
        item.txCantidadProducto,
        item.metroCubico,
        
      ])];
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);        
    
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    
      XLSX.writeFile(wb, 'Inventario.xlsx');
    }
    
      
    
  }

}
