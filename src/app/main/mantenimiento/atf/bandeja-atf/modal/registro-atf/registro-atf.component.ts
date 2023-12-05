import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ATF } from 'app/shared/models/atf.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AtfService } from 'app/service/atf.service';
import { AtfResponse } from 'app/shared/models/response/atf-response';
import { Router } from "@angular/router";

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
    private atfService: AtfService,
    public _router: Router,
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

    registrar() {

    let obj: ATF = new ATF();
    obj.idAtf = this.data.dataATF.idAtf !== undefined ? this.data.dataATF.idAtf : 0;
    obj.nombreAtf = this.inputRegistroATF.get('nombreAtf').value
    obj.codigoAtf = this.inputRegistroATF.get('codigoAtf').value    


    if(obj.nombreAtf == '' || obj.nombreAtf == undefined) return Swal.fire('Mensaje!','Debe ingresar el Nombre de ATF','warning')
    else{

    this.atfService.postAtf(obj).subscribe((response: AtfResponse) => {
      
      if (response.success) {

        Swal.fire({
          title: 'Mensaje de Confirmación',
          text: 'ATF guardado correctamente.',
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

       this._router.navigate(['bandeja-atf']);

      } else {
        Swal.fire({
          title: 'Mensaje!',
          text: 'Error inesperado al registrar ATF.',
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
    this.dialogRef.close(-1);
  }

}
