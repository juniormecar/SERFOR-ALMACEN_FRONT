import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Transferencia } from 'app/shared/models/transferencia.model';
import { TransferenciaService } from 'app/service/transferencia.service';
import {TransferenciaResponse } from 'app/shared/models/response/transferencia-response';
import { Router } from "@angular/router";
import Swal from 'sweetalert2'
import { Almacen } from 'app/shared/models/almacen.model';
import { AlmacenService } from 'app/service/almacen.service';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransferenciaAlmacenDetalleComponent } from 'app/main/reporte/transferencia/transferencia-almacenes/modal/transferencia-almacen-detalle/transferencia-almacen-detalle/transferencia-almacen-detalle.component';


@Component({
  selector: 'app-transferencia-almacenes',
  templateUrl: './transferencia-almacenes.component.html',
  styleUrls: ['./transferencia-almacenes.component.scss']
})
export class TransferenciaAlmacenesComponent implements OnInit {

  
  dataSource = new MatTableDataSource<Transferencia>([]);
  selection = new SelectionModel<Transferencia>(true, []);
  transferenciaResponse: TransferenciaResponse = new TransferenciaResponse();
  transferenciaRequest:  Transferencia = new Transferencia();
  listAlmacen: Almacen[] = [];
  displayedColumns: string[] = ['position','feFechaRegistro','almacenOrigen','almacenDestino','action'];
  almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
  inputBandeja: FormGroup;  
  resultsLength = 0;
  numeroDocumento: string = '44691637';
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private transferenciaService: TransferenciaService,
    private almacenService: AlmacenService,
    public _router: Router   ,
    public _dialog: MatDialog, 
    ) {
     this.transferenciaResponse.pageNumber = 1;
     this.transferenciaResponse.pageSize = 10;
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
      almacen: ['', Validators.required],      
    });   
    this.numeroDocumento = localStorage.getItem('usuario');
  }

  ngOnInit(): void {
    this.Search();   
    this.searchAlmacen();
  }

  async Search() {
    this.dataSource = new MatTableDataSource<Transferencia>([])
    this.transferenciaService.getTransferenciaSearch(
    this.inputBandeja.get('almacen').value,  
    this.numeroDocumento,  
    'TPTRANS002',
    null,
    this.transferenciaResponse.pageNumber,this.transferenciaResponse.pageSize).subscribe((response:TransferenciaResponse)=>{
      if(response.success){        
        this.transferenciaResponse =response;
        this.dataSource = new MatTableDataSource<Transferencia>(response.data);
        this.resultsLength=response.totalRecords;
      }
    })
  }  

  async searchAlmacen() {
    this.dataSource = new MatTableDataSource<Transferencia>([])
    let almacenRequest:Almacen = new Almacen;
    almacenRequest.txNombreAlmacen='';
    almacenRequest.txNumeroDocumento = this.numeroDocumento;
    this.almacenService.getAlmacenSearch(almacenRequest,this.almacenResponse.pageNumber,this.almacenResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
     this.almacenResponse =response;
     this.listAlmacen=response.data;
    })
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.transferenciaResponse.pageNumber = e.pageIndex+1;
     this.transferenciaResponse.pageSize = e.pageSize;
     this.Search();
     return e;
   } 

  limpiarCampos(): void {
    this.inputBandeja.get('almacen').setValue('');
  }

  verDetalleTransferenciaAlmacen(nuIdTransferencia: number) {
    let data = [];
    const dialogRef = this._dialog.open(TransferenciaAlmacenDetalleComponent, {
      width: '1200px',
      height: '700px',
      data: { nuIdTransferencia: nuIdTransferencia}
    });
  }

}
