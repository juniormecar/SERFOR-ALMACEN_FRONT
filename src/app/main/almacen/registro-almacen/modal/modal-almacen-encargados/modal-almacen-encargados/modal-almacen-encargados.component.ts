import { Component, Inject, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject } from 'rxjs';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RegistroListSteps, RegistroStep } from 'app/main/almacen/registro-almacen/registroAlmacenConstant';
import { AlmacenResponsable } from 'app/shared/models/almacen-responsable.model';
import { AlmacenService } from 'app/service/almacen.service';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
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
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AtfResponse } from 'app/shared/models/response/atf-response';
import { PuestoControlResponse } from 'app/shared/models/response/puestocontrol-response';
interface General {
  dataEncargado:AlmacenResponsable,
  type: string
}


@Component({
  selector: 'app-modal-almacen-encargados',
  templateUrl: './modal-almacen-encargados.component.html',
  styleUrls: ['./modal-almacen-encargados.component.scss']
})
export class ModalAlmacenEncargadosComponent implements OnInit {
  dataSource = new MatTableDataSource<AlmacenResponsable>([]);
  selection = new SelectionModel<AlmacenResponsable>(true, []);
  almacenResponse: AlmacenResponsableResponse = new AlmacenResponsableResponse();
  almacenRequest:  AlmacenResponsable = new AlmacenResponsable();
  inputRegistro: FormGroup;
  course: RegistroStep[] = RegistroListSteps;
  animationDirection: 'left' | 'right' | 'none';
  courseStepContent: any;
  currentStep: number;
  titleStep: string = '';
  step = 0;
  listATF: ATF[] = [];
  listPuestoControl: PuestoControl[] = [];
  listTipoAlmacen: Parametro[] = [];
  listTipoDocumento: Parametro[] = [];
  tipoAlmacen: string = Constants.TIPO_ALMACEN;
  validaDNIClass: boolean = false;
  photo:string;
  typeProcess:string;
  tipoDocumento: string = Constants.TIPO_DOCUMENTO;
  setStep(index: number) {
    this.step = index;
  }
  general = {
    idAlmacenResponsable: 0,
    type: '',
    nombresResponsable: '',
    tipoDocumento: '',
    numeroDocumento: ''
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
    public dialogRef: MatDialogRef<ModalAlmacenEncargadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: General,
    private pideService: PideService) {
    this.atfResponse.pageNumber = 1;
    this.atfResponse.pageSize = 100;
    this.puestoControlResponse.pageNumber = 1;
    this.puestoControlResponse.pageSize = 100;
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
      txTipoDocumento: ['', Validators.required],
      txNumeroDocumento: ['', Validators.required],
      txNombresEncargado: ['', Validators.required]
    });
    //console.log("eeeeeeeee",this.data);
    if(this.data.dataEncargado !== null && this.data.dataEncargado !== undefined)
     {
      this.inputRegistro.get("txTipoDocumento").patchValue(this.data.dataEncargado.tipoDocumento);
      this.inputRegistro.get("txNumeroDocumento").patchValue(this.data.dataEncargado.numeroDocumento);
      this.inputRegistro.get("txNombresEncargado").patchValue(this.data.dataEncargado.nombresResponsable);
     }

    this.typeProcess = this.data.type;


    this.currentStep = 0;
    this.titleStep = this.course[0].title
  }

  ngOnInit(): void {
    this.setStep(5);
    this.searchATF();
    this.searchTipoAlmacen();
    this.searchTipoDocumento();
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
    this.parametroService.getParametroSearch(this.tipoAlmacen).subscribe((response: Parametro[]) => {
      this.listTipoAlmacen = response;
    });
  }

  searchTipoDocumento() {
    this.parametroService.getParametroSearch(this.tipoDocumento).subscribe((response: Parametro[]) => {
      this.listTipoDocumento = response;
    });
  }

  agregarAlmacenResponsable() {
    let obj: AlmacenResponsable = new AlmacenResponsable();
    
    obj.tipoDocumento = this.inputRegistro.get('txTipoDocumento').value
    obj.numeroDocumento = this.inputRegistro.get('txNumeroDocumento').value
    obj.nombresResponsable = this.inputRegistro.get('txNombresEncargado').value
    obj.idAlmacenResponsable = 0;

    if(obj.numeroDocumento == '') return Swal.fire('Mensaje!','Debe ingresar Documento Identidad','warning')
    
    this.dialogRef.close(obj);
  }

  editarAlmacenResponsable() {
    //let obj: AlmacenResponsable = new AlmacenResponsable();
    ////console.log("this.typeProcess",this.typeProcess)
    this.general.type = this.typeProcess;
    this.general.tipoDocumento = this.inputRegistro.get('txTipoDocumento').value
    this.general.numeroDocumento = this.inputRegistro.get('txNumeroDocumento').value
    this.general.nombresResponsable = this.inputRegistro.get('txNombresEncargado').value
    this.general.idAlmacenResponsable = this.data.dataEncargado.nuIdAlmacen;

    if(this.general.numeroDocumento == '') return Swal.fire('Mensaje!','Debe ingresar Documento Identidad','warning')
  
    this.dialogRef.close(this.general);
  }

  cancelar(){   
   // this._router.navigate(['registro-almacen']);       
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
          this.inputRegistro.get("txNombresEncargado").patchValue(nombres+' '+paterno+' '+materno);
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
 
  close() {
    //console.log("cerrar");
    this.dialogRef.close(-1);
  }

}
