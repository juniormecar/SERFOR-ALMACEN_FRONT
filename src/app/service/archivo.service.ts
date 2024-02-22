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

    cargarArchivoGeneralCod(idUsuario: number, tipoDocumento: string, idRecursoProducto: number, codigo: string, archivo: File): Observable<ResponseModel<number>> {

    const uri = `${this.base}/cargarArchivoGeneralCod`;

    const params = new HttpParams()
        .set('IdUsuarioCreacion', String(idUsuario))
        .set('TipoDocumento', tipoDocumento)
        .set('idRecursoProducto', String(idRecursoProducto))
        .set('codigo', codigo);

    const body = new FormData();
    body.append("file", archivo);

    return this.http.post<ResponseModel<number>>(uri, body, { params, reportProgress: true });

    }

    descargarArchivoGeneral(params: any) {
      return this.http.post(`${this.base}/DescargarArchivoGeneral`, params);
    }

}