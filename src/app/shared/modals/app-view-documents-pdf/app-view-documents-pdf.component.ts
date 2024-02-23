import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ArchivoService } from 'app/service/archivo.service';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
//import { NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';


@Component({
  selector: 'app-app-view-documents-pdf',
  templateUrl: './app-view-documents-pdf.component.html',
  styleUrls: ['./app-view-documents-pdf.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppViewDocumentsPdfComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoadingDownload: boolean = false;
  dataFile: Uint8Array = null;
  form: FormGroup;
  nameFile: string = 'documents.pdf';
  
  pdfSrc :string = "";  
  archivoString :string = "";
  showArchivoRecurso: boolean = false;

  isShowModal2_2:boolean=false;

  
  constructor(
      public dialogRef: MatDialogRef<AppViewDocumentsPdfComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      //private _serviceAccount: AccountService,
      private _formBuilder: FormBuilder,
      public dialog: MatDialog,
      private _changeDetectorRef: ChangeDetectorRef,
      private _servicioArchivo: ArchivoService
  ) { }

  ngOnInit(): void {
    this.verPDF();
  }
  
  ngOnDestroy(): void
  {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  /*downloadViewDocuments(){

    this.isLoadingDownload = true;
    this._serviceAccount.getViewDocumentsCtsPdf(this.data.id,this.data.modulo)
    .subscribe((event) => {
      if (event.type === HttpEventType.DownloadProgress){
      }else if (event.type === HttpEventType.Response) {
        this.isLoadingDownload = false;
        const format = new Blob([event.body], { type: event.body.type });
          this.blobToUint8Array(format).then(res => {
            this.dataFile = res as Uint8Array;
            this._changeDetectorRef.markForCheck();
          });
        }
    },
    (error: HttpErrorResponse) => {
      console.log(error);
      this.isLoadingDownload = false;
      this.openMessage('Aviso', 'Ocurrió un problema. Vuelva a intentarlo.', 'error');
    });
  }*/
  
  /*blobToUint8Array(file: any){
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as ArrayBuffer);
      reader.readAsArrayBuffer(file);
    });
  }*/

  /*openMessage(title: string, message: string, type: 'success' | 'warning' | 'error') {
    const dialogOpen = this.dialog.open(ActionMessageComponent, {
      disableClose: true,
      data: {
        title: title,
        message: message,
        type: type
      }
    });
  }*/

  downloadViewDocuments(){     
     console.log("aqui llegamos")
    this.blobToUint8Array().then(res => {
      console.log("res", res)
      this.dataFile = res as Uint8Array;
      this._changeDetectorRef.markForCheck();
    });
  }
  blobToUint8Array(){
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as ArrayBuffer);
      const file = this.base64toBlob(this.data.document, 'application/pdf');
      console.log("file", file)
      reader.readAsArrayBuffer(file);
    });

  }

  verPDF(){

    this.isShowModal2_2 = true;
    //this.pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    var params = {
      idArchivo: this.data.idArchivo
    };

    this._servicioArchivo.descargarArchivoGeneral(params)
      .pipe(finalize(() => this.dialog.closeAll()))
      .subscribe((result: any) => {

        console.log("result.data", result.data);
        if(result.data){
          let reader = new FileReader();
          reader.onload = (e:any) => {
            this.pdfSrc = e.target.result;
          }
          console.log("this.pdfSrc", this.pdfSrc);
          const blob = this.base64toBlob(result.data.archivo, 'application/pdf')
          reader.readAsArrayBuffer(blob);
        }

      });


  }

  base64toBlob(base64Data:any, contentType:any) {
    
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
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
