import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ArchivoService } from 'app/service/archivo.service';

@Component({
  selector: 'app-app-view-documents-pdf',
  templateUrl: './app-view-documents-pdf.component.html',
  styleUrls: ['./app-view-documents-pdf.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppViewDocumentsPdfComponent implements OnInit {

  isLoadingDownload: boolean = false;
  
  pdfSrc :string = "";
  imageSrc :string = "";  

  isShowModal2_2:boolean=false;
  isImage: boolean=false;

  constructor(
      public dialogRef: MatDialogRef<AppViewDocumentsPdfComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      //private _serviceAccount: AccountService,
      public dialog: MatDialog,
      private _servicioArchivo: ArchivoService  ) { }

  ngOnInit(): void {
    this.verPDF();
  }

  verPDF(){
    this.isShowModal2_2 = true;
    //this.pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    var params = {
      idArchivo: this.data.idArchivo
    };

    this._servicioArchivo.descargarArchivoGeneral(params)
      .pipe()
      .subscribe((result: any) => {

        if(result.data){
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.pdfSrc = e.target.result;

          };
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

  close() {
    this.dialogRef.close();
  }

  accept() {
    this.dialogRef.close();
  }
}
