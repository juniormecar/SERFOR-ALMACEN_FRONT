import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { EspecieResponse } from 'app/shared/models/response/especie-response';
import { FaunaResponse } from 'app/shared/models/response/fauna-response';

@Injectable({
  providedIn: 'root'
})
export class CoreCentralService {

  urlSeguridad = environment.urlSeguridad;
  urlCoreCentralNew = environment.urlNewCoreCentral;
  constructor(private http: HttpClient) {
  }

/*  getForestalSearch(name: string, page: number, size: number): Observable<EspecieResponse> {
    let url = `${this.base}/listarForestal?pageNumber=${page}&pageSize=${size}`;
    if (name) {
      //url += `&nombreComun=${name}`
      url += `&nombreCientifico=${name}`
    } 
    return this.http.get<EspecieResponse>((url)).pipe(catchError(this.errorHandler));
  }*/

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error || 'SERVER ERROR');
  }

  getToken(dato: any) {
    return this.http.post(
      this.urlSeguridad + `api/autenticacion/token`,
      dato
    );
  }

  getTokenNew(dato: any) {
    return this.http.post(
      this.urlCoreCentralNew + `auth/token`,
      dato
    );
  }



  ListaPorFiltroEspecieForestalNew(tipo: any,token:string){
    const options = {
      headers: new HttpHeaders({ 'Authorization': token })
    }
  return this.http.post(
    this.urlCoreCentralNew + `especie/allEspecieForestMaderable?tipo=${tipo}`,
    options
  );
}

ListaPorFaunaNew(tipo: any,token:string){
  const options = {
    headers: new HttpHeaders({ 'Authorization': token })
  }
return this.http.post(
  this.urlCoreCentralNew + `especie/allEspecie?tipo=${tipo}`,
  options
);
}


}
