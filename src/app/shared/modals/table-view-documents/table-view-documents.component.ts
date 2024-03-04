import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ArchivoService } from 'app/service/archivo.service';
import { RecursoService } from 'app/service/recurso.service';
import { TransferenciaService } from 'app/service/transferencia.service';
import { Archivo } from 'app/shared/models/archivo.model';
import { Recurso } from 'app/shared/models/recurso.model';
import { Constants } from 'app/shared/models/util/constants';
import { DownloadFile } from 'app/shared/models/util/util';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AppViewDocumentsPdfComponent } from '../app-view-documents-pdf/app-view-documents-pdf.component';
import { AppViewDocumentsComponent } from '../app-view-documents/app-view-documents.component';

@Component({
  selector: 'app-table-view-documents',
  templateUrl: './table-view-documents.component.html',
  styleUrls: ['./table-view-documents.component.scss']
})
export class TableViewDocumentsComponent implements OnInit {

  dataSource = new MatTableDataSource<Archivo>([]);
  displayedColumns: string[] = ['descargaArchivo', 'nombreArchivo' , 'extensionArchivo', 'accionesArchivo'];
  idArchivo: number;

  accept: string = ".pdf";
  tipoArchivoTablaCod: string[] = ["application/pdf", "image/png","image/jpg","video/mp4","image/jpeg"];
  tipoArchivoPdf: string[] = ["application/pdf"];
  tipoArchivoImage: string[] = ["image/png","image/jpg","image/jpeg"];
  tipoArchivoVideo: string[] = ["video/mp4"];

  constructor(      
    public dialogRef: MatDialogRef<TableViewDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _servicioArchivo: ArchivoService,
    private _servicioTransferencia: TransferenciaService,
    private _servicioRecurso: RecursoService,
    ) { console.log("this.data",this.data)}

  ngOnInit(): void {
    this.accept = this.data.accept;
    this.idArchivo = this.data.idArchivo;
    this.verArchivos();
  }

  verArchivos(){
    console.log("this.idArchivo-verArchivos",this.idArchivo)
    if(this.idArchivo != 0 && this.idArchivo !=null){  
      this._servicioArchivo.listarMultiplesArchivosGeneral(this.idArchivo,null)
      .pipe()
      .subscribe((result: any) => {
        if(result.data){
          if(result.data != null && result.data != undefined){
            console.log("result.data",result.data)
            this.dataSource = result.data;
          }
        }
      });
    }
  }

  addArchivo(file: any) {
    console.log("file-addArchivoRecurso",file);
    const files = file?.target?.files as FileList
    if (files && files.length > 0) {
      const fileExt = files[0].type.toLocaleLowerCase();
      if (this.tipoArchivoTablaCod.includes(fileExt)) {
        const file = files[0];
        console.log("files-addArchivoRecurso", file);
        this.cargarMultipleArchivoGeneral(file);
      } else {
        Swal.fire(
          'Mensaje!',
          '(*) Formato no valido (pdf)',
          'error'
        )
      }
    }
  //this.addArchivoTabla(item,e,index);
  }

  cargarMultipleArchivoGeneral( file: any) {
    let codigoTipo = this.data.subTypeObject;
    let codigoUrlArchivo = codigoTipo + Constants.BACKSLASH + Constants.BACKSLASH + this.data.typeObject + Constants.BACKSLASH + Constants.BACKSLASH;

    let params = {
      idUsuario: 1,
      tipoDocumento: codigoTipo,
      codigo: codigoUrlArchivo,
      nuIdArchivo: this.idArchivo == null || this.idArchivo == undefined ? 0:this.idArchivo
    }
    this._servicioArchivo
      .cargarMultipleArchivoGeneral(
        params,
        file
      )
      .pipe()
      .subscribe((result: any) => {
        console.log("cargarMultipleArchivoGeneral", result)
        if(this.data.typeObject == Constants.RECURSO){
          this.idArchivo = result.data;
          this.actualizarRecursoArchivos(this.data.idObjeto, this.data.idObjetoDet,result.data, Constants.ACCION_REGISTRAR);
        } else if(this.data.typeObject == Constants.TRANSFERENCIA){
          this.actualizarTransferenciaArhivo(this.data.idObjeto, result.data, Constants.ACCION_REGISTRAR);
        }
      });
  }

  actualizarRecursoArchivos(nuIdRecurso: number, nuIdRecursoProducto: number,idFile: number, type: string) {
    const params = { "nuIdRecurso": nuIdRecurso,"nuIdRecursoProducto": nuIdRecursoProducto, "nuIdArchivoRecurso": idFile, "nuIdUsuarioModificacion": 1 , "typeAccion": type };
    this._servicioRecurso.actualizarRecursoArchivos(params).subscribe((result: any) => {
      this.idArchivo = result.data
      this.verArchivos();
    }, () => {
      Swal.fire( 
        'Mensaje!',
        'No se pudo registrar el archivo',
        'error'
      )
    });
  }

  actualizarTransferenciaArhivo(nuIdTransferencia: any, idFile: number, type: string) {
    const params = { "nuIdTransferencia": nuIdTransferencia, "nuIdArchivo": idFile, "nuIdUsuarioModificacion": 1 , "typeAccion": type };
    this._servicioTransferencia.actualizarTransferenciaArhivo(params).subscribe((result: any) => {
      this.idArchivo = result.data
      this.verArchivos();
    }, () => {
      Swal.fire( 
        'Mensaje!',
        'No se pudo registrar el archivo',
        'error'
      )
    });
  }

  descargarArchivoTabla(element: any) {
    this._servicioArchivo.listarMultiplesArchivosGeneral(element.nuIdArchivo, element.nuIdArchivoDetalle).subscribe((result: any) => {
      if (result.data !== null && result.data !== undefined) {
        DownloadFile(result.data[0].archivo, result.data[0].nombeArchivo, result.data[0].contenTypeArchivo);
      }
    }, () => {
      Swal.fire(
        'Mensaje!',
        'No se pudo descargar el archivo.',
        'error'
      )
    });
  }

  eliminarArchivoGeneral(element: any) {
    const params = { "idArchivoDetalle": element.nuIdArchivoDetalle, "idUsuarioElimina": 1 };
    this._servicioArchivo.eliminarMultiplesArchivos(params).subscribe((result: any) => {
      this.verArchivos();
    }, () => {
      Swal.fire(
        'Mensaje!',
        'No se pudo eliminar el archivo',
        'error'
      )
    });
  }

  viewDocuments(element: any) {
    console.log("element",element)
    if(this.tipoArchivoPdf.includes(element.typeFile)){
      const dialogRef = this.dialog.open(AppViewDocumentsPdfComponent, {
        disableClose: true,
        data: {
          modulo: Constants.MODULO,
          idArchivo: element.nuIdArchivo,
          idArchivoDetalle: element.nuIdArchivoDetalle,
        }
      });
    } else if(this.tipoArchivoVideo.includes(element.typeFile) ||
    this.tipoArchivoImage.includes(element.typeFile)){
      const dialogRef = this.dialog.open(AppViewDocumentsComponent, {
        disableClose: true,
        data: {
          modulo: Constants.MODULO,
          idArchivo: element.nuIdArchivo,
          idArchivoDetalle: element.nuIdArchivoDetalle,
        }
      });
    }

  }

  close() {
    this.dialogRef.close();
  }

}
