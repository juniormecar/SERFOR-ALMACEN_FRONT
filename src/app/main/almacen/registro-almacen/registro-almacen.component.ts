import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject } from 'rxjs';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RegistroListSteps, RegistroStep } from './registroAlmacenConstant';
import { Almacen } from 'app/shared/models/almacen.model';
import { AlmacenResponsable } from 'app/shared/models/almacen-responsable.model';
import { AlmacenService } from 'app/service/almacen.service';
import { AlmacenResponsableResponse } from 'app/shared/models/response/almacen-responsable-response';
import {SelectionModel} from '@angular/cdk/collections';
import { Router } from "@angular/router";
import { CreateAlmacenResponse } from 'app/shared/models/response/create-almacen-response';
import Swal from 'sweetalert2';
import { ATF } from 'app/shared/models/atf.model';
import { PuestoControl } from 'app/shared/models/puesto-control.model';
import { PuestoControlService } from 'app/service/puesto-control.service';
import { AtfService } from 'app/service/atf.service';
import { Parametro } from 'app/shared/models/parametro.model';
import { ParametroService } from 'app/service/parametro.service';
import { Constants } from 'app/shared/models/util/constants';
import { PideService } from 'app/service/pide.service';
import { MatDialog} from '@angular/material/dialog';
import { ModalAlmacenEncargadosComponent } from 'app/main/almacen/registro-almacen/modal/modal-almacen-encargados/modal-almacen-encargados/modal-almacen-encargados.component';
import { DeleteAlmacenResponsableResponse } from 'app/shared/models/response/delete-almacen-responsable-response';
import { AtfResponse } from 'app/shared/models/response/atf-response';
import { PuestoControlResponse } from 'app/shared/models/response/puestocontrol-response';
import { ParametroResponse } from 'app/shared/models/response/parametro-response';



@Component({
  selector: 'app-registro-almacen',
  templateUrl: './registro-almacen.component.html',
  styleUrls: ['./registro-almacen.component.scss']
})
export class RegistroAlmacenComponent implements OnInit {
  dataSource = new MatTableDataSource<AlmacenResponsable>([]);
  selection = new SelectionModel<Almacen>(true, []);
  almacenResponsableResponse: AlmacenResponsableResponse = new AlmacenResponsableResponse();
  parametroResponse: ParametroResponse = new ParametroResponse();

  almacenRequest:  Almacen = new Almacen();
  inputRegistro: FormGroup;
  course: RegistroStep[] = RegistroListSteps;
  listAlmacenResponsable: AlmacenResponsable[] = [];
  animationDirection: 'left' | 'right' | 'none';
  displayedColumns = ['position', 'tipoDocumento', 'numeroDocumento', 'nombresResponsable','acciones'];
  courseStepContent: any;
  currentStep: number;
  titleStep: string = '';
  resultsLength = 0;
  step = 0;
  listATF: ATF[] = [];
  listPuestoControl: PuestoControl[] = [];
  listTipoAlmacen: Parametro[] = [];
  listTipoDocumento: Parametro[] = [];
  tipoAlmacen: string = Constants.TIPO_ALMACEN;
  validaDNIClass: boolean = false;
  photo:string;
  tipoDocumento: string = Constants.TIPO_DOCUMENTO;
  setStep(index: number) {
    this.step = index;
  }
  atfResponse: AtfResponse = new AtfResponse();
  puestoControlRequest:PuestoControl = new PuestoControl; 
  puestoControlResponse: PuestoControlResponse = new PuestoControlResponse();
  constructor(private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private almacenService: AlmacenService,
    public _router: Router,
    private atfService: AtfService,
    private puestoControlService: PuestoControlService,
    private parametroService: ParametroService,
    public _dialog: MatDialog,
    private pideService: PideService) {
      this.almacenResponsableResponse.pageNumber = 1;
      this.almacenResponsableResponse.pageSize = 10;
      this.atfResponse.pageNumber = 1;
      this.atfResponse.pageSize = 100;
      this.puestoControlResponse.pageNumber = 1;
      this.puestoControlResponse.pageSize = 100;
      this.parametroResponse.pageNumber = 1;
      this.parametroResponse.pageSize = 1000;
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

    // // Set the private defaults
    // this._unsubscribeAll = new Subject();

    this.inputRegistro = this._formBuilder.group({
      puestoControl: ['', Validators.required],
      numeroATF: ['', Validators.required],
      txNombreAlmacen: ['', Validators.required],
      txTipoAlmacen: ['', Validators.required],
      txTipoDocumento: ['', Validators.required],
      txNumeroDocumento: ['', Validators.required],
      txNombreEncargado: ['', Validators.required],
      nuCapacidadAlmacen: ['', Validators.required],
      direccionAlmacen: ['', Validators.required]
    });

    this.currentStep = 0;
    this.titleStep = this.course[0].title
  }

  ngOnInit(): void {
    this.setStep(5);
    this.searchATF();
    this.searchTipoAlmacen();
    this.searchTipoDocumento();
    //this.searchAlmacenResponsable();
  }

  // searchATF() {
  //   this.atfService.getATFSearch().subscribe((response: ATF[]) => {
  //     this.listATF = response;
  //   });
  // }

  searchATF() {
    let atfRequest:ATF = new ATF;  
    this.atfService.getATFSearch(atfRequest,this.atfResponse.pageNumber,this.atfResponse.pageSize).subscribe((response:AtfResponse)=>{
      this.atfResponse =response;
      this.listATF=response.data;
    })
  }

  // searchPuestoControl() {
  //   this.puestoControlService.getPuestoControlSearch(this.inputRegistro.get('numeroATF').value).subscribe((response: PuestoControl[]) => {
  //     this.listPuestoControl= response;
  //   });
  // }

  searchPuestoControl() {
    this.puestoControlRequest.idAtf = this.inputRegistro.get('numeroATF').value;    
    this.puestoControlService.getPuestoControlSearch(this.puestoControlRequest,this.puestoControlResponse.pageNumber,this.puestoControlResponse.pageSize).subscribe((response: PuestoControlResponse) => {
      this.puestoControlResponse = response;
      this.listPuestoControl= response.data;
    });
  }

  
  searchTipoAlmacen() {
    let parametroRequest:Parametro = new Parametro;  
    parametroRequest.prefijo = this.tipoAlmacen;
    this.parametroService.getParametroSearch(parametroRequest,this.parametroResponse.pageNumber,this.parametroResponse.pageSize).subscribe((response:ParametroResponse)=>{
      this.parametroResponse =response;
      this.listTipoAlmacen=response.data;
    })
  }
  searchTipoDocumento() {
    let parametroRequest:Parametro = new Parametro;  
    parametroRequest.prefijo = this.tipoDocumento;
    this.parametroService.getParametroSearch(parametroRequest,this.parametroResponse.pageNumber,this.parametroResponse.pageSize).subscribe((response:ParametroResponse)=>{
      this.parametroResponse =response;
      this.listTipoDocumento=response.data;
    })
  }



  registerAlmacen() {
    let obj: Almacen = new Almacen();
    
    obj.txNombreAlmacen = this.inputRegistro.get('txNombreAlmacen').value
    obj.txTipoAlmacen = this.inputRegistro.get('txTipoAlmacen').value
    obj.txTipoDocumento = this.inputRegistro.get('txTipoDocumento').value
    obj.txNumeroDocumento = this.inputRegistro.get('txNumeroDocumento').value
    obj.txNombresEncargado = this.inputRegistro.get('txNombreEncargado').value
    obj.nuCapacidadAlmacen = this.inputRegistro.get('nuCapacidadAlmacen').value
    obj.txNumeroATF = this.inputRegistro.get('numeroATF').value
    obj.txPuestoControl = this.inputRegistro.get('puestoControl').value
    obj.foto = this.photo;
    obj.direccionAlmacen = this.inputRegistro.get('direccionAlmacen').value
    obj.lstAlmacenResponsable = this.listAlmacenResponsable;

    this.almacenService.postAlmacen(obj).subscribe((response: CreateAlmacenResponse) => {
      
      if (response.success) {

        Swal.fire({
          title: 'Mensaje de Confirmación',
          text: 'Almacén guardado correctamente.',
          icon: 'success',
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

        this._router.navigate(['bandeja-almacen']);

      } else {
        Swal.fire({
          title: 'Mensaje!',
          text: 'Error inesperado al registrar el almacén.',
          icon: 'error',
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
    }, error => {
      //console.log("error ",error)      
    })
 

  }
  cancelar(){   
    this._router.navigate(['bandeja-almacen']);       
  }

  validarDNI() {
    //console.log('validarDNI');
    let params = { "numDNIConsulta": this.inputRegistro.get("txNumeroDocumento").value }
    //console.log("params ", params)
    this.pideService.consultarDNI(params).subscribe((result: any) => {
      //console.log("result ", result)
      // 
      if (result.dataService && result.dataService) {
        this.validaDNIClass = true;
        if (result.dataService.datosPersona) {
          let persona = result.dataService.datosPersona;
          let nombres,paterno,materno;
          nombres = persona.prenombres!=null?persona.prenombres:'';
          paterno = persona.apPrimer!=null?persona.apPrimer:'';
          materno = persona.apSegundo!=null?persona.apSegundo:'';
          //console.log("nombre ", result)
          this.inputRegistro.get("txNombreEncargado").patchValue(nombres+' '+paterno+' '+materno);
          this.photo = persona.foto;
          Swal.fire({
            title: 'Mensaje de Confirmación',
            text: 'Se validó el DNI en RENIEC.',
            icon: 'success',
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
        } else {

          Swal.fire({
            title: 'Mensaje de Confirmación',
            text: result.dataService.deResultado,
            icon: 'warning',
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
      } else {
        Swal.fire({
          title: 'Mensaje de error',
          text: 'Hay errores con el servicio de validación de DNI. Contactar con el administrador del sistema.',
          icon: 'error',
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
    }, () => {

      // this.toast.error('Hay errores con el servicio de validación de DNI. Contactar con el administrador del sistema.');
    }
    )
  }

  async searchAlmacenResponsable() {
    this.dataSource = new MatTableDataSource<AlmacenResponsable>([])
    this.almacenRequest.nuIdAlmacen = null;   
    this.almacenService.getAlmacenResponsableSearch(this.almacenRequest,this.almacenResponsableResponse.pageNumber,this.almacenResponsableResponse.pageSize).subscribe((response:AlmacenResponsableResponse)=>{
      if(response.success){
        this.almacenResponsableResponse = response;
        this.dataSource = new MatTableDataSource<AlmacenResponsable>(response.data);
        this.resultsLength=response.totalRecords;
      }
    })
  }
  pageDataSource(e: PageEvent): PageEvent {
    this.almacenResponsableResponse.pageNumber = e.pageIndex+1;
    this.almacenResponsableResponse.pageSize = e.pageSize;
    this.searchAlmacenResponsable();
    return e;
  } 

  openModalAlmacenResponsable(dataEncargado:AlmacenResponsable, type:String, index: any){
    const dialogRef = this._dialog.open(ModalAlmacenEncargadosComponent, {
      width: '1000px',
      height: '500px',
      data: { dataEncargado:dataEncargado, type: type }
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result !== null && result !== -1 && result !== undefined) {
        if(result.type === 'EDIT'){
          this.listAlmacenResponsable[index].tipoDocumento = result.tipoDocumento;
          this.listAlmacenResponsable[index].numeroDocumento = result.numeroDocumento;
          this.listAlmacenResponsable[index].nombresResponsable = result.nombresResponsable;

        } else {
          let indexNew = this.listAlmacenResponsable.indexOf(result,0);
          if(indexNew === -1){
           this.listAlmacenResponsable.push(result);
          }else{
           this.listAlmacenResponsable[indexNew] = result;
          }
        };

        this.dataSource = new MatTableDataSource<AlmacenResponsable>(this.listAlmacenResponsable);
      }
    })
  }

  eliminar(almacenResponsable:AlmacenResponsable) { 
    //console.log("listAlmacenResponsable",this.listAlmacenResponsable);
    let index = this.listAlmacenResponsable.indexOf(almacenResponsable,0);
    //console.log("index",index);
    //console.log("almacenResponsable",almacenResponsable);
    
    if(almacenResponsable.idAlmacenResponsable !== 0)
    {
      Swal.fire({
        title: '¿Desea eliminar al responsable?',
        text: "Los cambios no se van a revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#43a047',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
            if (result.isConfirmed) {

              this.almacenService.deleteAlmacenResponsable(almacenResponsable.idAlmacenResponsable).subscribe((response: DeleteAlmacenResponsableResponse) => {
                //console.log("response ", response)
                
                if(response.success)
                {
                  this.searchAlmacenResponsable();
                }
  
              }, error => {
                //console.log("error ", error)
              })

            }
      })   
    }
    else {
        this.listAlmacenResponsable.splice(index,1);
        this.dataSource = new MatTableDataSource<AlmacenResponsable>(this.listAlmacenResponsable);
    }
    
  }
  


}
