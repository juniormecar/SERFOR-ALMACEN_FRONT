import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PideService {

  base = `${environment.urlServiciosExternos}api/pide/`;

  constructor(private http: HttpClient,) { }

  consultarDNI(params: any) {
    //console.log('base ',`${this.base}consultarDNI`)
    //console.log('params ',params)
    return this.http.post(`${this.base}consultarDNI`, params );
  }

  consultarRazonSocial(params: any) {
    return this.http.post(`${this.base}consultarDatoPrincipal`, params );
  }

  consultarDocumentoCE(params: any) {
    return this.http.post(`${this.base}consultarDocumentoCE`, params );
  }

  consultarProveedorVigente(params: any) {
    return this.http.post(`${this.base}consultarProveedorVigente`, params );
  }
}
