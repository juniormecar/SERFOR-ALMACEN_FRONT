import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { catchError } from "rxjs/operators";
import {Observable, throwError as observableThrowError} from 'rxjs';
import { ReportesResponse } from 'app/shared/models/response/reportes-response';
import { Reportes } from '../shared/models/reportes.model';

@Injectable({ providedIn: 'root' })
export class ReportesService {

    private base: string = '';

    constructor(private http: HttpClient) {
      this.base = environment.urlProcesos + "/api/serfor/reportes";
    }

    postTransferencia(request: any) {
        let url = `${this.base}`;
        return this.http.post(url, request).pipe(catchError(this.errorHandler));
    }

    errorHandler(error: HttpErrorResponse) {
        return observableThrowError(error || 'SERVER ERROR');
    }

    getReportesAvanzadosSearch(reportesRequest:Reportes, page: number, size: number): Observable<ReportesResponse> {
        let url = `${this.base}/avanzados?pageNumber=${page}&pageSize=${size}&sortType=DESC`;
        if (reportesRequest.nuIdAlmacen) {
          url += `&nuIdAlmacen=${reportesRequest.nuIdAlmacen}`
      }
        if (reportesRequest.tipoTransferencia) {
            url += `&tipoTransferencia=${reportesRequest.tipoTransferencia}`
        }        
        
        return this.http.get<ReportesResponse>((url)).pipe(catchError(this.errorHandler));
    }

}