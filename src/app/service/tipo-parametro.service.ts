import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TipoParametroResponse } from "app/shared/models/response/tipo-parametro-reponse";
import { TipoParametro } from "app/shared/models/tipo-parametro.model";
import { environment } from "environments/environment";
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

  export class TipoParametroService {

    private base: string = '';
    constructor(private http: HttpClient) {
      this.base = environment.urlProcesos + "/api/serfor/parametro";
    }
  
  
    getATFSearch(atfRequest:TipoParametro, page: number, size: number): Observable<TipoParametroResponse> {
      let url = `${this.base}/listarTipoParametro?pageNumber=${page}&pageSize=${size}&sortType=DESC`;
      return this.http.get<TipoParametroResponse>((url)).pipe(catchError(this.errorHandler));
    }
  
    errorHandler(error: HttpErrorResponse) {
      return observableThrowError(error || 'SERVER ERROR');
    }
  
  }