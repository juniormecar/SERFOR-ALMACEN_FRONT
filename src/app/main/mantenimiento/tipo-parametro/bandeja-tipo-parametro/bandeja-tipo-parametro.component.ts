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

  pageDataSource(e: PageEvent): PageEvent {
    debugger
    this.tipoParametroResponse.pageNumber = e.pageIndex + 1;
    this.tipoParametroResponse.pageSize = e.pageSize;
    this.search();
    return e;
  }

  openModalTipoParametro(dataPuestoControl: TipoParametro, type: String, index: any){
    const dialogRef = this._dialog.open(RegistroTipoParametroComponent, {
      width: '1000px',
      height: '420px',
      data: { dataPuestoControl: dataPuestoControl, type: type }
    });
   // dialogRef.afterClosed().subscribe(result => { })

    dialogRef.afterClosed().subscribe(result => {  
      if (result !== null && result !== -1 && result !== undefined) {
        if(result.type === 'EDIT'){
          this.listTipoParametro[index].prefijo = result.prefijo;
          this.listTipoParametro[index].nombre = result.nombre;  
          this.listTipoParametro[index].descripcion = result.descripcion; 
        } else {
          let indexNew = this.listTipoParametro.indexOf(result,0);
          if(indexNew === -1){
            this.listTipoParametro.push(result);
          }else{
            this.listTipoParametro[indexNew] = result;
          }
        };

        this.dataSource = new MatTableDataSource<TipoParametro>(this.listTipoParametro);
      }
    })
  }



}
