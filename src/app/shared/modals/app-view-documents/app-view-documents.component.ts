import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ArchivoService } from 'app/service/archivo.service';

@Component({
  selector: 'app-app-view-documents',
  templateUrl: './app-view-documents.component.html',
  styleUrls: ['./app-view-documents.component.scss']
})
export class AppViewDocumentsComponent implements OnInit {

  isLoadingDownload: boolean = false;
  
  pdfSrc :string = "";
  imageSrc :string = "";
  videoSrc :string = "";

  isShowModal2_2:boolean=false;
  isImage: boolean=false;
  isVideo: boolean=false;
  isVacio: boolean=false;

  tipoArchivoTablaCod: string[] = ["application/pdf", "image/png","image/jpg","video/mp4"];
  tipoArchivoImage: string[] = ["image/png","image/jpg","image/jpeg"];
  tipoArchivoVideo: string[] = ["video/mp4"];


  constructor(
      public dialogRef: MatDialogRef<AppViewDocumentsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialog: MatDialog,
      private _servicioArchivo: ArchivoService,
  ) { }

  ngOnInit(): void {
    this.verDocument();
  }

  verDocument(){
    var params = {
      idArchivo: this.data.idArchivo
    };

    this._servicioArchivo.descargarArchivoGeneral(params)
      .pipe()
      .subscribe((result: any) => {
        if(result.data){
          console.log("result.data",result.data)
          if(result.data.typeFile != null && result.data.typeFile != undefined && result.data.typeFile != ''){
            if(this.tipoArchivoImage.includes(result.data.typeFile)){
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.imageSrc = e.target.result;
              };
              this.isImage = true;
              this.imageSrc = 'data:image/png;base64,' + result.data.archivo;

            } else if (this.tipoArchivoVideo.includes(result.data.typeFile)) {
              this.isVideo = true;
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.videoSrc = e.target.result;
              };
              const blob = this.base64toBlob(result.data.archivo, result.data.typeFile )
              reader.readAsDataURL(blob);
            }
            else{
              this.isVacio = true;
            }
          }
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
