import { Component,Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { Kardex } from 'app/shared/models/kardex.model';
import { KardexService } from 'app/service/kardex.service';
import { Router } from "@angular/router";
import { AlmacenService } from 'app/service/almacen.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BeneficiarioComponent } from 'app/main/transferencia/beneficiario/beneficiario.component';
import { AlmacenComponent } from 'app/main/transferencia/almacen/almacen.component';
import { DevolucionesComponent } from 'app/main/transferencia/devoluciones/devoluciones.component';
import { Recurso } from 'app/shared/models/recurso.model';
import { RecursoService } from 'app/service/recurso.service';
import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { BajasComponent } from '../bajas/bajas.component';
import { ActaService } from 'app/service/acta.service';


interface DialogData{  
  data: any[];
  idAlmacen: number;
}
@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.scss']
})
export class SalidasComponent implements OnInit {

  dataSource = new MatTableDataSource<Kardex>([]);
  selection = new SelectionModel<Kardex>(true, []);
  recursoResponse: BandejaRecursoResponse = new BandejaRecursoResponse();
  consolidadoActa: any = null;
  //idAlmacen: any;
  
  
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private kardexService: KardexService,
    private almacenService: AlmacenService,
    public _router: Router,
    public _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData,
    public _dialogRef: MatDialogRef<SalidasComponent>,
    private _recursoService: RecursoService,
    private actaService: ActaService,

    ) {
 this._fuseConfigService.config = {
       layout: {
         navbar: {
           hidden: false
         },
         toolbar: {
           hidden: true
         },
         footer: {
           hidden: true
         },
         sidepanel: {
           hidden: true
         }
       }
     };
     this.recursoResponse.pageNumber = 1;
    this.recursoResponse.pageSize = 10;
  }

  ngOnInit(): void {
    //console.log("_data",this._data.data);
  }
  
  openDialogBeneficiario(){
      const dialogRef = this._dialog.open(BeneficiarioComponent, {
        width: '1000px',
        height: '820px',
        data: { idAlmacen: this._data.idAlmacen, data: this._data.data  }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result == 1) {          
          this.getRecursos(this._data.idAlmacen);
          this.close();
        }
      })
    }

    openDialogAlmacen(){
      const dialogRef = this._dialog.open(AlmacenComponent, {
        width: '1000px',
        height: '730px',
        data: { data: this._data.data, idAlmacen: this._data.idAlmacen }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result == 1) {          
          //window.location.reload();
          this.getRecursos(this._data.idAlmacen);
          this.close();
        }
      })
    }
    getRecursos(idAlmacen: any) {
      this.dataSource = new MatTableDataSource<Recurso>([])
      this._recursoService.getRecursoSearchVerProductos(null, null, null, null,null, idAlmacen,null,null,null,null,null,null,null,null,null,
        null,null,this.recursoResponse.pageNumber, this.recursoResponse.pageSize,'DESC')
        .subscribe((response: BandejaRecursoResponse) => {
  
  
          this.dataSource = new MatTableDataSource<Recurso>(response.data)
          //console.log("getRecursos", this.dataSource);
        })
    }
    openDialogDevolucion(){
      const dialogRef = this._dialog.open(DevolucionesComponent, {
        width: '1000px',
        height: '660px',
        data: { idAlmacen: this._data.idAlmacen, data: this._data.data  }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result == 1) {          
          this.getRecursos(this._data.idAlmacen);
          this.close();
        }
      })
    }
    openDialogBajas(){
      const dialogRef = this._dialog.open(BajasComponent, {
        width: '1000px',
        height: '640px',
        data: { idAlmacen: this._data.idAlmacen, data: this._data.data  }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result == 1) {          
          this.getRecursos(this._data.idAlmacen);
          this.close();
        }
      })
    }
    close() {
      //console.log("cerrar");
      this._dialogRef.close(-1);
    }
    
}
