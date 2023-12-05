import { Component, Inject, OnInit } from '@angular/core';
import { Transferencia } from 'app/shared/models/transferencia.model';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { TransferenciaService } from 'app/service/transferencia.service';
import {TransferenciaResponse } from 'app/shared/models/response/transferencia-response';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Decimal } from 'app/shared/models/settings.model';

interface DialogData {
  nuIdTransferencia: number
}

@Component({
  selector: 'app-transferencia-almacen-detalle',
  templateUrl: './transferencia-almacen-detalle.component.html',
  styleUrls: ['./transferencia-almacen-detalle.component.scss']
})
export class TransferenciaAlmacenDetalleComponent implements OnInit {
  dataSource = new MatTableDataSource<Transferencia>([]);
  selection = new SelectionModel<Transferencia>(true, []);
  transferenciaResponse: TransferenciaResponse = new TransferenciaResponse();
  transferenciaRequest:  Transferencia = new Transferencia();
  resultsLength = 0;
  displayedColumns: string[] = ['position','feFechaRegistro','almacenOrigen','cantidadProducto','metroCubico','producto'];
  lstDecimal = new Decimal();
  cantidadPipe!: string;
  cantidad!: number;
  redondeo!: string;
  constructor(
    private transferenciaService: TransferenciaService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<TransferenciaAlmacenDetalleComponent>,
  ) {
    this.transferenciaResponse.pageNumber = 1;
     this.transferenciaResponse.pageSize = 10;
   }

  ngOnInit(): void {
    this.Search();
  }
  pageDataSource(e: PageEvent): PageEvent {
    this.transferenciaResponse.pageNumber = e.pageIndex;
    this.transferenciaResponse.pageSize = e.pageSize;
    this.Search();
    return e;
  }
  async Search() {
    this.dataSource = new MatTableDataSource<Transferencia>([])
    this.transferenciaService.getTransferenciaSearch(
      null,null,
    null,
    this.data.nuIdTransferencia,
    this.transferenciaResponse.pageNumber,this.transferenciaResponse.pageSize).subscribe((response:TransferenciaResponse)=>{
      if(response.success){
        this.transferenciaResponse =response;
        this.dataSource = new MatTableDataSource<Transferencia>(response.data);
        this.dataSource.data.forEach((element: any) => {
          element.metroCubico  = this.cutDecimalsWithoutRounding(element.metroCubico, this.cantidad);
          element.cantidadProducto  = this.cutDecimalsWithoutRounding(element.cantidadProducto, this.cantidad) ;
        });
        this.resultsLength=response.totalRecords;
      }
    })
  }  
  close() {
    //console.log("cerrar");
    this.dialogRef.close(-1);
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
         numFloat_bf = numFloat.toString().split('.')[0];
        // Recogemos el valor DESPUÉS del separador
         numFloat_af = numFloat.toString().split('.')[1];
  
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

}
