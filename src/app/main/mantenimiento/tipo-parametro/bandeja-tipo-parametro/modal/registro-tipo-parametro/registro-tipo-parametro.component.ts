import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoParametro } from 'app/shared/models/tipo-parametro.model';

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

  constructor(public dialogRef: MatDialogRef<RegistroTipoParametroComponent>,
    private _formBuilder: FormBuilder,
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
