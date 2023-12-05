import { Component, Inject, OnInit } from '@angular/core';
import { Transferencia } from 'app/shared/models/transferencia.model';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { TransferenciaService } from 'app/service/transferencia.service';
import {TransferenciaResponse } from 'app/shared/models/response/transferencia-response';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


interface DialogData {
  nuIdTransferencia: number
}

@Component({
  selector: 'app-transferencia-beneficiario-detalle',
  templateUrl: './transferencia-beneficiario-detalle.component.html',
  styleUrls: ['./transferencia-beneficiario-detalle.component.scss']
})
export class TransferenciaBeneficiarioDetalleComponent implements OnInit {
  dataSource = new MatTableDataSource<Transferencia>([]);
  selection = new SelectionModel<Transferencia>(true, []);
  transferenciaResponse: TransferenciaResponse = new TransferenciaResponse();
  transferenciaRequest:  Transferencia = new Transferencia();
  resultsLength = 0;
  displayedColumns: string[] = ['position','feFechaRegistro','almacenOrigen','cantidadProducto','metroCubico', 'producto'];
  constructor(
    private transferenciaService: TransferenciaService,
    public dialogRef: MatDialogRef<TransferenciaBeneficiarioDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
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
        this.resultsLength=response.totalRecords;
      }
    })
  }  
  close() {
    //console.log("cerrar");
    this.dialogRef.close(-1);
  }

}
