import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cubicacion } from 'app/shared/models/cubicacion.model';
import { CubicacionService } from 'app/service/cubicacion.service';
import Swal from 'sweetalert2';
import { ActaIntervencion } from 'app/shared/models/acta-intervencion.model';
import { ActaResponse, CreateActaResponse } from 'app/shared/models/response/acta-response';
import { Router } from "@angular/router";
import { ActaService } from 'app/service/acta.service';
import { ModalEspecieCubicacionComponent } from '../modal-especie-cubicacion/modal-especie-cubicacion.component';
import { Recurso } from 'app/shared/models/recurso.model';
import { RecursoService } from 'app/service/recurso.service';
import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { RecursoProduco } from 'app/shared/models/recurso-producto.model';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
import * as moment from 'moment';
import { Constants } from 'app/shared/models/util/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
interface DialogData {
  idRecurso: number,
  dataRecurso:Recurso
}

@Component({
  selector: 'app-modal-acta-intervencion',
  templateUrl: './modal-acta-intervencion.component.html',
  styleUrls: ['./modal-acta-intervencion.component.scss']
})
export class ModalActaIntervencionComponent implements OnInit {
  dialogTitle: string = Constants.TITLE_ACTA;
  listProducto: RecursoProduco[] = [];
  dataSource1 = new MatTableDataSource<ActaIntervencion>([]);
  selection = new SelectionModel<ActaIntervencion>(true, []);
  displayedColumns = ['position', 'tipoProducto', 'nameComun','nameCientifico', 'unidadMedida', 'cantidad'];
  dataSource = new MatTableDataSource<RecursoProduco>(this.listProducto);
  almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
  almacenRequest: ActaIntervencion = new ActaIntervencion();
  inputActa: FormGroup;
  idRecurso: number;
  totalToneladas: number = 0;
  consolidadoActa: any = null;
  fechaActual:string;
  horaActual:string;
  seasons: string[] = ['Leve', 'Grave', 'Muy Grave'];
  seasonsSancion: string[] = ['Amonestacion', 'Multa'];
  recursoResponse: BandejaRecursoResponse = new BandejaRecursoResponse();
  listRecursoProducto: RecursoProduco[] = [];
  /********************************************* RECURSO PRODUCTO NO MADERABLE ******************************************************/
  listProductoNoMad: RecursoProduco[] = [];
  recursoResponseNoMad: BandejaRecursoResponse = new BandejaRecursoResponse();
  displayedColumnsNoMad = ['position', 'nameCientifico', 'nameComun', 'cantidad', 'unidadMedida'];
  dataSourceNoMad = new MatTableDataSource<RecursoProduco>(this.listProductoNoMad);
  totalToneladasNoMad: number = 0;
  /********************************************* RECURSO PRODUCTO FAUNA ******************************************************/
  listProductoFA: RecursoProduco[] = [];
  recursoResponseFA: BandejaRecursoResponse = new BandejaRecursoResponse();
  displayedColumnsFA = ['position', 'nameCientifico', 'nameComun', 'cantidad'];
  dataSourceFA = new MatTableDataSource<RecursoProduco>(this.listProductoFA);
  totalToneladasFA: number = 0;
  /***************************************************************************************************/
  /**
     * Constructor
     *
     * @param {MatDialogRef<ModalActaIntervencionComponent>} dialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    public _router: Router,
    private actaService: ActaService,
    private _formBuilder: FormBuilder,
    private recursoService: RecursoService,
    public dialogRef: MatDialogRef<ModalEspecieCubicacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _matSnackBar: MatSnackBar
  ) {
    this.idRecurso = this.data.idRecurso;
    this.inputActa = this._formBuilder.group({
      fechaIntervencion: [''],
      hora: [''],
      lugar: [''],
      nombreIntervenido: [''],
      numeroDNI: [''],
      domicilioIntervenido: [''],
      descripcionHechos: [''],
      conductaInfractora: [''],
      tipoInfraccion: [''],
      sancion: [''],
      montoMulta: [''],
      sustentoNormativoMulta: [''],
      nombreAutoridadInstructora: [''],
      sustentoNormativoInstructora: [''],
      atutoridadDecisora: [''],
      sustentoNormativoDecisora: [''],
      mediosPrueba: [''],
      plazoPresentacionEncargo: [''],
      medidaProvisional: [''],
      justificacion: [''],
      // tipoEspecimen: [''],
      // especie: [''],
      // unidad: [''],
      // cantidadVolumen: [''],
      observaciones: [''],
      autoridadInstructora: [''], 
      nombreTestigo: [''],
      nombreAdministrado: ['']
      // tipoAlmacen: ['', Validators.required]
    });
    this.almacenResponse.pageNumber = 1;
    this.almacenResponse.pageSize = 1000;
    this.recursoResponse.pageNumber = 1;
    this.recursoResponse.pageSize = 1000;
  }

  ngOnInit(): void {
    this.fechaActual = moment(new Date()).format('YYYY-MM-DD');
    this.horaActual = moment(new Date()).format('HH:mm');
    this.searchActa();
    this.getRecursosEspecies(this.idRecurso);
    //console.log('thisss', this.idRecurso);
  }

  conductaInfractoraSeleccionada: string = '';

  onCheckboxChange(value: string) {
    this.conductaInfractoraSeleccionada = value;
  }

  tiposancionSeleccionada: string = '';

  valoresCheckbox(value: string) {
    this.tiposancionSeleccionada = value;
  }

  guardar() {
    let obj: ActaIntervencion = new ActaIntervencion();
    let fechaIntervencion = new Date(this.inputActa.get('fechaIntervencion').value)
    fechaIntervencion.setMinutes(fechaIntervencion.getMinutes() + fechaIntervencion.getTimezoneOffset())
    obj.fechaIntervencion = fechaIntervencion;
    obj.hora = this.inputActa.get('hora').value
    obj.lugar = this.inputActa.get('lugar').value
    obj.nombreIntervenido = this.inputActa.get('nombreIntervenido').value
    obj.numeroDNI = this.inputActa.get('numeroDNI').value
    obj.domicilioIntervenido = this.inputActa.get('domicilioIntervenido').value
    obj.descripcionHechos = this.inputActa.get('descripcionHechos').value
    obj.conductaInfractora = this.inputActa.get('conductaInfractora').value
    obj.tipoInfraccion = this.conductaInfractoraSeleccionada;
    obj.sancion = this.tiposancionSeleccionada;
    obj.montoMulta = this.inputActa.get('montoMulta').value
    obj.sustentoNormativoMulta = this.inputActa.get('sustentoNormativoMulta').value
    obj.nombreAutoridadInstructora = this.inputActa.get('nombreAutoridadInstructora').value
    obj.sustentoNormativoInstructora = this.inputActa.get('sustentoNormativoInstructora').value
    obj.atutoridadDecisora = this.inputActa.get('atutoridadDecisora').value
    obj.sustentoNormativoDecisora = this.inputActa.get('sustentoNormativoDecisora').value
    obj.mediosPrueba = this.inputActa.get('mediosPrueba').value
    obj.plazoPresentacionEncargo = this.inputActa.get('plazoPresentacionEncargo').value
    obj.medidaProvisional = this.inputActa.get('medidaProvisional').value
    obj.justificacion = this.inputActa.get('justificacion').value
    /* obj.tipoEspecimen = this.inputActa.get('tipoEspecimen').value
     obj.especie = this.inputActa.get('especie').value
     obj.unidad = this.inputActa.get('unidad').value
     obj.cantidadVolumen = this.inputActa.get('cantidadVolumen').value*/
    obj.observaciones = this.inputActa.get('observaciones').value
    obj.autoridadInstructora = this.inputActa.get('autoridadInstructora').value
    obj.nombreTestigo = this.inputActa.get('nombreTestigo').value
    obj.nombreAdministrado = this.inputActa.get('nombreAdministrado').value
    obj.nuIdRecurso = this.idRecurso;

    //console.log("tipoooooooooo", obj.tipoEspecimen);



    Swal.fire({
      title: '¿Desea guardar los datos del acta?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.actaService.postActa(obj).subscribe((response: CreateActaResponse) => {

          if (response.success) {

           /*Swal.fire(
              'Mensaje de Confirmación',
              'Acta guardada correctamente.',
              'success'
            )*/

            this._matSnackBar.open('Acta guardada correctamente', 'OK', {
              //verticalPosition: 'top',  // 'top' | 'bottom'
              horizontalPosition: 'center',  // 'start' | 'center' | 'end' | 'left' | 'right'
            //  panelClass: 'event-form-dialog',
              duration        : 2000
            });

            this.generarActa();
            //this._router.navigate(['bandeja-almacen']);

          } else {
            Swal.fire(
              'Mensaje!',
              'Error inesperado al registrar la acta.',
              'error'
            )

          }
        }, error => {
          //console.log("error ", error)
        })
      }
    })

  }

  close() {
    this.dialogRef.close(-1);
  }

  searchActa() {
    this.actaService.getActa(this.idRecurso).subscribe((resp: ActaResponse) => {
      //console.log("this.data.dataRecurso ",this.data.dataRecurso)
      let nombres =this.data.dataRecurso.nombres!==null?this.data.dataRecurso.nombres:"";
      if (resp.success) {
        if (resp.data.fechaIntervencion === undefined || resp.data.fechaIntervencion === null) {
          this.inputActa.get('fechaIntervencion').patchValue(this.fechaActual);
        }else{ 
          this.inputActa.get('fechaIntervencion').patchValue(resp.data.fechaIntervencion);
        }
        if (resp.data.hora === undefined || resp.data.hora === null) {
          this.inputActa.get('hora').patchValue(this.horaActual);
        }else{
          this.inputActa.get('hora').patchValue(resp.data.hora);
        }
          this.inputActa.get('nombreIntervenido').patchValue(nombres);
          this.inputActa.get('numeroDNI').patchValue(this.data.dataRecurso.numeroDocumento);
          this.inputActa.get('lugar').patchValue(this.data.dataRecurso.direccion);
        this.inputActa.get('domicilioIntervenido').patchValue(resp.data.domicilioIntervenido);
       // this.inputActa.get('lugar').patchValue(resp.data.lugar);
        this.inputActa.get('descripcionHechos').patchValue(resp.data.descripcionHechos);
        this.inputActa.get('conductaInfractora').patchValue(resp.data.conductaInfractora);
        if(this.data.dataRecurso.tipoSancion === 'TIPOSANAMON'){
          this.tiposancionSeleccionada = 'Amonestacion';
          this.inputActa.get('sancion').patchValue('Amonestacion');
        }else{
          this.tiposancionSeleccionada = 'Multa';
          this.inputActa.get('sancion').patchValue('Multa');
        }

        if(this.data.dataRecurso.tipoInfraccion === 'TIPOINFMUYGRA'){
          this.conductaInfractoraSeleccionada = 'Muy Grave';
          this.inputActa.get('tipoInfraccion').patchValue('Muy Grave');
        }else if(this.data.dataRecurso.tipoInfraccion === 'TIPOINFGRAVE'){
          this.conductaInfractoraSeleccionada = 'Grave';
          this.inputActa.get('tipoInfraccion').patchValue('Grave');
        }else if(this.data.dataRecurso.tipoInfraccion === 'TIPOINFLEVE'){
          this.conductaInfractoraSeleccionada = 'Leve';
          this.inputActa.get('tipoInfraccion').patchValue('Leve');
        }

        this.inputActa.get('montoMulta').patchValue(resp.data.montoMulta);
        this.inputActa.get('sustentoNormativoMulta').patchValue(resp.data.sustentoNormativoMulta);
        this.inputActa.get('nombreAutoridadInstructora').patchValue(resp.data.nombreAutoridadInstructora);
        this.inputActa.get('sustentoNormativoInstructora').patchValue(resp.data.sustentoNormativoInstructora);
        this.inputActa.get('atutoridadDecisora').patchValue(resp.data.atutoridadDecisora);
        this.inputActa.get('sustentoNormativoDecisora').patchValue(resp.data.sustentoNormativoDecisora);
        this.inputActa.get('mediosPrueba').patchValue(resp.data.mediosPrueba);
        this.inputActa.get('plazoPresentacionEncargo').patchValue(resp.data.plazoPresentacionEncargo);
        this.inputActa.get('medidaProvisional').patchValue(resp.data.medidaProvisional);
        this.inputActa.get('justificacion').patchValue(resp.data.justificacion);
        /*this.inputActa.get('tipoEspecimen').patchValue(resp.data.tipoEspecimen);
        this.inputActa.get('especie').patchValue(resp.data.especie);
        this.inputActa.get('unidad').patchValue(resp.data.unidad);
        this.inputActa.get('cantidadVolumen').patchValue(resp.data.cantidadVolumen);*/
        this.inputActa.get('observaciones').patchValue(resp.data.observaciones);
        this.inputActa.get('autoridadInstructora').patchValue(resp.data.autoridadInstructora);
        this.inputActa.get('nombreTestigo').patchValue(resp.data.nombreTestigo);
        this.inputActa.get('nombreAdministrado').patchValue(resp.data.nombreAdministrado);
      } else {
        this.inputActa.get('fechaIntervencion').patchValue(this.fechaActual);
        this.inputActa.get('fechaIntervencion').patchValue(this.horaActual);
        this.inputActa.get('nombreIntervenido').patchValue(nombres);
        this.inputActa.get('numeroDNI').patchValue(this.data.dataRecurso.numeroDocumento);
        this.inputActa.get('lugar').patchValue(this.data.dataRecurso.direccion);
        if(this.data.dataRecurso.tipoSancion === 'TIPOSANAMON'){
          this.tiposancionSeleccionada = 'Amonestacion';
        }else{
          this.tiposancionSeleccionada = 'Multa';
        }
      }
    })
  }

  /*getRecursosEspecies(idRecurso: number) {

    this.dataSource = new MatTableDataSource<Recurso>([])
    this.recursoService.getRecursoEspeciesSearch(null, idRecurso,
      this.almacenResponse.pageNumber, this.almacenResponse.pageSize)
      .subscribe((response: BandejaRecursoResponse) => {
        //console.log("response ", response)
        this.listProducto = response.data;

        this.dataSource = new MatTableDataSource<RecursoProduco>(this.listProducto);
      });
  }*/

  getRecursosEspecies(idRecurso: number) {

    this.dataSource = new MatTableDataSource<RecursoProduco>([])
    this.dataSourceNoMad = new MatTableDataSource<RecursoProduco>([])
    this.dataSourceFA = new MatTableDataSource<RecursoProduco>([])
    this.recursoService.getRecursoEspeciesSearch(null, idRecurso,
      this.recursoResponse.pageNumber, this.recursoResponse.pageSize)
      .subscribe((response: BandejaRecursoResponse) => {
        this.listRecursoProducto = response.data
        this.listProducto = response.data.filter(item => item.type === Constants.MADERABLE);
        this.listProductoNoMad = response.data.filter(item => item.type === Constants.NOMADERABLE);
        this.listProductoFA = response.data.filter(item => item.type === Constants.FAUNA);
        this.dataSource = new MatTableDataSource<RecursoProduco>(this.listProducto);
        this.dataSourceNoMad = new MatTableDataSource<RecursoProduco>(this.listProductoNoMad);
        this.dataSourceFA = new MatTableDataSource<RecursoProduco>(this.listProductoFA);
      });
  }


  generarActa() {

    this.actaService
      .consolidadoActa(this.idRecurso)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.consolidadoActa = res;
          this.descargarArchivo(this.consolidadoActa);
        } else {

        }
      }, err => {
      });
  }

  descargarArchivo(archivoResponse: any) {
    if (this.isNullOrEmpty(archivoResponse)) {
      console.error("Archivo nulo");
      return;
    }
    const { archivo, nombeArchivo, contenTypeArchivo } = archivoResponse;
    if (
      this.isNullOrEmpty(archivo) ||
      this.isNullOrEmpty(nombeArchivo) ||
      this.isNullOrEmpty(contenTypeArchivo)
    ) {
      console.error("Archivo o nombre archivo o content type nulo ");
      return;
    }
    this.DownloadFile(archivo, nombeArchivo, contenTypeArchivo);
  }

  isNullOrEmpty(value: any | number | string): boolean {
    return value == null || value == undefined || value == "";
  }

  DownloadFile(base64: string, name: string, mediaType: string) {
    let blob = this.Base64toBlob(base64, mediaType);
    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = name;
    link.click();
    URL.revokeObjectURL(objectUrl);
  }

  Base64toBlob(base64Data: string, contentType: string): Blob {
    contentType = contentType || "";
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data.replace(/['"]+/g, ""));
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }


}