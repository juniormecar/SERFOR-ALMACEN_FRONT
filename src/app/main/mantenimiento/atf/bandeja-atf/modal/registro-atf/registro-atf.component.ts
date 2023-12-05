import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ATF } from 'app/shared/models/atf.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';



interface DialogData {
  dataATF:ATF,
  type: string
}


@Component({
  selector: 'app-registro-atf',
  templateUrl: './registro-atf.component.html',
  styleUrls: ['./registro-atf.component.scss']
})
export class RegistroAtfComponent implements OnInit {

  inputRegistroATF: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RegistroAtfComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

    this.inputRegistroATF = this._formBuilder.group({      
      nombreAtf: ['', Validators.required],
      codigoAtf: ['', Validators.required],
      
    });
    
    if(this.data.dataATF !== null && this.data.dataATF !== undefined)
     {
      this.inputRegistroATF.get("nombreAtf").patchValue(this.data.dataATF.nombreAtf);
      this.inputRegistroATF.get("codigoAtf").patchValue(this.data.dataATF.codigoAtf);      
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
