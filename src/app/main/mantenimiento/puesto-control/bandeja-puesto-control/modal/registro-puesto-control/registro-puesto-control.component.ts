import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PuestoControl } from 'app/shared/models/puesto-control.model';
import { PuestoControlResponse } from 'app/shared/models/response/puestocontrol-response';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(public dialogRef: MatDialogRef<RegistroPuestoControlComponent>,
    private _formBuilder: FormBuilder,
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
        
      });

      if(this.data.dataPuestoControl !== null && this.data.dataPuestoControl !== undefined)
     {
      this.inputRegistroPuestoControl.get("nombrePuestoControl").patchValue(this.data.dataPuestoControl.nombrePuestoControl);
      this.inputRegistroPuestoControl.get("controlObligatorio").patchValue(this.data.dataPuestoControl.controlObligatorio);      
      this.inputRegistroPuestoControl.get("departamento").patchValue(this.data.dataPuestoControl.departamento);  
      this.inputRegistroPuestoControl.get("provincia").patchValue(this.data.dataPuestoControl.provincia);  
      this.inputRegistroPuestoControl.get("distrito").patchValue(this.data.dataPuestoControl.distrito);  
      this.inputRegistroPuestoControl.get("coordenadasNorte").patchValue(this.data.dataPuestoControl.coordenadasNorte);  
      this.inputRegistroPuestoControl.get("coordenadasEste").patchValue(this.data.dataPuestoControl.coordenadasEste);  
     }


    }

  ngOnInit(): void {
  }

  registrar() { }

  close() {
    //console.log("cerrar");
    this.dialogRef.close(-1);
  }

}
