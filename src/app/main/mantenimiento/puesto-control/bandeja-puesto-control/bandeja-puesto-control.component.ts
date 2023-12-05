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
      height: '550px',
      data: { dataPuestoControl: dataPuestoControl, type: type }
    });    

    dialogRef.afterClosed().subscribe(result => {  
      if (result !== null && result !== -1 && result !== undefined) {
        if(result.type === 'EDIT'){
          this.listPuestoControl[index].nombrePuestoControl = result.nombrePuestoControl;
          this.listPuestoControl[index].controlObligatorio = result.controlObligatorio;          
          this.listPuestoControl[index].departamento = result.departamento;     
          this.listPuestoControl[index].provincia = result.provincia;     
          this.listPuestoControl[index].distrito = result.distrito;     
          this.listPuestoControl[index].coordenadasNorte = result.coordenadasNorte;     
          this.listPuestoControl[index].coordenadasEste = result.coordenadasEste;     

        } else {
          let indexNew = this.listPuestoControl.indexOf(result,0);
          if(indexNew === -1){
            this.listPuestoControl.push(result);
          }else{
            this.listPuestoControl[indexNew] = result;
          }
        };

        this.dataSource = new MatTableDataSource<PuestoControl>(this.listPuestoControl);
      }
    })
  }

  search() {
    this.dataSource = new MatTableDataSource<PuestoControl>([])

    this.puestoControlService.getPuestoControlSearch(this.puestoControlRequest, this.puestoControlResponse.pageNumber, this.puestoControlResponse.pageSize).subscribe((response: PuestoControlResponse) => {
      if (response.success) {
        this.puestoControlResponse = response;
        this.dataSource = new MatTableDataSource<PuestoControl>(response.data);
        this.resultsLength = response.totalRecords;
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
