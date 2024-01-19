import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfigService } from '@fuse/services/config.service';
import { ReportesService } from 'app/service/reportes.service';
import { Reportes } from 'app/shared/models/reportes.model';
import { ReportesResponse } from 'app/shared/models/response/reportes-response';
interface DialogData {
  nroActa:string,
  nuIdTransferencia:number
}
@Component({
  selector: 'app-modal-detalle-donacion',
  templateUrl: './modal-detalle-donacion.component.html',
  styleUrls: ['./modal-detalle-donacion.component.scss']
})
export class ModalDetalleDonacionComponent implements OnInit {
  dataSource = new MatTableDataSource<Reportes>([]);
  displayedColumns: string[] = ['tipoEspecie','nombreCientifico','nombreComun','cantidad','unidadMedida','nroActa','tipoIngreso'];
  reportesResponse: ReportesResponse = new ReportesResponse();
  reportesRequest:  Reportes = new Reportes();
  resultsLength = 0;
  constructor(
    public dialogRef: MatDialogRef<ModalDetalleDonacionComponent>,
    private _fuseConfigService: FuseConfigService,
    private _reportesService: ReportesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { 
    this.reportesResponse.pageNumber = 1;
    this.reportesResponse.pageSize = 10;
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
  }

  ngOnInit(): void {
    this.SearchReportes();
  }

  async SearchReportes() {
console.log('jjj');
    this.dataSource = new MatTableDataSource<Reportes>([]);
    this.reportesRequest.tipo =  'D';
    this.reportesRequest.nroActa =  this.data.nroActa;
    this.reportesRequest.nuIdTransferencia =  this.data.nuIdTransferencia;
    this._reportesService.getReporteSalidas(this.reportesRequest,this.reportesResponse.pageNumber,this.reportesResponse.pageSize).subscribe((response:ReportesResponse)=>{
      if(response.success){
        this.reportesResponse = response;
        this.dataSource = new MatTableDataSource<Reportes>(response.data);
        this.resultsLength=response.totalRecords;
        this.reportesResponse.totalRecords = response.data.length;
      }
    })
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.reportesResponse.pageNumber = e.pageIndex + 1;
    this.reportesResponse.pageSize = e.pageSize;
    this.SearchReportes();
    return e;
  }

}
