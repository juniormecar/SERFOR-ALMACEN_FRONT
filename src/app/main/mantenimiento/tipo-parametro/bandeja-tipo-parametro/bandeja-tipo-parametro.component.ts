import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfigService } from '@fuse/services/config.service';
import { TipoParametroService } from 'app/service/tipo-parametro.service';
import { TipoParametroResponse } from 'app/shared/models/response/tipo-parametro-reponse';
import { TipoParametro } from 'app/shared/models/tipo-parametro.model';
import { RegistroTipoParametroComponent } from './modal/registro-tipo-parametro/registro-tipo-parametro.component';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-bandeja-tipo-parametro',
  templateUrl: './bandeja-tipo-parametro.component.html',
  styleUrls: ['./bandeja-tipo-parametro.component.scss']
})
export class BandejaTipoParametroComponent implements OnInit {

  dataSource = new MatTableDataSource<TipoParametro>([]);
  tipoParametroBandeja: FormGroup;
  displayedColumns: string[] = ['ID', 'prefijo', 'nombre', 'descripcion', 'Acciones'];
  tipoParametroRequest: TipoParametro = new TipoParametro();
  tipoParametroResponse: TipoParametroResponse = new TipoParametroResponse();
  resultsLength = 0;
  listTipoParametro: TipoParametro[] = [];

  constructor( private _fuseConfigService: FuseConfigService,
               private tipoParametroService: TipoParametroService,
               public _dialog: MatDialog,) {
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
    this.tipoParametroResponse.pageNumber = 1;
    this.tipoParametroResponse.pageSize = 10;
   }

  ngOnInit(): void {
    this.search();
  }
  
  search() {
    this.dataSource = new MatTableDataSource<TipoParametro>([])

    this.tipoParametroService.getATFSearch(this.tipoParametroRequest, this.tipoParametroResponse.pageNumber, this.tipoParametroResponse.pageSize).subscribe((response: TipoParametroResponse) => {
      if (response.success) {
        this.tipoParametroResponse = response;
        this.dataSource = new MatTableDataSource<TipoParametro>(response.data);
        this.resultsLength = response.totalRecords;
      }
    })
  }
  openModalTipoParametro(dataPuestoControl: TipoParametro, type: String, index: any){
    const dialogRef = this._dialog.open(RegistroTipoParametroComponent, {
      width: '1000px',
      height: '470px',
      data: { dataPuestoControl: dataPuestoControl, type: type }
    });
   // dialogRef.afterClosed().subscribe(result => { })

   dialogRef.afterClosed().subscribe(result => {  
    console.log('result',result);
    if (result == 999) {
      
     // this.dataSource = new MatTableDataSource<ATF>(this.listATF);
     this.search();
    }
  })

  }

  eliminar(idTipoParametro:number) { 
    Swal.fire({
      title: '¿Desea eliminar el Tipo Parámetro?',
      text: "Los cambios no se van a revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#43a047',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
          if (result.isConfirmed) {
            this.tipoParametroService.deleteTipoParametro(idTipoParametro).subscribe((response: TipoParametroResponse) => {             
              
              if(response.success)
              {
                this.search();
              }
        
            }, error => {
              
            })
          }
    })   
  }

  pageDataSource(e: PageEvent): PageEvent {
    debugger
    this.tipoParametroResponse.pageNumber = e.pageIndex + 1;
    this.tipoParametroResponse.pageSize = e.pageSize;
    this.search();
    return e;
  }

  

}
