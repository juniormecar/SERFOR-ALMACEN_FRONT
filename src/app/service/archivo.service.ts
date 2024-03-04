import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { ResponseModel } from 'app/shared/models/response/response-model';
import { catchError } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class ArchivoService {

    private base: string = '';

    constructor(private http: HttpClient) {
      this.base = environment.urlProcesos + "/api/serfor/archivo";
    }

    errorHandler(error: HttpErrorResponse) {
      return observableThrowError(error || 'SERVER ERROR');
    }

    cargarArchivoGeneralCodRecurso(idUsuario: number, tipoDocumento: string, idRecurso:number, idRecursoProducto: number, codigo: string, archivo: File): Observable<ResponseModel<number>> {
    let idRecursoString = "";
    let idRecursoProductoString = "";
    const uri = `${this.base}/cargarArchivoGeneralCodRecurso`;
    if(idRecurso != null && idRecurso != 0){
      idRecursoString = String(idRecurso);
    } 

    if(idRecursoProducto != null && idRecursoProducto != 0){
      idRecursoProductoString = String(idRecursoProducto);
    } 

    const params = new HttpParams()
        .set('IdUsuarioCreacion', String(idUsuario))
        .set('TipoDocumento', tipoDocumento)
        .set('idRecursoProducto', idRecursoProductoString)
        .set('idRecurso', idRecursoString)
        .set('codigo', codigo);

    const body = new FormData();
    body.append("file", archivo);

    return this.http.post<ResponseModel<number>>(uri, body, { params, reportProgress: true });

    }

    descargarArchivoGeneral(params: any) {
      return this.http.post(`${this.base}/DescargarArchivoGeneral`, params);
    }

    eliminarArchivoGeneral(params: any) {
      return this.http.post(`${this.base}/eliminarArchivo`, params);
    }

    cargarArchivoGeneral(idUsuario: number, tipoDocumento: string,  codigo: string, archivo: File): Observable<ResponseModel<number>> {
      const uri = `${this.base}/cargarArchivoGeneral`;
  
      const params = new HttpParams()
          .set('IdUsuarioCreacion', String(idUsuario))
          .set('TipoDocumento', tipoDocumento)
          .set('codigo', codigo);
  
      const body = new FormData();
      body.append("file", archivo);
  
      return this.http.post<ResponseModel<number>>(uri, body, { params, reportProgress: true });
  
    }

    listarMultiplesArchivosGeneral(nuIdArchivo: number, nuIdArchivoDet: number) {
      let uri = `${this.base}/listarMultiplesArchivosGeneral?nuIdArchivo=${nuIdArchivo}`;

      if (nuIdArchivoDet) {
        uri += `&nuIdArchivoDet=${nuIdArchivoDet}`
      }  
      return this.http.get(uri);
      //return this.http.get<ResponseModel<number>>((uri)).pipe(catchError(this.errorHandler));
    }

    eliminarMultiplesArchivos(params: any) {
      return this.http.put(`${this.base}/eliminarMultiplesArchivos`, params);
    }

    cargarMultipleArchivoGeneral(parameters: any, archivo: File): Observable<ResponseModel<number>> {
      const uri = `${this.base}/cargarMultipleArchivoGeneral`;

      const params = new HttpParams()
      .set('IdUsuarioCreacion', String(parameters.idUsuario))
      .set('TipoDocumento', parameters.tipoDocumento)
      .set('codigo', parameters.codigo)
      .set('nuIdArchivo', String(parameters.nuIdArchivo));

      const body = new FormData();
      body.append("file", archivo);
  
      return this.http.post<ResponseModel<number>>(uri, body, { params, reportProgress: true });
  
    }
}