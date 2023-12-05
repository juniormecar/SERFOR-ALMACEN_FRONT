import { Almacen } from '../shared/models/almacen.model';
import { AlmacenResponsable } from '../shared/models/almacen-responsable.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
//import {Urls} from '../../../components/common/util/constans';
import {catchError} from 'rxjs/operators';
import {Observable, throwError as observableThrowError} from 'rxjs';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
import { DeleteAlmacenResponse } from 'app/shared/models/response/delete-almacen-response';
import { CreateAlmacenResponse } from 'app/shared/models/response/create-almacen-response';
import { AlmacenResponsableResponse } from 'app/shared/models/response/almacen-responsable-response';
import { DeleteAlmacenResponsableResponse } from 'app/shared/models/response/delete-almacen-responsable-response';



@Injectable({ providedIn: 'root' })
export class AlmacenService {
  private base: string = '';

  constructor(private http: HttpClient) {
    this.base = environment.urlProcesos + "/api/serfor/almacen";
  }


  getAlmacenSearch(almacenRequest:Almacen, page: number, size: number): Observable<BandejaAlmacenResponse> {
    let url = `${this.base}?pageNumber=${page}&pageSize=${size}&sortType=DESC`;
    if (almacenRequest.txNumeroDocumento) {
      url += `&txNumeroDocumento=${almacenRequest.txNumeroDocumento}`
  }
    if (almacenRequest.txPuestoControl) {
        url += `&txPuestoControl=${almacenRequest.txPuestoControl}`
    }
    if (almacenRequest.txNumeroATF) {
        url += `&txNumeroATF=${almacenRequest.txNumeroATF}`
    }
    if (almacenRequest.txNombreAlmacen != '') {
        url += `&txNombreAlmacen=${almacenRequest.txNombreAlmacen}`
    }
    
    return this.http.get<BandejaAlmacenResponse>((url)).pipe(catchError(this.errorHandler));
}

getAlmacenResponsableSearch(almacenRequest:AlmacenResponsable, page: number, size: number): Observable<AlmacenResponsableResponse> {
  let url = `${this.base}/listarAlmacenResponsable?pageNumber=${page}&pageSize=${size}&sortType=DESC`;
  if (almacenRequest.nuIdAlmacen) {
    url += `&nuIdAlmacen=${almacenRequest.nuIdAlmacen}`
}
  if (almacenRequest.nombresResponsable) {
      url += `&txNombresEncargado=${almacenRequest.nombresResponsable}`
  }  
  
  return this.http.get<AlmacenResponsableResponse>((url)).pipe(catchError(this.errorHandler));
}

postAlmacen(request: Almacen) {
  let url = `${this.base}`;
  return this.http.post(url, request).pipe(catchError(this.errorHandler));
}

deleteAlmacen(nuIdAlmacen:number): Observable<DeleteAlmacenResponse> {
  let url = `${this.base}?nuIdAlmacen=${nuIdAlmacen}&nuIdUsuarioElimina=1`;
  return this.http.delete<DeleteAlmacenResponse>(url).pipe(catchError(this.errorHandler));
}

deleteAlmacenResponsable(idAlmacenResponsable:number): Observable<DeleteAlmacenResponsableResponse> {
  let url = `${this.base}/eliminarResponsable?idAlmacenResponsable=${idAlmacenResponsable}&idUsuarioElimina=1`;
  return this.http.delete<DeleteAlmacenResponsableResponse>(url).pipe(catchError(this.errorHandler));
}


errorHandler(error: HttpErrorResponse) {
  return observableThrowError(error || 'SERVER ERROR');
}

  registrarAlmacen = (params: any) => {
    //console.log("params", params);
    return this.http.post(
      this.base + 'api/serfor/almacen/rrhh/almacen',
      params
    );
  };

  listarAlmacen = (params: any) => {
    return this.http.get(
      this.base + 'api/serfor/almacen/rrhh/almacen',
      params
    );
  };
  
}