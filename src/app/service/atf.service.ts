import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { ATF } from 'app/shared/models/atf.model';
import { AtfResponse } from 'app/shared/models/response/atf-response';

@Injectable({
  providedIn: 'root'
})
export class AtfService {

  private base: string = '';
  constructor(private http: HttpClient) {
    this.base = environment.urlProcesos + "/api/serfor/Atf";
  }

  deleteAtf(idAtf:number): Observable<AtfResponse> {
    let url = `${this.base}/eliminarATF?idAtf=${idAtf}&nuIdUsuarioElimina=1`;
    return this.http.delete<AtfResponse>(url).pipe(catchError(this.errorHandler));
  }

  postAtf(request: ATF) {
    let url = `${this.base}/registrarATF`;
    return this.http.post(url, request).pipe(catchError(this.errorHandler));
  }

  getATFSearch(atfRequest:ATF, page: number, size: number): Observable<AtfResponse> {
    let url = `${this.base}?pageNumber=${page}&pageSize=${size}&sortType=DESC`;
    return this.http.get<AtfResponse>((url)).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error || 'SERVER ERROR');
  }

}
