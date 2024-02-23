import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseModel } from 'app/shared/models/response/response-model';


@Injectable({ providedIn: 'root' })
export class ArchivoService {

    private base: string = '';

    constructor(private http: HttpClient) {
      this.base = environment.urlProcesos + "/api/serfor/archivo";
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
}