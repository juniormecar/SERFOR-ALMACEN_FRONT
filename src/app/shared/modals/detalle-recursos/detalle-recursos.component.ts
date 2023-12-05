import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlmacenComponent } from 'app/main/transferencia/almacen/almacen.component';
import { BeneficiarioComponent } from 'app/main/transferencia/beneficiario/beneficiario.component';
import { DevolucionesComponent } from 'app/main/transferencia/devoluciones/devoluciones.component';
import { RecursoService } from 'app/service/recurso.service';
import { BandejaProductoResponse } from 'app/shared/models/response/producto-response';
import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { Recurso } from 'app/shared/models/recurso.model';


interface DialogData{
  id: number;
  recurso:Recurso;
  idAlmacen: number;
}

@Component({
  selector: 'app-detalle-recursos',
  templateUrl: './detalle-recursos.component.html',
  styleUrls: ['./detalle-recursos.component.scss']
})

export class DetalleRecursosComponent implements OnInit {


  dataSource: any[]=[];// = new MatTableDataSource<Producto>([]);
  recursoResponse: BandejaProductoResponse = new BandejaProductoResponse();
  displayedColumns: string[] = ['position', 'nombreCientifico', 'nombreComun', 'tipo','cantidad','unidadMedida'];
  idRecurso: number;

  constructor(
    public _dialogRef: MatDialogRef<DetalleRecursosComponent>,
    private _recursoService: RecursoService,
    public _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) {       
    this.recursoResponse.page = 1;
    this.recursoResponse.size = 5;
  }

  ngOnInit(): void {
    this.idRecurso = this._data.id;
    //console.log("recurso ",this._data.recurso)
    this.getRecursosEspecies(this._data.id);
    
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.recursoResponse.page = e.pageIndex;
     this.recursoResponse.size = e.pageSize;
     //this.getRecursos(this.idAlmacen);
     this.getRecursosEspecies(this._data.id)
     return e;
   }

   getRecursosEspecies(idRecurso: any) {

    //console.log("idAlmacen-getRecursosEspecies",idRecurso);
       
    this.dataSource = []; //= new MatTableDataSource<Recurso>([])

    this._recursoService.getRecursoEspeciesSearch(null, idRecurso,
    this.recursoResponse.page,this.recursoResponse.size)
    .subscribe((response:any)=>{
    this.dataSource = response.data;
    //console.log("response-getRecursosEspecies",response.data);
    })
  }

  openDialogBeneficiario(id: number): void{
    const dialogRef = this._dialog.open(BeneficiarioComponent, {
      width: '1100px',
      height: '950px',
      data: { id: id, data: this.dataSource , recurso:this._data.recurso}
    });
    dialogRef.afterClosed().subscribe( result => {
      if(result != null && result == 1){
        this.getRecursosEspecies(this._data.id);
      }
    })
  }

  openDialogAlmacen(id: number): void{
    const dialogRef = this._dialog.open(AlmacenComponent, {
      width: '1100px',
      height: '700px',
      data: { id: id, data: this.dataSource, idAlmacen: this._data.idAlmacen }
    });
    dialogRef.afterClosed().subscribe( result => {
      if(result != null && result == 1){
        this.getRecursosEspecies(this._data.id);
      }
    })
  }

  
  openDialogDevoluciones(id: number): void{
    const dialogRef = this._dialog.open(DevolucionesComponent, {
      width: '1100px',
      height: '950px',
      data: { id: id, data: this.dataSource, recurso:this._data.recurso }
    });
    dialogRef.afterClosed().subscribe( result => {
      if(result != null && result == 1){
        this.getRecursosEspecies(this._data.id);
      }
    })
  }

}
