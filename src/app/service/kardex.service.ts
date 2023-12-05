import { Almacen } from '../shared/models/almacen.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
//import {Urls} from '../../../components/common/util/constans';
import {catchError} from 'rxjs/operators';
import {Observable, throwError as observableThrowError} from 'rxjs';
import { KardexResponse } from 'app/shared/models/response/kardex-response';
import { Kardex } from 'app/shared/models/kardex.model';
import { CreateRecursoResponse } from 'app/shared/models/response/create-recurso-response';

@Injectable({ providedIn: 'root' })
export class KardexService {
  private base: string = '';

  constructor(private http: HttpClient) {
    this.base = environment.urlProcesos + "/api/serfor/historial";
  }

getKardexSearch(idAlmacen: number,nombreEspecie: string,tipoProducto: string,tipoIngreso: string,disponible:string, pageNumber: number, pageSize: number): Observable<KardexResponse> {        
    let url = `${this.base}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortType=DESC`;
     

if(idAlmacen != undefined){
        url += `&nuIdAlmacen=${idAlmacen}`
}
if(nombreEspecie){
  url += `&nombreEspecie=${nombreEspecie}`
}
if(tipoProducto){
  url += `&tipoProducto=${tipoProducto}`
}
if(tipoIngreso){
  url += `&tipoIngreso=${tipoIngreso}`
}
if(disponible){
  url += `&disponible=${disponible}`
}
    
    return this.http.get<KardexResponse>((url)).pipe(catchError(this.errorHandler));
}


errorHandler(error: HttpErrorResponse) {
  return observableThrowError(error || 'SERVER ERROR');
}

}