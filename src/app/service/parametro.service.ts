import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { Parametro } from 'app/shared/models/parametro.model';
import { TipoParametro } from 'app/shared/models/tipo-parametro.model';

@Injectable({
  providedIn: 'root'
})
export class ParametroService {
  private base: string = '';
  constructor(private http: HttpClient) {
    this.base = environment.urlProcesos + "/api/serfor/parametro";
  }

  postParametro(request: TipoParametro[]):Observable<any>{
    let url = `${this.base}`;
    return this.http.post(url, request).pipe(catchError(this.errorHandler));
}

  getParametroSearch(prefijo: string): Observable<Parametro[]> {
    let url = `${this.base}?prefijo=${prefijo}`;
    return this.http.get<Parametro[]>((url)).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error || 'SERVER ERROR');
  }


}
