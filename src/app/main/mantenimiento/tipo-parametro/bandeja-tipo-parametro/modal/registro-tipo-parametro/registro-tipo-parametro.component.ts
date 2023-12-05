import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoParametroService } from 'app/service/tipo-parametro.service';
import { TipoParametroResponse } from 'app/shared/models/response/tipo-parametro-reponse';
import { TipoParametro } from 'app/shared/models/tipo-parametro.model';
import Swal from 'sweetalert2';

interface DialogData {
  dataPuestoControl: TipoParametro,
  type: string
}


@Component({
  selector: 'app-registro-tipo-parametro',
  templateUrl: './registro-tipo-parametro.component.html',
  styleUrls: ['./registro-tipo-parametro.component.scss']
})
export class RegistroTipoParametroComponent implements OnInit {

  inputRegistroTipoPrametro: FormGroup;
  iddTipoParametro: Number=0;

  constructor(public dialogRef: MatDialogRef<RegistroTipoParametroComponent>,
    private _formBuilder: FormBuilder,
    private tipoParametroService: TipoParametroService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.inputRegistroTipoPrametro = this._formBuilder.group({
      prefijo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });

    if (this.data.dataPuestoControl !== null && this.data.dataPuestoControl !== undefined) {
        this.inputRegistroTipoPrametro.get("prefijo").patchValue(this.data.dataPuestoControl.prefijo);
        this.inputRegistroTipoPrametro.get("nombre").patchValue(this.data.dataPuestoControl.nombre);
        this.inputRegistroTipoPrametro.get("descripcion").patchValue(this.data.dataPuestoControl.descripcion);
        this.iddTipoParametro = this.data.dataPuestoControl.idTipoParametro;
    }

  }

  ngOnInit(): void {
  }

  registrar() {

    let obj: TipoParametro = new TipoParametro();
    obj.idTipoParametro = this.iddTipoParametro;
    obj.prefijo = this.inputRegistroTipoPrametro.get('prefijo').value
    obj.nombre = this.inputRegistroTipoPrametro.get('nombre').value    
    obj.descripcion = this.inputRegistroTipoPrametro.get('descripcion').value 


    if(obj.prefijo == '' || obj.prefijo == undefined) return Swal.fire('Mensaje!','Debe ingresar el Prefijo del Tipo Parámetro','warning')
    else{

    this.tipoParametroService.postTipoParametro(obj).subscribe((response: TipoParametroResponse) => {
      
      if (response.success) {

        Swal.fire({
          title: 'Mensaje de Confirmación',
          text: 'Tipo Parámetro guardado correctamente.',
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

       //this._router.navigate(['bandeja-atf']);

      } else {
        Swal.fire({
          title: 'Mensaje!',
          text: 'Error inesperado al registrar el Tipo Parámetro.',
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
