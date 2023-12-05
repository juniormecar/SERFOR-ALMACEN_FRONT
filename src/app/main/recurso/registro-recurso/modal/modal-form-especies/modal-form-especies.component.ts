import { Component, OnInit, ViewChild } from '@angular/core';
import { Especie } from 'app/shared/models/especie.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialogRef } from '@angular/material/dialog';
import { CoreCentralService } from 'app/service/core-central.service';
import { EspecieResponse } from 'app/shared/models/response/especie-response';
import { finalize } from 'rxjs/operators';
import { Token } from 'app/shared/models/token.model';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { EspecieRequest } from 'app/shared/models/request/flora';

@Component({
  selector: 'app-modal-form-especies',
  templateUrl: './modal-form-especies.component.html',
  styleUrls: ['./modal-form-especies.component.scss']
})
export class ModalFormEspeciesComponent implements OnInit {
  listEspecies: Especie[] = [];
  listEspeciesSeleccionados: Especie[] = [];
  dataSource = new MatTableDataSource<Especie>(this.listEspecies);
  displayedColumns = ['action', 'nameCientifico', 'nameComun', 'family'];
  selection = new SelectionModel<Especie>(true, []);
  name: string = "";
  especieResponse: EspecieResponse = new EspecieResponse();
  resultsLength = 0;
  token: string;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public shops: Array<any> = []; //Listado de tiendas

  public page: Number = 1; //Número de página en la que estamos. Será 1 la primera vez que se carga el componente

  public totalPages: Number; //Número total de páginas

  public numShops: number; //Total de tiendas existentes

  private numResults: number = 10;

  constructor(
    public dialogRef: MatDialogRef<ModalFormEspeciesComponent>,
    private coreCentralService: CoreCentralService,
  ) {

    this.especieResponse.page = 1;
    this.especieResponse.size = 5;

  }

  ngOnInit(): void {
    this.especieResponse.page = 1;
    this.especieResponse.size = 5;
    this.getToken();
  }

  isSelectedTotal(row: Especie) {

    let validate = false;
    //console.log("row ", row);
    //console.log("include ", this.listEspeciesSeleccionados.includes(row));
    const index = this.listEspeciesSeleccionados.indexOf(row, 0);
    if (this.listEspeciesSeleccionados.includes(row)) {
      this.listEspeciesSeleccionados.splice(index, 1);
    } else {
      this.listEspeciesSeleccionados.push(row);
    }

    //console.log('this.listEspeciesSeleccionados ', this.listEspeciesSeleccionados);
    return;
  }

  close() {
    this.dialogRef.close(-1);
  }

  accept() {
    this.dialogRef.close(this.listEspeciesSeleccionados);
  }

  getToken() {

    let obj: Token = new Token();
    obj.codigoAplicacion = "MC";
    obj.mensaje = "string";
    obj.origen = "1";
    obj.password = "123";
    obj.passwordNew = "string";
    obj.requiereCambioContrasenia = "true";
    obj.token = "string";
    obj.tokenRecaptcha = "string";
    obj.username = "SUPERADMIN";


    this.coreCentralService.getToken(obj)
      .pipe(finalize(() => this.Search()))
      .subscribe((response: any) => {
        this.token = response.token;
      })
  }

  async Search() {
   /* this.dataSource = new MatTableDataSource<Especie>([])

    let params = {};
    this.coreCentralService.ListaPorFiltroEspecieForestal(params, this.token).subscribe((response: EspecieResponse) => {
      response.page = this.especieResponse.page;
      response.size = this.especieResponse.size;
      //console.log("response ",response)
      this.especieResponse = response;
      this.especieResponse.totalRecords = response.data.length;
      let actual = this.especieResponse.page * this.especieResponse.size
      this.especieResponse.data = this.especieResponse.data.slice(
        actual,
        actual + this.especieResponse.size
      );
      this.dataSource = new MatTableDataSource<Especie>(this.especieResponse.data);
      this.resultsLength = response.data.length;
      this.numShops = response.data.length;
      this.totalPages = Math.round(this.numShops / this.numResults);

    })*/
  }


  pageDataSource(e: PageEvent): PageEvent {
    this.especieResponse.page = e.pageIndex + 1;
    this.especieResponse.size = e.pageSize;
    this.Search();
    return e;
  }

  goToPage(page: number) {

    this.page = page;

    this.Search();

  }
}
