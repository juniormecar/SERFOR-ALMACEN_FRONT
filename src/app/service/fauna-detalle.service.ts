import { Almacen } from '../shared/models/almacen.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
//import {Urls} from '../../../components/common/util/constans';
import { catchError } from 'rxjs/operators';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { Recurso } from 'app/shared/models/recurso.model';
import { CreateRecursoResponse } from 'app/shared/models/response/create-recurso-response';
import { DeleteRecursoResponse } from 'app/shared/models/response/delete-recurso-response';
import { RecursoProduco } from 'app/shared/models/recurso-producto.model';
import { FaunaDetalle } from 'app/shared/models/fauna-detalle.model';
import { FaunaDetalleResponse } from 'app/shared/models/response/fauna-detalle-response';
import { DeleteFaunaDetalleResponse } from 'app/shared/models/response/delete-recurso-response';

@Injectable({ providedIn: 'root' })
export class FaunaDetalleService {
  private base: string = '';

  constructor(private http: HttpClient) {
    this.base = environment.urlProcesos + "/api/serfor/faunaDetalle";
  }
 
  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error || 'SERVER ERROR');
  }  

  deleteFaunaDetalle(nuIdFaunaDetalle:number): Observable<DeleteFaunaDetalleResponse> {
    let url = `${this.base}?nuIdFaunaDetalle=${nuIdFaunaDetalle}&idUsuarioElimina=1`;
    return this.http.delete<DeleteFaunaDetalleResponse>(url).pipe(catchError(this.errorHandler));
  }
  postFaunaDetalle(request: FaunaDetalle[]):Observable<any> {
    let url = `${this.base}`;
    return this.http.post<any>(url, request).pipe(catchError(this.errorHandler));
  }
  getFaunaDetalle(nuIdRecursoProducto: any, pageNumber: number, pageSize: number): Observable<FaunaDetalleResponse> {
    
    let url = `${this.base}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortType=DESC`;

    if (nuIdRecursoProducto) {
      url += `&nuIdRecursoProducto=${nuIdRecursoProducto}`

    }
    // else if (idAlmacen != undefined) {
    //   url += `&nuIdAlmacen=${idAlmacen}`
    // }
    return this.http.get<BandejaRecursoResponse>((url)).pipe(catchError(this.errorHandler));
  }
}