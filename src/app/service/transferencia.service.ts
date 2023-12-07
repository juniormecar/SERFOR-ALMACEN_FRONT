import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { catchError } from "rxjs/operators";
import {Observable, throwError as observableThrowError} from 'rxjs';
import { TransferenciaResponse } from 'app/shared/models/response/transferencia-response';


@Injectable({ providedIn: 'root' })
export class TransferenciaService {

    private base: string = '';

    constructor(private http: HttpClient) {
      this.base = environment.urlProcesos + "/api/serfor/transferencia";
    }

    postTransferencia(request: any) {
        let url = `${this.base}`;
        return this.http.post(url, request).pipe(catchError(this.errorHandler));
    }

    errorHandler(error: HttpErrorResponse) {
        return observableThrowError(error || 'SERVER ERROR');
    }

    getTransferenciaSearch(idAlmacen: number, numeroDocumento: string, tipoTransferencia: string, nuIdTransferencia: number, pageNumber: number, pageSize: number): Observable<TransferenciaResponse> {    
    //console.log("idAlmacen ",idAlmacen)
        let url = `${this.base}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortType=DESC`;
      
    if(idAlmacen){
            url += `&nuIdAlmacen=${idAlmacen}`
    }
    if(numeroDocumento){
        url += `&documento=${numeroDocumento}`
    } 
    if(tipoTransferencia){
        url += `&tipoTransferencia=${tipoTransferencia}`
    } 
    if(nuIdTransferencia){
        url += `&nuIdTransferencia=${nuIdTransferencia}`
    } 
        
        return this.http.get<TransferenciaResponse>((url)).pipe(catchError(this.errorHandler));
    }

}