import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ParametroService } from 'app/service/parametro.service';
import { TipoParametroService } from 'app/service/tipo-parametro.service';
import { Parametro } from 'app/shared/models/parametro.model';
import { TipoParametroResponse } from 'app/shared/models/response/tipo-parametro-reponse';
import { TipoParametro } from 'app/shared/models/tipo-parametro.model';
import Swal from 'sweetalert2';

interface DialogData {
  dataParametro:Parametro,
  type: string
}

@Component({
  selector: 'app-registro-parametro',
  templateUrl: './registro-parametro.component.html',
  styleUrls: ['./registro-parametro.component.scss']
})
export class RegistroParametroComponent implements OnInit {

  inputRegistroParametro: FormGroup;
  listTipoParametro: TipoParametro[] = [];
  tipoParametroResponse: TipoParametroResponse = new TipoParametroResponse();
  iddParametro: Number = 0;

  constructor(
    public dialogRef: MatDialogRef<RegistroParametroComponent>,
    private _formBuilder: FormBuilder,
    private tipoParametroService: TipoParametroService,
    private paramametroService: ParametroService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) 
  {
    this.inputRegistroParametro = this._formBuilder.group({      
      codigo: ['', Validators.required],        
      valorPrimario: ['', Validators.required],
      valorSecundario: ['', Validators.required],
      valorTerciario: ['', Validators.required],
      idTipoParametro: ['', Validators.required],
    });
    this.tipoParametroResponse.pageNumber = 1;
    this.tipoParametroResponse.pageSize = 1000;

    if(this.data.dataParametro !== null && this.data.dataParametro !== undefined)
   {
    this.inputRegistroParametro.get("codigo").patchValue(this.data.dataParametro.codigo);
    this.inputRegistroParametro.get("valorPrimario").patchValue(this.data.dataParametro.valorPrimario);      
    this.inputRegistroParametro.get("valorSecundario").patchValue(this.data.dataParametro.valorSecundario);  
    this.inputRegistroParametro.get("valorTerciario").patchValue(this.data.dataParametro.valorTerciario);   
    this.inputRegistroParametro.get("idTipoParametro").patchValue(this.data.dataParametro.idTipoParametro);  
    this.iddParametro = this.data.dataParametro.idParametro;
   } }

  ngOnInit(): void {
    this.SearchTipoParametro();
  }

  SearchTipoParametro() {
    let tipoParametroRequest:TipoParametro = new TipoParametro;  
    this.tipoParametroService.getTipoParametroSearch(tipoParametroRequest,this.tipoParametroResponse.pageNumber,this.tipoParametroResponse.pageSize).subscribe((response:TipoParametroResponse)=>{
      this.tipoParametroResponse =response;
      this.listTipoParametro=response.data;
    })
  }

  registrar() {

    let obj: Parametro = new Parametro();
    obj.idParametro = this.iddParametro;
    obj.codigo = this.inputRegistroParametro.get('codigo').value
    obj.valorPrimario = this.inputRegistroParametro.get('valorPrimario').value
    obj.valorSecundario = this.inputRegistroParametro.get('valorSecundario').value
    obj.valorTerciario = this.inputRegistroParametro.get('valorTerciario').value
    obj.idTipoParametro = this.inputRegistroParametro.get('idTipoParametro').value

    if (obj.codigo == '' || obj.codigo == undefined) return Swal.fire('Mensaje!', 'Debe ingresar el código', 'warning')
    else {

      this.paramametroService.postAñadirParametro(obj).subscribe((response: TipoParametroResponse) => {

        if (response.success) {

          Swal.fire({
            title: 'Mensaje de Confirmación',
            text: 'Parametro guardado correctamente.',
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
            title: 'Mensaje!',
            text: 'Error inesperado al registrar Parametro.',
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
