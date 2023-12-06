import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Recurso } from 'app/shared/models/recurso.model';
import { RecursoService } from 'app/service/recurso.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParametroService } from 'app/service/parametro.service';
import { TipoParametro } from 'app/shared/models/tipo-parametro.model';
import { Parametro } from 'app/shared/models/parametro.model';
import { ParametroResponse } from 'app/shared/models/response/parametro-response';

interface DialogData {
  idEspecie: number,
  nombreCientifico:string,
  nombreComun:string ,
  nombreAlmacen: string
}

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
 tittle:string='';
  listData: Recurso[] = [];
  dataSource = new MatTableDataSource<Recurso>(this.listData);
  displayedColumns: string[] = ['position','feFechaRegistro','nuIdAlmacen','tipoIngreso', 'nroGuiaTransporteForestal', 'numeroActa', 'txCantidadProducto', 'metroCubico'];
  recursoResponse: BandejaRecursoResponse = new BandejaRecursoResponse();
  parametroResponse: ParametroResponse = new ParametroResponse();

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
    public dialogRef: MatDialogRef<DetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.recursoResponse.pageNumber=1;
    this.recursoResponse.pageSize=10;
    this.parametroResponse.pageNumber = 1;
      this.parametroResponse.pageSize = 1000;
    this.tittle=this.data.nombreCientifico +' - '+ this.data.nombreComun
    this.numeroDocumento = localStorage.getItem('usuario');
   }

  ngOnInit(): void {
    console.log("data",this.data);
    this.getRecursos();
  }

  getSettingDecimal(){
    let parametroRequest:Parametro = new Parametro;  
    parametroRequest.prefijo = this.prefijoDecimal;
    this._parametroService.getParametroSearch(parametroRequest,this.parametroResponse.pageNumber,this.parametroResponse.pageSize).subscribe((response:ParametroResponse)=>{
        this.listSettings = response.data;
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

  pageDataSource(e: PageEvent): PageEvent {
    this.recursoResponse.pageNumber = e.pageIndex;
    this.recursoResponse.pageSize = e.pageSize;
    this.getRecursos();
    return e;
  }

  getRecursos() {
    this.dataSource = new MatTableDataSource<Recurso>([])
    this._recursoService.getRecursoSearchVerProductos(null, null, null, null ,this.data.idEspecie ,null,this.numeroDocumento,'P', this.data.nombreCientifico, this.data.nombreComun,null,null,this.data.nombreAlmacen,null,null,
    null,null,this.recursoResponse.pageNumber, this.recursoResponse.pageSize,'DESC')
      .subscribe((response: BandejaRecursoResponse) => {
        this.dataSource = new MatTableDataSource<Recurso>(response.data)        
        //console.log("getRecursos", this.dataSource);  
        this.listData = response.data;   
        this.calculateTotales();   
      })
      
      
  }

  calculateTotales() {
    this.totalCantidad = 0;
    this.totalM3 = 0;
    //this.dataSource = this.dataSource.filter(item => item.nuIdRecursoProducto !== 0);
    this.listData.forEach(item => {    
      console.log('this.listData',this.listData);
        this.totalCantidad += Number(item.txCantidadProducto);    
        this.totalM3 += Number(item.metroCubico);    
    })

    console.log('this.totalCantidad',this.totalCantidad);
    console.log('this.totalM3',this.totalM3);
    this.totalCantidad = Number(this.totalCantidad.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
    this.totalM3 = Number(this.totalM3.toFixed(Number(this.listDecimalCantidad.valorPrimario)));


    let element: Recurso = new Recurso();    
    element.nuIdRecurso = 0;    
    //element.numeroActa = 'Totales';
    element.txCantidadProducto = this.totalCantidad; //Number(this.totalCantidad.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
    element.metroCubico = this.totalM3;
    element.nuIdUsuarioRegistro = 1;
    this.listData.push(element);
    this.recursoResponse.totalRecords = this.listData.length - 1;
    this.dataSource = new MatTableDataSource<Recurso>(this.listData);    
  }




  close() {
    //console.log("cerrar");
    this.dialogRef.close(-1);
  }

}
