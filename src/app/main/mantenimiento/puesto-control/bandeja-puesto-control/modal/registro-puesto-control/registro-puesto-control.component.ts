import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PuestoControl } from 'app/shared/models/puesto-control.model';
import { PuestoControlResponse } from 'app/shared/models/response/puestocontrol-response';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ATF } from 'app/shared/models/atf.model';
import { AtfService } from 'app/service/atf.service';
import { AtfResponse } from 'app/shared/models/response/atf-response';
import Swal from 'sweetalert2';
import { PuestoControlService } from 'app/service/puesto-control.service';

interface DialogData {
  dataPuestoControl:PuestoControl,
  type: string
}


@Component({
  selector: 'app-registro-puesto-control',
  templateUrl: './registro-puesto-control.component.html',
  styleUrls: ['./registro-puesto-control.component.scss']
})
export class RegistroPuestoControlComponent implements OnInit {

  
  inputRegistroPuestoControl: FormGroup;
  listATF: ATF[] = [];
  atfResponse: AtfResponse = new AtfResponse();
  iddPuestoControl: Number=0;


  constructor(public dialogRef: MatDialogRef<RegistroPuestoControlComponent>,
    private _formBuilder: FormBuilder,
    private atfService: AtfService,
    private puestoControlService: PuestoControlService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData)
    { 

      this.inputRegistroPuestoControl = this._formBuilder.group({      
        nombrePuestoControl: ['', Validators.required],        
        controlObligatorio: ['', Validators.required],
        departamento: ['', Validators.required],
        provincia: ['', Validators.required],
        distrito: ['', Validators.required],
        coordenadasNorte: ['', Validators.required],
        coordenadasEste: ['', Validators.required],
        zonaUTM: ['', Validators.required],
        idAtf: ['', Validators.required],
        
      });
      this.atfResponse.pageNumber = 1;
      this.atfResponse.pageSize = 100;

      if(this.data.dataPuestoControl !== null && this.data.dataPuestoControl !== undefined)
     {
      this.inputRegistroPuestoControl.get("nombrePuestoControl").patchValue(this.data.dataPuestoControl.nombrePuestoControl);
      this.inputRegistroPuestoControl.get("controlObligatorio").patchValue(this.data.dataPuestoControl.controlObligatorio);      
      this.inputRegistroPuestoControl.get("departamento").patchValue(this.data.dataPuestoControl.departamento);  
      this.inputRegistroPuestoControl.get("provincia").patchValue(this.data.dataPuestoControl.provincia);  
      this.inputRegistroPuestoControl.get("distrito").patchValue(this.data.dataPuestoControl.distrito);  
      this.inputRegistroPuestoControl.get("coordenadasNorte").patchValue(this.data.dataPuestoControl.coordenadasNorte);  
      this.inputRegistroPuestoControl.get("coordenadasEste").patchValue(this.data.dataPuestoControl.coordenadasEste);  
      this.inputRegistroPuestoControl.get("zonaUTM").patchValue(this.data.dataPuestoControl.zonaUTM);  
      this.inputRegistroPuestoControl.get("idAtf").patchValue(this.data.dataPuestoControl.idAtf);  
      this.iddPuestoControl = this.data.dataPuestoControl.idPuestoControl;
     }


    }

  ngOnInit(): void {
    this.searchATF();
  }

  searchATF() {
    this.atfService.getATFSearch().subscribe((response: ATF[]) => {
      this.listATF = response;
    });
  }
  registrar() {

    let obj: PuestoControl = new PuestoControl();    
    obj.idPuestoControl = this.iddPuestoControl;
    obj.nombrePuestoControl = this.inputRegistroPuestoControl.get('nombrePuestoControl').value
    obj.controlObligatorio = this.inputRegistroPuestoControl.get('controlObligatorio').value    
    obj.departamento = this.inputRegistroPuestoControl.get('departamento').value    
    obj.provincia = this.inputRegistroPuestoControl.get('provincia').value    
    obj.distrito = this.inputRegistroPuestoControl.get('distrito').value    
    obj.coordenadasNorte = this.inputRegistroPuestoControl.get('coordenadasNorte').value    
    obj.coordenadasEste = this.inputRegistroPuestoControl.get('coordenadasEste').value    
    obj.zonaUTM = this.inputRegistroPuestoControl.get('zonaUTM').value    
    obj.idAtf = this.inputRegistroPuestoControl.get('idAtf').value    


    if(obj.nombrePuestoControl == '' || obj.nombrePuestoControl == undefined) return Swal.fire('Mensaje!','Debe ingresar el Nombre de Puesto de Control','warning')
    else{

    this.puestoControlService.postPuestoControl(obj).subscribe((response: AtfResponse) => {
      
      if (response.success) {

        Swal.fire({
          title: 'Mensaje de Confirmación',
          text: 'Puesto de Control guardado correctamente.',
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

      // this._router.navigate(['bandeja-atf']);

      } else {
        Swal.fire({
          title: 'Mensaje!',
          text: 'Error inesperado al registrar el Puesto de Control.',
          icon: 'error',
          width: 350,
         confirmButtonColor: '#C73410',
          confirmButtonText: 'ok'
        }).then((result) => {
          if (result.isConfirmed) {
          }
        })
      }
    }, error => {     
    })
    this.dialogRef.close(999);
  }
  }

  close() {
    //console.log("cerrar");
    this.dialogRef.close(-1);
  }

}
