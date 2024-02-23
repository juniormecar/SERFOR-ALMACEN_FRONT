import { ActaIntervencion } from '../shared/models/acta-intervencion.model';
import { HttpClient,HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
//import {Urls} from '../../../components/common/util/constans';
import {catchError} from 'rxjs/operators';
import {Observable, throwError as observableThrowError} from 'rxjs';
import { CreateActaResponse } from 'app/shared/models/response/acta-response';




@Injectable({ providedIn: 'root' })
export class ActaService {
  private base: string = '';

  constructor(private http: HttpClient) {
    this.base = environment.urlProcesos + "/api/serfor/acta";
  }

postActa(request: ActaIntervencion) {
  let url = `${this.base}`;
  return this.http.post(url, request).pipe(catchError(this.errorHandler));
}

getActa(idRecurso: Number) {
  let url = `${this.base}?nuIdRecurso=${idRecurso}`;
  return this.http.get(url).pipe(catchError(this.errorHandler));
}

consolidadoActa(idRecurso: number) {
  const params = new HttpParams().set('idRecurso', String(idRecurso));
  return this.http.get(`${this.base}/pdf/acta`, { params });
}

consolidadoActaSalida(request: any) {
  let url = `${this.base}/pdf/actaSalida`;
  return this.http.post(url, request).pipe(catchError(this.errorHandler));
}

errorHandler(error: HttpErrorResponse) {
  return observableThrowError(error || 'SERVER ERROR');
}
  
}