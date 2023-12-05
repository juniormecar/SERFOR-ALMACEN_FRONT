import { Almacen } from '../shared/models/almacen.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
//import {Urls} from '../../../components/common/util/constans';
import { catchError } from 'rxjs/operators';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { BandejaRecursoProductoResponse, BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { Recurso } from 'app/shared/models/recurso.model';
import { RecursoPersona } from 'app/shared/models/recurso-persona.model';
import { CreateRecursoResponse } from 'app/shared/models/response/create-recurso-response';
import { DeleteRecursoResponse } from 'app/shared/models/response/delete-recurso-response';
import { RecursoProduco } from 'app/shared/models/recurso-producto.model';
import { CreateRecursoProductoResponse } from 'app/shared/models/response/recurso-especie-response';
import { RecursoPasResponse } from 'app/shared/models/response/recurso-pas-response';

@Injectable({ providedIn: 'root' })
export class RecursoService {
  private base: string = '';
  private basePas: string = '';

  constructor(private http: HttpClient) {
    this.base = environment.urlProcesos + "/api/serfor/recurso";
    this.basePas = environment.urlProcesos + "/api/serfor/pas/intervencion";
  }


  getRecursoSearch(numeroDocumento: string, numeroActa: string, numeroGuia: string,tipoIngreso: string, idAlmacen: Number,disponibilidadActa: string, documentoSesion: string, pageNumber: number, pageSize: number): Observable<BandejaRecursoResponse> {
    
    let url = `${this.base}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortType=DESC`;
    // if (nombreRecurso) {
    //     url += `&nombreRecurso=${nombreRecurso}`

    // }
    if (documentoSesion) {
      url += `&documentoSesion=${documentoSesion}`

    }
    if (numeroDocumento) {
      url += `&numeroDocumento=${numeroDocumento}`

    }
    if (numeroActa) {
      url += `&numeroActa=${numeroActa}`

    }
    if (numeroGuia) {
      url += `&txNroGuiaTransporteForestal=${numeroGuia}`

    }
    
    if (tipoIngreso) {
      url += `&tipoIngreso=${tipoIngreso}`

    }

    if (idAlmacen != undefined) {
      url += `&nuIdAlmacen=${idAlmacen}`
    }

    if (disponibilidadActa) {
      url += `&disponibilidadActa=${disponibilidadActa}`
    }


    return this.http.get<BandejaRecursoResponse>((url)).pipe(catchError(this.errorHandler));
  }

  getRecursoActasSearch( numeroActa: string, pageNumber: number, pageSize: number): Observable<BandejaRecursoResponse> {
    
    let url = `${this.base}/validacion?pageNumber=${pageNumber}&pageSize=${pageSize}&sortType=DESC`;
    // if (nombreRecurso) {
    //     url += `&nombreRecurso=${nombreRecurso}`

    // }

    if (numeroActa) {
      url += `&numeroActa=${numeroActa}`

    }

    return this.http.get<BandejaRecursoResponse>((url)).pipe(catchError(this.errorHandler));
  }



  getRecursoSearchVerProductos( numeroGuia: string, numeroActa: string, nombresApellidos: string,
                                 nombreProducto: string,idEspecie: number, idAlmacen: number, numeroDocumento: string, tipoDetalle: string, 
                                 nombreCientifico: string ,nombreComun: string, numeroATF: string, puestoControl: string, almacen:string, tipo:string,
                                 unidadMedida:string,tipoIngreso: string,disponible:string, pageNumber: number, pageSize: number,sortType: string): Observable<BandejaRecursoResponse> {
    
    let url = `${this.base}/verProductos?pageNumber=${pageNumber}&pageSize=${pageSize}&sortType=${sortType}`;
    // if (nombreRecurso) {
    //     url += `&nombreRecurso=${nombreRecurso}`

    // }
    if (numeroGuia) {
      url += `&guiaForestal=${numeroGuia}`

    }
     if (numeroActa) {
      url += `&numeroActa=${numeroActa}`

    }
     if (nombresApellidos) {
      url += `&nombres=${nombresApellidos}`

    }
     if (nombreProducto) {
      url += `&nombreProducto=${nombreProducto}`

    }
    if (idEspecie) {
      url += `&idEspecie=${idEspecie}`

    }
     if (idAlmacen != undefined) {
      url += `&nuIdAlmacen=${idAlmacen}`
    }
    if (numeroDocumento) {
      url += `&numeroDocumento=${numeroDocumento}`
    }
    if (tipoDetalle) {
      url += `&tipoDetalle=${tipoDetalle}`
    }
    if (nombreCientifico) {
      url += `&nombreCientifico=${nombreCientifico}`
    }
    if (nombreComun) {
      url += `&nombreComun=${nombreComun}`
    }
    if (numeroATF) {
      url += `&txNumeroATF=${numeroATF}`
    }
    if (puestoControl) {
      url += `&txPuestoControl=${puestoControl}`
    }
    if (almacen) {
      url += `&nombreAlmacen=${almacen}`
    }
    if (tipo) {
      url += `&tipo=${tipo}`
    }
    if (unidadMedida) {
      url += `&unidadMedida=${unidadMedida}`
    }

    if(tipoIngreso){
      url += `&tipoIngreso=${tipoIngreso}`
    }
    if(disponible){
      url += `&disponibilidadActa=${disponible}`
    }
    
    return this.http.get<BandejaRecursoResponse>((url)).pipe(catchError(this.errorHandler));
  }

getBuscarActaProductos( numeroActa: string, tipo:string, pageNumber: number, pageSize: number,sortType: string): Observable<BandejaRecursoProductoResponse> {

let url = `${this.base}/BuscarActaProductos?pageNumber=${pageNumber}&pageSize=${pageSize}&sortType=${sortType}`;

if (numeroActa) {
url += `&numeroActa=${numeroActa}`
}
if (tipo) {
  url += `&tipo=${tipo}`
  }

return this.http.get<BandejaRecursoResponse>((url)).pipe(catchError(this.errorHandler));

}


  postRecurso(request: Recurso): Observable<CreateRecursoResponse> {
    let url = `${this.base}`;
    return this.http.post<CreateRecursoResponse>(url, request).pipe(catchError(this.errorHandler));
  }

  putRecurso(request: Recurso): Observable<CreateRecursoResponse> {
    let url = `${this.base}`;
    return this.http.put<CreateRecursoResponse>(url, request).pipe(catchError(this.errorHandler));
  }

  actualizarDisponibilidad(request: Recurso): Observable<CreateRecursoResponse> {
    let url = `${this.base}/ActualizarDisponibilidadActa`;
    return this.http.put<CreateRecursoResponse>(url, request).pipe(catchError(this.errorHandler));
  }

  deleteRecurso(nuIdRecurso:number): Observable<DeleteRecursoResponse> {
    let url = `${this.base}?nuIdRecurso=${nuIdRecurso}&nuIdUsuarioElimina=1`;
    return this.http.delete<DeleteRecursoResponse>(url).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error || 'SERVER ERROR');
  }

  getRecursoEspeciesSearch(idEspecie: number, idRecurso: number, page: number, size: number): Observable<BandejaRecursoResponse> {
    let url = `${this.base}/especies?offset=${page}&pageSize=${size}`;
    if (idEspecie != undefined && idEspecie != 0 && idEspecie != null) {
      url += `&idEspecie=${idEspecie}`
    }
    if (idRecurso != undefined && idRecurso != 0 && idRecurso != null) {
      url += `&idRecurso=${idRecurso}`
    }
    return this.http.get<BandejaRecursoResponse>((url)).pipe(catchError(this.errorHandler));
  }

  deleteRecursoProducto(nuIdRecursoProducto:number)  {
    let url = `${this.base}/eliminarRecursoEspecieForestal?nuIdRecursoProducto=${nuIdRecursoProducto}&nuIdUsuarioElimina=1`;
    return this.http.delete(url).pipe(catchError(this.errorHandler));
  }

  updateDisponibilidad(listData: RecursoProduco[]): Observable<CreateRecursoProductoResponse> {
    let url = `${this.base}/actualizarRecursoEspecie`;
    return this.http.put<CreateRecursoResponse>(url, listData).pipe(catchError(this.errorHandler));
  }

  getRecursoActasSearchPas( nuActa: string): Observable<RecursoPasResponse> {
    let url = `${this.basePas}?nuActa=${nuActa}`;
    return this.http.get<RecursoPasResponse>((url)).pipe(catchError(this.errorHandler));
  }
  
}