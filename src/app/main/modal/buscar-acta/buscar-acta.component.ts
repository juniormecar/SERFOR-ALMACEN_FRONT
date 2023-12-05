import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BandejaRecursoProductoResponse, BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Recurso } from 'app/shared/models/recurso.model';
import { RecursoProduco } from 'app/shared/models/recurso-producto.model';
import { RecursoService } from 'app/service/recurso.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParametroService } from 'app/service/parametro.service';
import { TipoParametro } from 'app/shared/models/tipo-parametro.model';
import { Parametro } from 'app/shared/models/parametro.model';
import { CreateRecursoProductoResponse } from 'app/shared/models/response/recurso-especie-response';
import Swal from 'sweetalert2';
import { Constants } from 'app/shared/models/util/constants';
interface DialogData {
  numeroActa: string
}

@Component({
  selector: 'app-buscar-acta',
  templateUrl: './buscar-acta.component.html',
  styleUrls: ['./buscar-acta.component.scss']
})
export class BuscarActaComponent implements OnInit {
 tittle:string='';
  listData: RecursoProduco[] = [];
  listDataMad: RecursoProduco[] = [];
  listDataNoMad: RecursoProduco[] = [];
  listDataFa: RecursoProduco[] = [];
  dataSource = new MatTableDataSource<RecursoProduco>(this.listDataMad);
  dataSourceFauna = new MatTableDataSource<RecursoProduco>([]);
  dataSourceNoMad = new MatTableDataSource<RecursoProduco>([]);
  dataSourceMad = new MatTableDataSource<RecursoProduco>([]);
  displayedColumns: string[] = ['nombreCientifico', 'nombreComun', 'tipoProducto','subProducto','txCantidadProducto','unidadMedida', 'metroCubico','flagAgregar'];
  displayedColumnsNOMad: string[] = ['nombreCientifico', 'nombreComun','tipoAlmacenamiento','capacidadUnidad', 'txCantidadProducto','unidadMedida','flagAgregar'];
  displayedColumnsFauna: string[] = ['nombreCientifico', 'nombreComun','txCantidadProducto','flagAgregar'];  
  recursoResponse: BandejaRecursoResponse = new BandejaRecursoResponse();
  recursoResponseFauna: BandejaRecursoResponse = new BandejaRecursoResponse();
  recursoResponseNoMad: BandejaRecursoResponse = new BandejaRecursoResponse();
  recursoResponseMad: BandejaRecursoResponse = new BandejaRecursoResponse();
  idAlmacen: any;
  numeroDocumento: string = '44691637';
  totalCantidad: number = 0;
  totalM3: number = 0;
  parametro: Parametro[] = [];
  prefijoDecimal: string = 'TCONFDEC';
  descDecimal: string = 'Configuración de decimales';
  idTipoParametroDecimal!: Number;
  listSettings: Parametro[] = [];
  listDecimalCantidad = new Parametro();
  listDecimalRedondeo = new Parametro();
  listDecimal = {
      cantidad: null,
      redondeo: null
  }


  constructor(
    private _recursoService: RecursoService,
    private _parametroService: ParametroService,
    public dialogRef: MatDialogRef<BuscarActaComponent>,
    private recursoService: RecursoService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.recursoResponse.pageNumber=1;
    this.recursoResponse.pageSize=10;
    this.recursoResponseFauna.pageNumber = 1;
    this.recursoResponseFauna.pageSize = 10;
    this.recursoResponseNoMad.pageNumber = 1;
    this.recursoResponseNoMad.pageSize = 10;
    this.recursoResponseMad.pageNumber = 1;
    this.recursoResponseMad.pageSize = 10;
    this.tittle= 'Productos de Acta N° ' +  this.data.numeroActa ;
   }

  ngOnInit(): void {
    console.log("data",this.data);
    this.getProductos();
  }

  getSettingDecimal(){
    this._parametroService.getParametroSearch(this.prefijoDecimal).subscribe((response: Parametro[]) => {
        this.listSettings = response;
        if(this.listSettings != null && this.listSettings != undefined && this.listSettings.length > 0){
            this.listDecimalCantidad = this.listSettings.filter( (e: Parametro) => e.codigo == 'TCONFDEC1')[0];
            this.listDecimalRedondeo = this.listSettings.filter( (e: Parametro) => e.codigo == 'TCONFDEC2')[0];
            this.idTipoParametroDecimal = this.listDecimalCantidad.idTipoParametro == null ? 
            this.listDecimalRedondeo.idTipoParametro: this.listDecimalCantidad.idTipoParametro;
            console.log("this.listDecimalCantidad-getSetting",this.listDecimalCantidad);
            console.log("this.listDecimalRedondeo-getSetting",this.listDecimalRedondeo);
            
            this.saveStorage(this.listDecimalCantidad.valorPrimario, this.listDecimalRedondeo.valorPrimario);
        }
    });
}

saveStorage(cantidad: any, redondeo: any){
  this.listDecimal.cantidad = cantidad == null ? 4: cantidad;
  this.listDecimal.redondeo = redondeo == null ? 4: redondeo;
  sessionStorage.setItem("listDecimal", JSON.stringify(this.listDecimal));
}

  pageDataSource(e: PageEvent,type: string): PageEvent {
    this.recursoResponse.pageNumber = e.pageIndex;
    this.recursoResponse.pageSize = e.pageSize;
    this.getProductos();
    return e;
  }

  getProductos() {

      this.getProductosMad();
      this.getProductosNOMad();
      this.getProductosFauna();
    
  }

  getProductosMad() {
    this.dataSourceMad = new MatTableDataSource<RecursoProduco>([])
    this._recursoService.getBuscarActaProductos(this.data.numeroActa,Constants.MADERABLE,this.recursoResponseMad.pageNumber, this.recursoResponseMad.pageSize,'DESC')
      .subscribe((response: BandejaRecursoProductoResponse) => {
        this.recursoResponseMad.totalRecords = response.totalRecords;
        response.data.forEach(item=>{
          if(item.disponibilidadActa === Constants.NO_DISPONIBLE){
            item.disponibilidad = false;
          }else{
            item.disponibilidad = true;
          }
        })
        console.log("MAD ",response.data)
        this.dataSourceMad = new MatTableDataSource<RecursoProduco>(response.data)   
        this.listDataMad = response.data;  
        
      })  
  }

  getProductosNOMad() {
    this.dataSourceNoMad = new MatTableDataSource<RecursoProduco>([])
    this._recursoService.getBuscarActaProductos(this.data.numeroActa,Constants.NOMADERABLE,this.recursoResponseMad.pageNumber, this.recursoResponseMad.pageSize,'DESC')
      .subscribe((response: BandejaRecursoProductoResponse) => {

        this.recursoResponseNoMad.totalRecords = response.totalRecords;
        response.data.forEach(item=>{
          if(item.disponibilidadActa === Constants.NO_DISPONIBLE){
            item.disponibilidad = false;
          }else{
            item.disponibilidad = true;
          }
        })
        console.log("NOMAD ",response.data)
        this.dataSourceNoMad = new MatTableDataSource<RecursoProduco>(response.data)        
        
        this.listDataNoMad = response.data;  
      })  
  }

  getProductosFauna() {
    this.dataSourceFauna = new MatTableDataSource<RecursoProduco>([])
    this._recursoService.getBuscarActaProductos(this.data.numeroActa,Constants.FAUNA,this.recursoResponseMad.pageNumber, this.recursoResponseMad.pageSize,'DESC')
      .subscribe((response: BandejaRecursoProductoResponse) => {
        this.recursoResponseFauna.totalRecords = response.totalRecords;
        response.data.forEach(item=>{
          if(item.disponibilidadActa === Constants.NO_DISPONIBLE){
            item.disponibilidad = false;
          }else{
            item.disponibilidad = true;
          }
        })
        console.log("FA ",response.data)
        this.dataSourceFauna = new MatTableDataSource<RecursoProduco>(response.data)     
        this.listDataFa = response.data;  
      })  
  }

  prueba(dato){
    console.log("dato ",dato)
  }

  close() {
    this.dialogRef.close(-1);
  }

  actualizarDisponibilidad() {
    debugger
    
    this.dataSourceMad.filteredData.forEach(item=>{
      if(item.disponibilidad){
        item.disponibilidadActa = Constants.DISPONIBLE;
      }else{
        item.disponibilidadActa = Constants.NO_DISPONIBLE;
      }
      item.type= item.tipo;
      this.listData.push(item);
    })

    this.dataSourceNoMad.filteredData.forEach(item=>{
      if(item.disponibilidad){
        item.disponibilidadActa = Constants.DISPONIBLE;
      }else{
        item.disponibilidadActa = Constants.NO_DISPONIBLE;
      }
      item.type= item.tipo;
      this.listData.push(item);
    })

    this.dataSourceFauna.filteredData.forEach(item=>{
      if(item.disponibilidad){
        item.disponibilidadActa = Constants.DISPONIBLE;
      }else{
        item.disponibilidadActa = Constants.NO_DISPONIBLE;
      }
      item.type= item.tipo;
      this.listData.push(item);
    })

    this.recursoService.updateDisponibilidad(this.listData).subscribe((response: CreateRecursoProductoResponse) => {
      if (response.success) {

        Swal.fire({
          title: 'Mensaje de Confirmación',
          text: 'Se actualizo correctamente la disponibilidad.',
          icon: 'success',
          width: 350,
          // showCancelButton: true,
         // confirmButtonColor: '#3085d6',
         confirmButtonColor: '#C73410',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'ok'
        }).then((result) => {
          if (result.isConfirmed) {
          }
        })
        this.close();

      } else {
        Swal.fire({
          title: 'Mensaje!',
          text: 'Error inesperado al registrar los productos del almacen',
          icon: 'error',
          width: 350,
          // showCancelButton: true,
         // confirmButtonColor: '#3085d6',
         confirmButtonColor: '#C73410',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'ok'
        }).then((result) => {
          if (result.isConfirmed) {
          }
        })
      }
    }, error => {
    })

  }

}
