import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { Auth, Sistema } from 'app/shared/models/auth.model';
import { AuthService } from 'app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   */

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    public _router: Router,
    private authService: AuthService
  ) { 
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email   : ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  
  login(usuario: string, pass: string) {
    var md5 = require('md5');
   //this.router.navigate(['/sample']); 
    let obj: Auth = new Auth();
    let objs: Sistema = new Sistema();
    objs.id = 9;
    localStorage.setItem('usuario',usuario);
    
    //obj.nombre = "jtrujillo";
    //obj.password = md5('Serfor$2023');
    obj.nombre = usuario;
    obj.password = md5(pass);
    obj.sistema = objs;
    //console.log("obj Auth ",obj)
    
    this.authService.getAuth(obj)      
      .subscribe((response: any) => {
        localStorage.setItem('usuario',response.usuario.persona.numeroDocumento)
        localStorage.setItem('nombres',response.usuario.persona.nombres)
        localStorage.setItem('apellidos',response.usuario.persona.paterno + ' ' + response.usuario.persona.materno)
        localStorage.setItem('documento',response.usuario.persona.numeroDocumento)
        console.log('teeeeeeeeeeeeeest',response);
        //console.log('response', response); 
        this.router.navigate(['/sample']);      
      })
        
     // localStorage.setItem('usuario','44691637')
     // this.router.navigate(['/sample']);  
  }

  register() {
   // this.router.navigate(['/app-register']);
  }
  MDPV() {
   // this.router.navigate(['/MPV/Registro']);
  }
  consulta() {
    //this.router.navigate(['/MPV/Consulta']);
  }

  codigoConfirmacion() {}

  updateConfirmacion() {}

}
