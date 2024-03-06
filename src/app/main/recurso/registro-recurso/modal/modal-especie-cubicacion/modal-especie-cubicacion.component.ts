import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cubicacion } from 'app/shared/models/cubicacion.model';
import { CubicacionService } from 'app/service/cubicacion.service';
import Swal from 'sweetalert2';
import { CubicacionResponse } from 'app/shared/models/response/cubicacion-response';
import { DeleteCubicacionResponse } from 'app/shared/models/response/delete-recurso-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecursoProduco } from 'app/shared/models/recurso-producto.model';
import { ParametroService } from 'app/service/parametro.service';
import { TipoParametro } from 'app/shared/models/tipo-parametro.model';
import { Parametro } from 'app/shared/models/parametro.model';

interface DialogData {
  id: number,
  cantidad: string,
  tipoProducto: string,
  nombreCientifico: string,
  nombreComun: string,
  uMedida: string
}

@Component({
  selector: 'app-modal-especie-cubicacion',
  templateUrl: './modal-especie-cubicacion.component.html',
  styleUrls: ['./modal-especie-cubicacion.component.scss']
})
export class ModalEspecieCubicacionComponent implements OnInit {
  listCubicacion: Cubicacion[] = [];
  listCubicacionRolliza: Cubicacion[] = [];
  dataSource = new MatTableDataSource<Cubicacion>(this.listCubicacion);
  dataSourceRolliza = new MatTableDataSource<Cubicacion>(this.listCubicacionRolliza);
  cubicacionResponse: CubicacionResponse = new CubicacionResponse();
  nuIdRecursoProducto: number;
  txCantidadProducto: string;
  txCantidadProductoRolliza: string;
  cantidadTotal: number=0;
  cantidadTotalRolliza: number=0;
  disabledRoll:boolean=false;
  disabledAce:boolean=false;
  totalVolumenPT: number = 0;
  totalVolumenPTconvertido: number = 0;
  totalVolumenM3: number = 0;
  displayedColumns = ['position', 'cantidad', 'espesor', 'ancho', 'largo', 'volumenPT'];
  displayedColumnsRolliza = ['position', 'cantidad','diametro','longitud', 'volumenM3'];
  tittleCubicacion:string='';
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public dialogRef: MatDialogRef<ModalEspecieCubicacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cubicacionService: CubicacionService,
    private _matSnackBar: MatSnackBar,
    private _parametroService: ParametroService
  ) {
    this.nuIdRecursoProducto = this.data.id;
    this.txCantidadProducto = this.data.cantidad;
    //console.log("this.data ", this.data);
    //console.log("this.txCantidadProducto ", this.txCantidadProducto);
    let tipoUMedidad = this.txCantidadProducto == '1' ? this.data.uMedida : this.data.uMedida + 's';
    
    this.tittleCubicacion = 'Hoja de cubicación de '+this.data.nombreCientifico + ' - '+ this.data.nombreComun + ' ' +this.txCantidadProducto+ ' ' + tipoUMedidad;
    this.cubicacionResponse.pageNumber = 1;
    this.cubicacionResponse.pageSize = 10;
  }

  ngOnInit(): void {

    console.log('DATA' , this.data);
   
    if(this.data.tipoProducto==='ACE'){
      this.disabledRoll = false;
      this.disabledAce = true;
    }else if(this.data.tipoProducto==='ROLL'){
      this.disabledRoll = true;
      this.disabledAce = false;
    }
    this.getSettingDecimal();
    this.getCubicacion(this.nuIdRecursoProducto);
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
    this.listCubicacion = this.listCubicacion.filter(item => item.nuIdRecursoProducto !== 0);
    let element: Cubicacion = new Cubicacion();
    element.idRecurProCubicacion = 0;
    //element.cantidad = 0;
    //element.espesor = 0;
    //element.ancho = 0;
   // element.largo = 0;
    element.volumenPT = 0;
    element.volumenM3 = 0;
   // element.diametroPromedio = 0;
   // element.longitud = 0;
    element.nuIdRecursoProducto = this.nuIdRecursoProducto;
    //console.log('this.nuIdRecursoProducto',this.nuIdRecursoProducto);
    //console.log('this.disabledAce',this.disabledAce);
    if(this.disabledAce){
      this.listCubicacion.push(element);
      this.dataSource = new MatTableDataSource<Cubicacion>(this.listCubicacion);
      this.calculateTotalVolumenPT();
    }else{
      this.listCubicacionRolliza.push(element);
      this.dataSourceRolliza = new MatTableDataSource<Cubicacion>(this.listCubicacionRolliza);
      this.calculateTotalVolumenM3();
    }  
  }

  calculoVPT(row: Cubicacion) {
   
    if((row.cantidad !== undefined && row.cantidad !== null) && 
       (row.espesor !== undefined && row.espesor !== null) &&
       (row.ancho !== undefined && row.ancho !== null) && 
       (row.largo !== undefined && row.largo !== null) ){
        const index = this.listCubicacion.indexOf(row, 0);
        row.volumenPT = Number(row.cantidad) * ((Number(row.espesor) * Number(row.ancho) * Number(row.largo)) / 12);
        row.volumenPT = Number(row.volumenPT.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
        this.listCubicacion[index] = row;  
        this.calculateTotalVolumenPT();  
    }
   
  }

  calculateTotalVolumenPT() {
    this.totalVolumenPT = 0;
    this.listCubicacion = this.listCubicacion.filter(item => item.nuIdRecursoProducto !== 0);
    this.listCubicacion.forEach(item => {   
        this.totalVolumenPT += Number(item.volumenPT)       
    })
    this.totalVolumenPTconvertido = this.totalVolumenPT/423.8;
 
    this.totalVolumenPT = Number(this.totalVolumenPT.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
    this.totalVolumenPTconvertido = Number(this.totalVolumenPTconvertido.toFixed(Number(this.listDecimalCantidad.valorPrimario)));

    let element: Cubicacion = new Cubicacion();    
    element.nuIdRecursoProducto = 0; 
    element.idRecurProCubicacion = 0;   
    element.volumenPT = Number(this.totalVolumenPT.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
    element.idUsuarioRegistro = 1;
    
    this.listCubicacion.push(element); 
    this.cubicacionResponse.totalRecords = this.listCubicacion.length - 1;
    this.dataSource = new MatTableDataSource<Cubicacion>(this.listCubicacion);    
  }

  calculoVm3(row: Cubicacion) {
    if((row.cantidad !== undefined && row.cantidad !== null) && 
    (row.diametroPromedio !== undefined && row.diametroPromedio !== null) &&
    (row.longitud !== undefined && row.longitud !== null)  ){
      const index = this.listCubicacion.indexOf(row, 0);
      row.volumenM3 = Number(row.cantidad) * ((Number(row.diametroPromedio) * Number(row.diametroPromedio) * 3.14 * Number(row.longitud))/4);
      row.volumenM3 = Number(row.volumenM3.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
      //console.log("row.volumenM3 ",row.volumenM3)
      this.listCubicacion[index] = row;
      this.calculateTotalVolumenM3();  
    }
  }

  calculateTotalVolumenM3() {
    this.totalVolumenM3 = 0;
    this.listCubicacionRolliza = this.listCubicacionRolliza.filter(item => item.nuIdRecursoProducto !== 0);
    this.listCubicacionRolliza.forEach(item => {    
        this.totalVolumenM3 += Number(item.volumenM3)       
    })
    console.log('el total de volumen m3',this.totalVolumenM3);
    this.totalVolumenM3 = Number(this.totalVolumenM3.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
    console.log('el total de volumen m3',this.totalVolumenM3);

    let element: Cubicacion = new Cubicacion();    
    element.nuIdRecursoProducto = 0;    
    element.idRecurProCubicacion = 0;
    element.volumenM3 = Number(this.totalVolumenM3.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
    element.idUsuarioRegistro = 1;
    this.listCubicacionRolliza.push(element);
    this.cubicacionResponse.totalRecords = this.listCubicacionRolliza.length - 1;
    this.dataSourceRolliza = new MatTableDataSource<Cubicacion>(this.listCubicacionRolliza);    
  }

  registrarCubicacion() {  

    if(this.disabledAce){

      console.log('LO QUE NECESITO', this.totalVolumenPTconvertido);

      let valido;
    this.cantidadTotal = 0;    
    //aquí filtar por   nuIdRecursoProduvto que no tengan cero
    this.listCubicacion = this.listCubicacion.filter(item => item.nuIdRecursoProducto !== 0);
    
    this.listCubicacion.forEach(item=>{
      item.totalVolumenM3 = this.totalVolumenPTconvertido;
      this.cantidadTotal += Number(item.cantidad)
      if (item.volumenPT == 0) {
        //console.log('aca hay cero')
        valido = "cero"
      }

    })  
    if (valido == "cero") {
      Swal.fire(
        'Mensaje!',
        'Debe llenar todos los campos.',
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
      this.cubicacionService.postRecurso(this.listCubicacion).subscribe((response: any) => {
        //console.log("response", response)
        //console.log("this.listCubicacion[0].cantidad", this.listCubicacion[0].cantidad)

        if (response.success) {

          /*Swal.fire(
            'Mensaje de Confirmación',
            'Productos guardados correctamente en el almacen.',
            'success'
          )*/

          this._matSnackBar.open('Cubicación guardada correctamente', 'OK', {
            //verticalPosition: 'top',  // 'top' | 'bottom'
            horizontalPosition: 'center',  // 'start' | 'center' | 'end' | 'left' | 'right'
           // panelClass: 'mail-compose-dialog',
            duration        : 2000
          });

          this.close();

        } else {
          Swal.fire(
            'Mensaje!',
            'Error inesperado al registrar los productos del almacen',
            'error'
          )
        }


      }, error => {
        //console.log("error ", error)
      })
    }
    }
  }
    else{

      this.cantidadTotalRolliza = 0;    
      this.listCubicacionRolliza = this.listCubicacionRolliza.filter(item => item.nuIdRecursoProducto !== 0);
      
      this.listCubicacionRolliza.forEach(item=>{
        item.totalVolumenM3 = this.totalVolumenM3;
        this.cantidadTotalRolliza += Number(item.cantidad)
      })
  //console.log("fff",this.cantidadTotalRolliza);
      if (Number(this.cantidadTotalRolliza) > Number(this.txCantidadProducto)) {
        Swal.fire(
          'Mensaje!',
          'La cantidad debe ser menor.',
          'error'
        )
      } else {
        this.cubicacionService.postRecurso(this.listCubicacionRolliza).subscribe((response: any) => {
          //console.log("response", response)
          //console.log("this.listCubicacion[0].cantidad", this.listCubicacionRolliza[0].cantidad)
  
          if (response.success) {
  
            /*Swal.fire(
              'Mensaje de Confirmación',
              'Productos guardados correctamente en el almacen.',
              'success'
            )*/

            this._matSnackBar.open('Cubicación guardada correctamente', 'OK', {
              //verticalPosition: 'top',  // 'top' | 'bottom'
              horizontalPosition: 'center',  // 'start' | 'center' | 'end' | 'left' | 'right'
             // panelClass: 'mail-compose-dialog',
              duration        : 2000
            });
  
            this.close();
  
          } else {
            Swal.fire(
              'Mensaje!',
              'Error inesperado al registrar los productos del almacen',
              'error'
            )
          }
  
  
        }, error => {
          //console.log("error ", error)
        })
      }
    }



  }

  getCubicacion(nuIdRecursoProducto: any) {
    //console.log("this.disabledAce ",this.disabledAce)
    if(this.disabledAce){
      this.dataSource = new MatTableDataSource<Cubicacion>([])
      this.cubicacionService.getRecursoProductoCubicacion(this.nuIdRecursoProducto,
        this.cubicacionResponse.pageNumber, this.cubicacionResponse.pageSize)
        .subscribe((response: CubicacionResponse) => {
          this.dataSource = new MatTableDataSource<Cubicacion>(response.data)
          this.listCubicacion = response.data;
         this.calculateTotalVolumenPT();
         //console.log('entré aquí')
        })
    }else{
      this.dataSourceRolliza = new MatTableDataSource<Cubicacion>([])
      this.cubicacionService.getRecursoProductoCubicacion(this.nuIdRecursoProducto,
        this.cubicacionResponse.pageNumber, this.cubicacionResponse.pageSize)
        .subscribe((response: CubicacionResponse) => {
          this.dataSourceRolliza = new MatTableDataSource<Cubicacion>(response.data)
          this.listCubicacionRolliza = response.data;         
          this.calculateTotalVolumenM3();
        })
    }
    
   
  }

  eliminar(row:Cubicacion) { 

    if(row.idRecurProCubicacion!==0){
      Swal.fire({
        title: '¿Desea eliminar la cubicación?',
        text: "Los cambios no se van a revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#43a047',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
            if (result.isConfirmed) {
              
              this.cubicacionService.deleteCubicacion(row.idRecurProCubicacion).subscribe((response: DeleteCubicacionResponse) => {
                //console.log("response ", response)
                
                if(response.success)
                {
                  this.getCubicacion(this.nuIdRecursoProducto);
                }
  
              }, error => {
                //console.log("error ", error)
              })
  
            }
      })   
    }else{

      if(this.disabledAce){
        this.listCubicacion.splice(this.listCubicacion.indexOf(row), 1);
        this.dataSource = new MatTableDataSource<Cubicacion>(this.listCubicacion)
        this.calculateTotalVolumenPT();
      }else{
        this.listCubicacionRolliza.splice(this.listCubicacionRolliza.indexOf(row), 1);
        this.dataSourceRolliza = new MatTableDataSource<Cubicacion>(this.listCubicacionRolliza)
        this.calculateTotalVolumenM3();
      }

      
    }

    
  }

}
