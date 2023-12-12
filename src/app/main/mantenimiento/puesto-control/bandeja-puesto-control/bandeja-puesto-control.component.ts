import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfigService } from '@fuse/services/config.service';
import { PuestoControlService } from 'app/service/puesto-control.service';
import { PuestoControl } from 'app/shared/models/puesto-control.model';
import { PuestoControlResponse } from 'app/shared/models/response/puestocontrol-response';
import { RegistroPuestoControlComponent } from './modal/registro-puesto-control/registro-puesto-control.component';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-bandeja-puesto-control',
  templateUrl: './bandeja-puesto-control.component.html',
  styleUrls: ['./bandeja-puesto-control.component.scss']
})
export class BandejaPuestoControlComponent implements OnInit {

  dataSource = new MatTableDataSource<PuestoControl>([]);
  puestoControlBandeja: FormGroup;
  displayedColumns: string[] = ['ID', 'ATF', 'PuestoControl', 'ControlObligatorio', 'Acciones'];
  puestoControlResponse: PuestoControlResponse = new PuestoControlResponse();
  puestoControlRequest: PuestoControl = new PuestoControl();
  resultsLength = 0;
  listPuestoControl: PuestoControl[] = [];


  constructor(
    private puestoControlService: PuestoControlService,
    public _dialog: MatDialog,
    private _fuseConfigService: FuseConfigService,
  ) {
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
    this.puestoControlResponse.pageNumber = 1;
    this.puestoControlResponse.pageSize = 10;
  }

  ngOnInit(): void {
    this.search();
  }

  openModalPuestoControl(dataPuestoControl: PuestoControl, type: String, index: any) {
    const dialogRef = this._dialog.open(RegistroPuestoControlComponent, {
      width: '1000px',
      height: '690px',
      data: { dataPuestoControl: dataPuestoControl, type: type }
    });    

    dialogRef.afterClosed().subscribe(result => {  
      console.log('result',result);
      if (result == 999) {
        
       this.search();
      }
    })

  }

  search() {
    this.dataSource = new MatTableDataSource<PuestoControl>([])

    this.puestoControlService.getPuestoControlSearchBandeja(this.puestoControlRequest, this.puestoControlResponse.pageNumber, this.puestoControlResponse.pageSize).subscribe((response: PuestoControlResponse) => {
      if (response.success) {
        this.puestoControlResponse = response;
        this.dataSource = new MatTableDataSource<PuestoControl>(response.data);
        this.resultsLength = response.totalRecords;
      }
    })
  }

  eliminar(idPuestoControl:number) { 
    Swal.fire({
      title: '¿Desea eliminar el Puesto de Control?',
      text: "Los cambios no se van a revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#43a047',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
          if (result.isConfirmed) {
            this.puestoControlService.deletePuestoControl(idPuestoControl).subscribe((response: PuestoControlResponse) => {             
              
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
    this.puestoControlResponse.pageNumber = e.pageIndex + 1;
    this.puestoControlResponse.pageSize = e.pageSize;
    this.search();
    return e;
  }

}
