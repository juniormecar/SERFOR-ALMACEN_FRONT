import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  urlSeguridad = environment.urlProcesos;

  constructor(
    private http: HttpClient
  ) { }

  getAuth(dato: any) {
    return this.http.post(
      this.urlSeguridad + `/api/serfor/almacen/externos/login`,
      dato
    );
  }
}

