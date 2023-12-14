import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfigService } from '@fuse/services/config.service';
import { Parametro } from 'app/shared/models/parametro.model';
import { RegistroParametroComponent } from './modal/registro-parametro/registro-parametro.component';
import { MatDialog } from '@angular/material/dialog';
import { ParametroResponse } from 'app/shared/models/response/parametro-response';
import { ParametroService } from 'app/service/parametro.service';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bandeja-parametro',
  templateUrl: './bandeja-parametro.component.html',
  styleUrls: ['./bandeja-parametro.component.scss']
})
export class BandejaParametroComponent implements OnInit {

  dataSource = new MatTableDataSource<Parametro>([]);
  parametroBandeja: FormGroup;
  displayedColumns: string[] = ['ID', 'Codigo', 'ValorPrimario', 'ValorSecundario', 'ValorTerciario', 'TipoParametro', 'Acciones'];
  parametroResponse: ParametroResponse = new ParametroResponse();
  parametroRequest: Parametro = new Parametro();
  resultsLength = 0;
  listParametro: Parametro[] = [];

  constructor(
    private _fuseConfigService: FuseConfigService,
    public _dialog: MatDialog,
    private paramametroService: ParametroService,) {
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
    this.parametroResponse.pageNumber = 1;
    this.parametroResponse.pageSize = 10;
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.dataSource = new MatTableDataSource<Parametro>([])

    this.paramametroService.getParametroSearchBandeja(this.parametroRequest, this.parametroResponse.pageNumber, this.parametroResponse.pageSize).subscribe((response: ParametroResponse) => {
      if (response.success) {
        this.parametroResponse = response;
        this.dataSource = new MatTableDataSource<Parametro>(response.data);
        this.resultsLength = response.totalRecords;
      }
    })
  }

  openModalParametro(dataParametro: Parametro, type: String, index: any) {
    const dialogRef = this._dialog.open(RegistroParametroComponent, {
      width: '1000px',
      height: '540px',
      data: { dataParametro: dataParametro, type: type }
    });    

    dialogRef.afterClosed().subscribe(result => {  
      console.log('result',result);
      if (result == 999) {
        
       this.search();
      }
    })

  }

  pageDataSource(e: PageEvent): PageEvent {
    debugger
    this.parametroResponse.pageNumber = e.pageIndex + 1;
    this.parametroResponse.pageSize = e.pageSize;
    this.search();
    return e;
  }

  eliminar(idParametro:number) { 
    Swal.fire({
      title: '¿Desea eliminar el Parametro?',
      text: "Los cambios no se van a revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#43a047',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
          if (result.isConfirmed) {
            this.paramametroService.deleteParametro(idParametro).subscribe((response: ParametroResponse) => {             
              
              if(response.success)
              {
                this.search();
              }
        
            }, error => {
              
            })
          }
    })   
  }

}
