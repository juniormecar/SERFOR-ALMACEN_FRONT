import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DeleteFaunaDetalleResponse } from 'app/shared/models/response/delete-recurso-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FaunaDetalle } from 'app/shared/models/fauna-detalle.model';
import { ParametroService } from 'app/service/parametro.service';
import { TipoParametro } from 'app/shared/models/tipo-parametro.model';
import { Parametro } from 'app/shared/models/parametro.model';
import { Constants } from 'app/shared/models/util/constants';
import { FaunaDetalleResponse } from 'app/shared/models/response/fauna-detalle-response';
import { FaunaDetalleService } from 'app/service/fauna-detalle.service';

interface DialogData {
  id: number,
  cantidad: string,
  tipoProducto: string,
  nombreCientifico: string,
  nombreComun: string
}

@Component({
  selector: 'app-modal-fauna-detalle',
  templateUrl: './modal-fauna-detalle.component.html',
  styleUrls: ['./modal-fauna-detalle.component.scss']
})
export class ModalFaunaDetalleComponent implements OnInit {
  listFaunaDetalle: FaunaDetalle[] = [];
  listEdadEspecie: Parametro[] = [];
  listEstadoEspecie: Parametro[] = [];
  dataSource = new MatTableDataSource<FaunaDetalle>(this.listFaunaDetalle);
  faunaDetalleResponse: FaunaDetalleResponse = new FaunaDetalleResponse();
  nuIdRecursoProducto: number;
  nuIdFaunaDetalle:number;
  txCantidadProducto: string;
  txCantidadProductoRolliza: string;
  cantidadTotal: number=0;
  cantidadTotalRolliza: number=0;
  disabledRoll:boolean=false;
  disabledAce:boolean=false;
  totalVolumenPT: number = 0;
  totalVolumenPTconvertido: number = 0;
  totalVolumenM3: number = 0;
  displayedColumns = ['position', 'cantidad', 'edad', 'estado', 'observaciones'];
  tittleFaunaDetalle:string='';
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
  edadEspecie: string = Constants.EDAD_ESPECIE;
  estadoEspecie: string = Constants.ESTADO_ESPECIE;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public dialogRef: MatDialogRef<ModalFaunaDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private faunaDetalleService: FaunaDetalleService,
    private _matSnackBar: MatSnackBar,
    private _parametroService: ParametroService
  ) {
    this.nuIdRecursoProducto = this.data.id;
    this.txCantidadProducto = this.data.cantidad;
    //console.log("this.data ", this.data);
    //console.log("this.txCantidadProducto ", this.txCantidadProducto);
    let textUnidad = this.txCantidadProducto == '1' ? ' unidad' : ' unidades';
    this.tittleFaunaDetalle = 'Detalle de '+this.data.nombreCientifico + ' - '+ this.data.nombreComun + ' ' + '/ ' + this.txCantidadProducto+ textUnidad;
    this.faunaDetalleResponse.pageNumber = 1;
    this.faunaDetalleResponse.pageSize = 10;
  }

  ngOnInit(): void {    
    this.getSettingDecimal();
    this.getFaunaDetalle(this.nuIdRecursoProducto);

    this.searchEdadEspecie();
    this.searchEstadoEspecie();
  }

  searchEdadEspecie() {
    this._parametroService.getParametroSearch(this.edadEspecie).subscribe((response: Parametro[]) => {
      this.listEdadEspecie = response;
    });
  }

  searchEstadoEspecie() {
    this._parametroService.getParametroSearch(this.estadoEspecie).subscribe((response: Parametro[]) => {
      this.listEstadoEspecie = response;
    });
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

  close() {
    this.dialogRef.close(this.totalVolumenPTconvertido);
  }

  accept() {
    this.dialogRef.close(this.totalVolumenPTconvertido);
  }

  agregar() {
    this.listFaunaDetalle = this.listFaunaDetalle.filter(item => item.nuIdRecursoProducto !== 0);
    let element: FaunaDetalle = new FaunaDetalle();
    element.nuIdFauna = 0;
    element.txCantidadProducto = 0;
    element.edadEspecie = '';
    element.estadoEspecie = '';
    element.observaciones = '';    
    element.nuIdRecursoProducto = this.nuIdRecursoProducto;
    //console.log('this.nuIdRecursoProducto',this.nuIdRecursoProducto);
    //console.log('this.disabledAce',this.disabledAce);    
      this.listFaunaDetalle.push(element);
      this.dataSource = new MatTableDataSource<FaunaDetalle>(this.listFaunaDetalle);
      //this.calculateTotalVolumenPT();
    
  }


  registrarFaunaDetalle() {   

      let valido;
    this.cantidadTotal = 0;    
    //aquí filtar por   nuIdRecursoProduvto que no tengan cero
    this.listFaunaDetalle = this.listFaunaDetalle.filter(item => item.nuIdRecursoProducto !== 0);
    console.log('this.listFaunaDetalle',this.listFaunaDetalle);
    this.listFaunaDetalle.forEach(item=>{      
      //item.totalVolumenM3 = this.totalVolumenPTconvertido;
      this.cantidadTotal += Number(item.txCantidadProducto)
      if (item.txCantidadProducto == 0) {
        //console.log('aca hay cero')
        valido = "cero"
      }

     }) 

    if (valido == "cero") {
      Swal.fire(
        'Mensaje!',
        'Debe llenar la cantidad.',
        'error'
      )
    } 
    else {
    if (Number(this.cantidadTotal) > Number(this.txCantidadProducto)) {
      Swal.fire(
        'Mensaje!',
        'La cantidad debe ser menor.',
        'error'
      )
    } else {
      this.faunaDetalleService.postFaunaDetalle(this.listFaunaDetalle).subscribe((response: any) => {
        //console.log("response", response)
        //console.log("this.listCubicacion[0].cantidad", this.listCubicacion[0].cantidad)

        if (response.success) {

          /*Swal.fire(
            'Mensaje de Confirmación',
            'Productos guardados correctamente en el almacen.',
            'success'
          )*/

          this._matSnackBar.open('Detalle guardado correctamente', 'OK', {
            //verticalPosition: 'top',  // 'top' | 'bottom'
            horizontalPosition: 'center',  // 'start' | 'center' | 'end' | 'left' | 'right'
           // panelClass: 'mail-compose-dialog',
            duration        : 2000
          });

          this.close();

        } else {
          Swal.fire(
            'Mensaje!',
            'Error inesperado al registrar el detalle de la especie',
            'error'
          )
        }


      }, error => {
        //console.log("error ", error)
      })
    }
    }
   

  }

  getFaunaDetalle(nuIdRecursoProducto: any) {
    //console.log("this.disabledAce ",this.disabledAce)    
      this.dataSource = new MatTableDataSource<FaunaDetalle>([])
      this.faunaDetalleService.getFaunaDetalle(this.nuIdRecursoProducto,
        this.faunaDetalleResponse.pageNumber, this.faunaDetalleResponse.pageSize)
        .subscribe((response: FaunaDetalleResponse) => {
          this.dataSource = new MatTableDataSource<FaunaDetalle>(response.data)
          this.listFaunaDetalle = response.data;
        // this.calculateTotalVolumenPT();
         //console.log('entré aquí')
        })
  }

  eliminar(row:FaunaDetalle) { 

    if(row.nuIdFauna!==0){
      console.log('row.nuIdFaunaDetalle',row.nuIdFauna);
      Swal.fire({
        title: '¿Desea eliminar el detalle?',
        text: "Los cambios no se van a revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#43a047',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
            if (result.isConfirmed) {
              
              this.faunaDetalleService.deleteFaunaDetalle(row.nuIdFauna).subscribe((response: DeleteFaunaDetalleResponse) => {
                //console.log("response ", response)
                
                if(response.success)
                {
                  this.getFaunaDetalle(this.nuIdRecursoProducto);
                }
  
              }, error => {
                //console.log("error ", error)
              })
  
            }
      })   
    }else{
      
        this.listFaunaDetalle.splice(this.listFaunaDetalle.indexOf(row), 1);
        this.dataSource = new MatTableDataSource<FaunaDetalle>(this.listFaunaDetalle)
      //this.calculateTotalVolumenPT();         
    }    
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.faunaDetalleResponse.pageNumber = e.pageIndex+1;
    this.faunaDetalleResponse.pageSize = e.pageSize;
    this.getFaunaDetalle(this.nuIdFaunaDetalle);
    return e;
  } 


}

