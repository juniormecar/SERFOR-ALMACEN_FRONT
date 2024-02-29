import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfigService } from '@fuse/services/config.service';
import { ReportesService } from 'app/service/reportes.service';
import { Reportes } from 'app/shared/models/reportes.model';
import { ReportesResponse } from 'app/shared/models/response/reportes-response';
import Swal from 'sweetalert2';
import { TransferenciaService } from 'app/service/transferencia.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';

interface DialogData {
  nroActa:string,
  nuIdTransferencia:number,
  titulo:string
}
@Component({
  selector: 'app-modal-detalle-egreso',
  templateUrl: './modal-detalle-egreso.component.html',
  styleUrls: ['./modal-detalle-egreso.component.scss']
})
export class ModalDetalleEgresoComponent implements OnInit {
  dataSource = new MatTableDataSource<Reportes>([]);
  displayedColumns: string[] = ['tipoEspecie','nombreCientifico','nombreComun','nroActa','tipoIngreso','cantidad','unidadMedida','descontar','metroCubico','descontarMetroCubico','flagAgregar','cantidadRetornada','cantidadM3Retornada'];
  reportesResponse: ReportesResponse = new ReportesResponse();
  reportesRequest:  Reportes = new Reportes();
  resultsLength = 0;
  cantidadVacia = 0;
  descontarMayor = 0;
  inputDetalle: FormGroup;  
  constructor(
    public dialogRef: MatDialogRef<ModalDetalleEgresoComponent>,
    private _fuseConfigService: FuseConfigService,
    private _reportesService: ReportesService,
    private serviceTransferencia: TransferenciaService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { 
    this.reportesResponse.pageNumber = 1;
    this.reportesResponse.pageSize = 10;
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
    this.inputDetalle = this._formBuilder.group({
      numeroActaRetorno: ['', Validators.required],
    });  
  }

  ngOnInit(): void {
    this.SearchReportes();
    console.log('data',this.data);
  }

  async SearchReportes() {

    this.dataSource = new MatTableDataSource<Reportes>([]);
    this.reportesRequest.tipo =  'D';
    this.reportesRequest.nroActa =  this.data.nroActa;
    this.reportesRequest.nuIdTransferencia =  this.data.nuIdTransferencia;
    this._reportesService.getReporteSalidas(this.reportesRequest,this.reportesResponse.pageNumber,this.reportesResponse.pageSize).subscribe((response:ReportesResponse)=>{
      if(response.success){
        this.reportesResponse = response;
        this.dataSource = new MatTableDataSource<Reportes>(response.data);
        this.resultsLength=response.totalRecords;
        this.reportesResponse.totalRecords = response.data.length;
      }
    })
  }

  pageDataSource(e: PageEvent): PageEvent {
    this.reportesResponse.pageNumber = e.pageIndex + 1;
    this.reportesResponse.pageSize = e.pageSize;
    this.SearchReportes();
    return e;
  }
  
  close() {
    this.dialogRef.close(-1);
  }

  retornar(){

    

    let dataFilteredGrilla = this.dataSource.filteredData.filter((t: any) => t.flagAgregar === true);   
    console.log('dataFilteredGrilla.length',dataFilteredGrilla.length);
    if((dataFilteredGrilla.length === 0)){}
    else{

    let dataFilteredSinCero = dataFilteredGrilla;      
    dataFilteredSinCero.forEach((df: any) => {
        if ((!df.descontar)) {
          this.cantidadVacia = 1;          
        }
        else if ((df.descontar > df.cantidadProducto)) {
          this.descontarMayor = 1;              
        }
       
      });

      if(this.cantidadVacia === 1){
        this.cantidadVacia = 0;        
        Swal.fire({
          title: 'Alerta!',
          text: "Descontar no debe ser cero o vacío.",
          icon: 'warning',
          //showCancelButton: true,
          confirmButtonColor: '#679738',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancelar'
        })
      }
      else if(this.descontarMayor === 1){
        this.descontarMayor = 0;        
        Swal.fire({
          title: 'Alerta!',
          text: "Descontar no debe ser mayor que Cantidad.",
          icon: 'warning',
          //showCancelButton: true,
          confirmButtonColor: '#679738',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancelar'
        })}  
      else{

        let dataFiltered: Reportes[] = [];
        let dataFilteredGrilla = this.dataSource.filteredData.filter((t: any) => t.flagAgregar === true);

        
        console.log('dataFilteredGrilla',dataFilteredGrilla);

        dataFiltered = dataFilteredGrilla;

        let paramsList = [];
        //console.log("this.dataSource ", this.dataSource)
        dataFiltered.forEach( ds =>{
          //console.log("ds ",ds)
          let params = {            
            nuIdTransferencia: ds.nuIdTransferencia,
            nuIdRecurso: ds.nuIdRecurso,
            idEspecie: ds.idEspecie,
            cantidadProducto: ds.cantidadProducto,
            descontar: ds.descontar, 
            metroCubico: ds.metroCubico,
            descontarMetroCubico: ds.descontarMetroCubico, 
            nuIdAlmacenOrigin: ds.nuIdAlmacenOrigin,
            nuIdAlmacenDestino: ds.nuIdAlmacen,
            nroActaTraslado: ds.nroActa,          
            tipoTransferencia: ds.tipoTransferencia,
            tipoEspecie: ds.tipoEspecie,
            nombreComun: ds.nombreComun,
            nombreCientifico: ds.nombreCientifico,
            numeroActaRetorno: this.inputDetalle.get('numeroActaRetorno').value
          }
          paramsList.push(params);
          console.log('paramsList',paramsList);
        });

        if(paramsList.length > 0){
          this.serviceTransferencia.postRetorno(paramsList).subscribe((response: any) => {
            if (response.data && response.data[0].nuIdRecurso) {
              Swal.fire({
                title: 'Mensaje de Confirmación',
                text: "Retorno realizado correctamente.",
                icon: 'success',
                //showCancelButton: true,
                confirmButtonColor: '#679738',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancelar'
              })
            this.dialogRef.close(1);
            } else {
              Swal.fire(
                'Mensaje!',
                'Error inesperado al generar el retorno.  ',
                'error'
              )
            }
          }, error => {
            //console.log("error ",error)
          })
        } else{
          Swal.fire(
            'Mensaje!',
            'No se seleccionó recursos. ',
            'error'
          )
        }
      }
    }
  }

}
