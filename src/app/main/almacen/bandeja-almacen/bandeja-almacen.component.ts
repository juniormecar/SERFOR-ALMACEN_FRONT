import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { Almacen } from 'app/shared/models/almacen.model';
import { AlmacenService } from 'app/service/almacen.service';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
import { Router } from "@angular/router";
import { ParametroService } from 'app/service/parametro.service';
import { ATF } from 'app/shared/models/atf.model';
import { AtfService } from 'app/service/atf.service';
import { PuestoControl } from 'app/shared/models/puesto-control.model';
import { PuestoControlService } from 'app/service/puesto-control.service';
import Swal from 'sweetalert2'
import { CreateAlmacenResponse } from 'app/shared/models/response/create-almacen-response';
import { DeleteAlmacenResponse } from 'app/shared/models/response/delete-almacen-response';
import { Recurso } from 'app/shared/models/recurso.model';
import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { RecursoService } from 'app/service/recurso.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionMessageComponent } from 'app/main/popups-common/action-message/action-message.component';


@Component({
  selector: 'app-bandeja-almacen',
  templateUrl: './bandeja-almacen.component.html',
  styleUrls: ['./bandeja-almacen.component.scss']
})
export class BandejaAlmacenComponent implements OnInit {
  recursoResponse: BandejaRecursoResponse = new BandejaRecursoResponse();
  cantidadTotal:number=0;
  dataSource = new MatTableDataSource<Almacen>([]);
  resultsLength = 0;
  selection = new SelectionModel<Almacen>(true, []);
  almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
  almacenRequest:  Almacen = new Almacen();
  numeroDocumento: string = '44691637';
  displayedColumns: string[] = ['position','nuIdAlmacen', 'numeroATF', 'puestoControl', 'nombreAlmacen', 'tipoAlmacen', 'cantidadResponsables','acciones']; 
  inputBandeja: FormGroup;  
  listATF: ATF[] = [];
  listPuestoControl: PuestoControl[] = [];
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private almacenService: AlmacenService,
    public _router: Router,
    private parametroService: ParametroService,
    private atfService: AtfService,
    private puestoControlService: PuestoControlService,
    private _recursoService: RecursoService,
     public dialog: MatDialog,
    ) {
      this.almacenResponse.pageNumber = 1;
      this.almacenResponse.pageSize = 10;
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

    this.inputBandeja = this._formBuilder.group({
      puestoControl: [''],
      numeroATF: [''],
      nombreAlmacen: [''],
     // tipoAlmacen: ['', Validators.required]
    });
    this.recursoResponse.pageNumber = 1;
    this.recursoResponse.pageSize = 10;
    this.numeroDocumento = localStorage.getItem('usuario');
  }
 
  ngOnInit(): void {
    this.search();
    this.searchATF();
  } 

  NewAlmacen(){   
      this._router.navigate(['registro-almacen']);       
  }

  searchATF() {
    this.atfService.getATFSearch().subscribe((response: ATF[]) => {
      this.listATF = response;
    });
  }

  searchPuestoControl() {
    this.puestoControlService.getPuestoControlSearch(this.inputBandeja.get('numeroATF').value).subscribe((response: PuestoControl[]) => {
      this.listPuestoControl= response;
    });
  }

  async search() {
    this.dataSource = new MatTableDataSource<Almacen>([])
    this.almacenRequest.txPuestoControl = this.inputBandeja.get('puestoControl').value;
    this.almacenRequest.txNumeroATF = this.inputBandeja.get('numeroATF').value;
    this.almacenRequest.txNombreAlmacen = this.inputBandeja.get('nombreAlmacen').value;
    this.almacenRequest.txTipoAlmacen = '';  
    this.almacenRequest.txNumeroDocumento = this.numeroDocumento;
    this.almacenService.getAlmacenSearch(this.almacenRequest,this.almacenResponse.pageNumber,this.almacenResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
      if(response.success){
        this.almacenResponse = response;
        this.dataSource = new MatTableDataSource<Almacen>(response.data);
        this.resultsLength=response.totalRecords;
      }
    })
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.almacenResponse.pageNumber = e.pageIndex+1;
    this.almacenResponse.pageSize = e.pageSize;
    this.search();
    return e;
  } 

  getRecursos(idAlmacen: any) {
    this._recursoService.getRecursoSearchVerProductos(null,null,null,null,null,idAlmacen,null,null,null,null,null,null,null,null,null,
      null,null,this.recursoResponse.pageNumber, this.recursoResponse.pageSize,'DESC')
      .subscribe((response: BandejaRecursoResponse) => {
       // this.dataSource = new MatTableDataSource<Recurso>(response.data)
        this.cantidadTotal=response.data.length;
        if(this.cantidadTotal>0){
          this.openMessange('Aviso', 'Este almacén cuenta con articulos asignados', 'error');
        }else{
          this.delete(idAlmacen)
        }
        //console.log("getRecursos",this.dataSource);
      })
  }

  verAlmacen(data: Almacen, id: any): void {
    //console.log("revisar")
    let url = 'actualizar-almacen/'+ id;
    this._router.navigate([url], { state: { data: data, type:'view' } });
  }

  editarAlmacen(data: Almacen, id: any): void {
    //console.log("revisar")
    let url = 'actualizar-almacen/'+ id;
    this._router.navigate([url], { state: { data: data, type:'edit' } });
  }

  eliminar(nuIdAlmacen:number) { 
    Swal.fire({
      title: '¿Desea eliminar el almacén?',
      text: "Los cambios no se van a revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#43a047',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
          if (result.isConfirmed) {
            this.getRecursos(nuIdAlmacen);
          }
    })   
  }

  delete(nuIdAlmacen:number){
    this.almacenService.deleteAlmacen(nuIdAlmacen).subscribe((response: DeleteAlmacenResponse) => {
      //console.log("response ", response)
      
      if(response.success)
      {
        this.search();
      }

    }, error => {
      //console.log("error ", error)
    })
  }

  limpiarCampos(): void {
    this.inputBandeja.get('puestoControl').setValue('');
    this.inputBandeja.get('numeroATF').setValue('');
    this.inputBandeja.get('nombreAlmacen').setValue('');
  }

  openMessange(title: string, message: string, type: 'success' | 'warning' | 'error') {
    Swal.fire({
      title: title,
      text: message,
      icon: type,
      width: 350,
      // showCancelButton: true,
     // confirmButtonColor: '#3085d6',
     confirmButtonColor: '#C73410',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'ok'
    }).then((result) => {
      if (result.isConfirmed) {
      }
    })
  }

}

