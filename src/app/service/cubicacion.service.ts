import { Almacen } from '../shared/models/almacen.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
//import {Urls} from '../../../components/common/util/constans';
import {catchError} from 'rxjs/operators';
import {Observable, throwError as observableThrowError} from 'rxjs';
import { Cubicacion } from 'app/shared/models/cubicacion.model';
import { CubicacionResponse } from 'app/shared/models/response/cubicacion-response';
import { DeleteCubicacionResponse } from 'app/shared/models/response/delete-recurso-response';

@Injectable({
  providedIn: 'root'
})
export class CubicacionService {

  private base: string = '';

  constructor(private http: HttpClient) {
    this.base = environment.urlProcesos + "/api/serfor/cubicacion";
  }

  getRecursoProductoCubicacion(nuIdRecursoProducto: any, pageNumber: number, pageSize: number): Observable<CubicacionResponse> {
    
    let url = `${this.base}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortType=DESC`;

    if (nuIdRecursoProducto) {
      url += `&nuIdRecursoProducto=${nuIdRecursoProducto}`

    }
    // else if (idAlmacen != undefined) {
    //   url += `&nuIdAlmacen=${idAlmacen}`
    // }
    return this.http.get<CubicacionResponse>((url)).pipe(catchError(this.errorHandler));
  }

  postRecurso(request: Cubicacion[]):Observable<any> {
    let url = `${this.base}`;
    return this.http.post<any>(url, request).pipe(catchError(this.errorHandler));
  }

  deleteCubicacion(idRecurProCubicacion:number): Observable<DeleteCubicacionResponse> {
    let url = `${this.base}?idRecurProCubicacion=${idRecurProCubicacion}&idUsuarioElimina=1`;
    return this.http.delete<DeleteCubicacionResponse>(url).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error || 'SERVER ERROR');
  }
}
