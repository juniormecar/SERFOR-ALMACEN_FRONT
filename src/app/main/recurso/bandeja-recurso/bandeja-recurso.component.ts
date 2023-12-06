import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Recurso } from 'app/shared/models/recurso.model';
import { RecursoService } from 'app/service/recurso.service';
import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { Router } from "@angular/router";
import Swal from 'sweetalert2'
import { ParametroService } from 'app/service/parametro.service';
import { Parametro } from 'app/shared/models/parametro.model';
import { Constants } from 'app/shared/models/util/constants';
import { CreateRecursoResponse } from 'app/shared/models/response/create-recurso-response';
import { DeleteRecursoResponse } from 'app/shared/models/response/delete-recurso-response';
import { Almacen } from 'app/shared/models/almacen.model';
import { AlmacenService } from 'app/service/almacen.service';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
import { ParametroResponse } from 'app/shared/models/response/parametro-response';



@Component({
  selector: 'app-bandeja-recurso',
  templateUrl: './bandeja-recurso.component.html',
  styleUrls: ['./bandeja-recurso.component.scss']
})
export class BandejaRecursoComponent implements OnInit {
  listAlmacen: Almacen[] = [];
  dataSource = new MatTableDataSource<Recurso>([]);
  selection = new SelectionModel<Recurso>(true, []);
  recursoResponse: BandejaRecursoResponse = new BandejaRecursoResponse();
  recursoRequest:  Recurso = new Recurso();
  numeroDocumento: string = '44691637';
  displayedColumns: string[] = [/*'position',*/'nuIdRecurso', 'tipoIngreso' , 'txNroGuiaTransporteForestal', 'txNombreAutoridadRegional', 'tipoDocumento', 'numeroDocumento','txNombreAlmacen', 'action'];
  listTipoIngreso: Parametro[] = [];
  listDisponibilidadActa: Parametro[] = [];
  inputBandeja: FormGroup;  
  resultsLength = 0;
  almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
  parametroResponse: ParametroResponse = new ParametroResponse();

  idRecurso: string;
  dataRecurso = new Recurso();
  tipoIngreso: string = Constants.TIPO_INGRESO;
  disponibilidadActa: string = Constants.DISPONIBILIDAD_ACTA;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private recursoService: RecursoService,
    private parametroService: ParametroService,
    public _router: Router   ,
    private almacenService: AlmacenService, 
    ) {
     this.recursoResponse.pageNumber = 1;
     this.recursoResponse.pageSize = 5;
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

     this.parametroResponse.pageNumber = 1;
      this.parametroResponse.pageSize = 1000;


    this.inputBandeja = this._formBuilder.group({
      numeroDocumento: [''],
      numeroActa: [''],
      numeroGuia: [''],
      tipoIngreso: [''],
      almacen: [''],
      disponibilidadActa: [''],

    });    
    this.numeroDocumento = localStorage.getItem('usuario');

  }

  ngOnInit(): void {
    this.searchTipoIngreso(); 
    this.Search();  
    this.searchAlmacen();
    this.searchDisponibilidadActa();
  }

  // searchTipoIngreso() {
  //   this.parametroService.getParametroSearch(this.tipoIngreso).subscribe((response: Parametro[]) => {
  //     this.listTipoIngreso = response;
  //   });
  // }

  searchTipoIngreso() {
    let parametroRequest:Parametro = new Parametro;  
    parametroRequest.prefijo = this.tipoIngreso;
    this.parametroService.getParametroSearch(parametroRequest,this.parametroResponse.pageNumber,this.parametroResponse.pageSize).subscribe((response:ParametroResponse)=>{
      this.parametroResponse =response;
      this.listTipoIngreso=response.data;
    })
  }


  // searchDisponibilidadActa() {
  //   this.parametroService.getParametroSearch(this.disponibilidadActa).subscribe((response: Parametro[]) => {
  //     this.listDisponibilidadActa = response;
  //   });
  // }

  searchDisponibilidadActa() {
    let parametroRequest:Parametro = new Parametro;  
    parametroRequest.prefijo = this.disponibilidadActa;
    this.parametroService.getParametroSearch(parametroRequest,this.parametroResponse.pageNumber,this.parametroResponse.pageSize).subscribe((response:ParametroResponse)=>{
      this.parametroResponse =response;
      this.listDisponibilidadActa=response.data;
    })
  }


  async searchAlmacen() {
    this.dataSource = new MatTableDataSource<Recurso>([])
    let almacenRequest:Almacen = new Almacen;
    almacenRequest.txNombreAlmacen='';
    almacenRequest.txNumeroDocumento = this.numeroDocumento;
    this.almacenService.getAlmacenSearch(almacenRequest,this.almacenResponse.pageNumber,this.almacenResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
    this.almacenResponse =response;
    this.listAlmacen=response.data;
    })
  }
  NewRecurso(){   
    this._router.navigate(['registro-recurso']);       
  }
  
  async Search() {
    this.dataSource = new MatTableDataSource<Recurso>([])
    this.recursoService.getRecursoSearch(
    this.inputBandeja.get('numeroDocumento').value,
    this.inputBandeja.get('numeroActa').value,
    this.inputBandeja.get('numeroGuia').value,
    this.inputBandeja.get('tipoIngreso').value,
    this.inputBandeja.get('almacen').value,
    null,
    this.numeroDocumento,
    this.recursoResponse.pageNumber,this.recursoResponse.pageSize).subscribe((response:BandejaRecursoResponse)=>{
      if(response.success){
        this.recursoResponse =response;
        this.dataSource = new MatTableDataSource<Recurso>(response.data);
        this.resultsLength=response.totalRecords;
      }
    })
  }
  
  pageDataSource(e: PageEvent): PageEvent {
   this.recursoResponse.pageNumber = e.pageIndex+1;
    this.recursoResponse.pageSize = e.pageSize;
    this.Search();
    return e;
  }

  verRecurso(data: Recurso, id: number): void {
    //console.log("revisar")
    let url = 'registro-recurso/'+ id;
    this._router.navigate([url], { state: { data: data } });
  }

  eliminar(nuIdRecurso:number) { 
    Swal.fire({
      title: '¿Desea eliminar el ingreso?',
      text: "Los cambios no se van a revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#43a047',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
          if (result.isConfirmed) {
            
            this.recursoService.deleteRecurso(nuIdRecurso).subscribe((response: DeleteRecursoResponse) => {
              //console.log("response ", response)
              
              if(response.success)
              {
                this.Search();
              }

            }, error => {
              //console.log("error ", error)
            })

          }
    })   
  }

  limpiarCampos(): void {
    this.inputBandeja.get('numeroDocumento').setValue('');
    this.inputBandeja.get('numeroActa').setValue('');
    this.inputBandeja.get('numeroGuia').setValue('');
    this.inputBandeja.get('tipoIngreso').setValue('');
    this.inputBandeja.get('almacen').setValue('');      
  }

}
