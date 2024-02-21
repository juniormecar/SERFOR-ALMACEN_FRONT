import { Component, HostBinding, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { EMPTY, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import Swal from 'sweetalert2';
import { TipoParametro } from 'app/shared/models/tipo-parametro.model';
import { Parametro } from 'app/shared/models/parametro.model';
import { ParametroService } from 'app/service/parametro.service';
import { Recurso } from 'app/shared/models/recurso.model';
import { RecursoService } from 'app/service/recurso.service';
import { DetalleComponent } from '../inventario/detalle/detalle/detalle.component';
import { BuscarActaComponent } from '../modal/buscar-acta/buscar-acta.component';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent  implements OnInit
{
    fuseConfig: any;
    form: FormGroup;
    formActa: FormGroup;
    types = [];
    typesDispo = [];
    tipoParametro = new TipoParametro();
    parametro: Parametro[] = [];
    prefijoDecimal: string = 'TCONFDEC';
    descDecimal: string = 'Configuración de decimales';
    idTipoParametroDecimal!: Number;
    listSettings: Parametro[] = [];
    listDecimalCantidad = new Parametro();
    listDecimalRedondeo = new Parametro();
    listDecimal = {
        cantidad: null,
        redondeo: null
    }

    @HostBinding('class.bar-closed')
    barClosed: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FormBuilder} _formBuilder
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Renderer2} _renderer
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _renderer: Renderer2,
        private _parametroService: ParametroService,        
        public _dialog: MatDialog,
        private recursoService: RecursoService,
        
    )
    {
        // Set the defaults
        this.barClosed = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.types = [ 'Mayor', 'Menor']
        this.typesDispo = [ 'Disponible', 'No Disponible']

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getSettingDecimal();
        // Build the config form
        // noinspection TypeScriptValidateTypes
        this.form = this._formBuilder.group({
            decimal   : this._formBuilder.group({
                cantidad  : new FormControl(),
                redondeo  : new FormControl(),                
            }),
            numeroActa : new FormControl(), 
            disponibilidadActa : new FormControl(), 
        });

        // Add customize nav item that opens the bar programmatically
        const customFunctionNavItem = {
            //type    : 'group',
            //icon    : 'settings',
            //children: [
                //{
                    id      : 'Configuraciones Operacionales',
                    title   : 'Configuraciones Operacionales',
                    type    : 'item',
                    icon    : 'settings',
                    function: () => {
                        this.toggleSidebarOpen('themeOptionsPanelSettings');
                    }
                //}
            //]
        };

        this._fuseNavigationService.addNavigationItem(customFunctionNavItem, 'end');
    }

    /**
     * On destroy
     */
    /*ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Remove the custom function menu
        this._fuseNavigationService.removeNavigationItem('settings');
    }*/

    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    saveSettings(){
        let listTipoParametro = [];
        if(this.form.value.decimal.cantidad != null || this.form.value.decimal.redondeo != null){
            //console.log("this.form.value.decimal", this.form.value.decimal);

            this.tipoParametro = {
                idTipoParametro: this.idTipoParametroDecimal,
                prefijo : this.prefijoDecimal ,
                nombre : this.descDecimal ,
                descripcion : this.descDecimal ,
                estado: 'A',
                idUsuarioRegistro: 1,
                idUsuarioModificacion: 1,
                lstParametro: [{
                    idParametro: this.listDecimalCantidad.idParametro,
                    codigo: 'TCONFDEC1',
                    valorPrimario: this.form.value.decimal.cantidad,
                    idTipoParametro: this.idTipoParametroDecimal,
                    estado: 'A'},
                {
                    idParametro: this.listDecimalRedondeo.idParametro,
                    codigo: 'TCONFDEC2',
                    valorPrimario: this.form.value.decimal.redondeo,
                    idTipoParametro: this.idTipoParametroDecimal,
                    estado: 'A'}
                ]
            }
            this.listDecimal.cantidad = this.form.value.decimal.cantidad == null ? 4:this.form.value.decimal.cantidad;
            this.listDecimal.redondeo = this.form.value.decimal.redondeo == null ? 'Mayor':this.form.value.decimal.redondeo;

            listTipoParametro.push(this.tipoParametro);
            this.saveStorage(this.listDecimal.cantidad, this.listDecimal.redondeo);

            this._parametroService.postParametro(listTipoParametro).subscribe((response: any) => {
                if (response.data && response.data[0].idTipoParametro > 0) {
                  Swal.fire(
                    'Mensaje de Confirmación',
                    'Configuracion guardada correctamente.',
                    'success'
                  )
                }  else {
                  Swal.fire(
                    'Mensaje!',
                    'Error inesperado al guardada el registro. ',
                    'error'
                  )
                }
              }, error => {
                //console.log("error ",error)
              })

        } else {
            Swal.fire(
                'Alerta!',
                'Tiene que registrar algún valor.',
                'warning'
              )
        }
    }

    getSettingDecimal(){
        this._parametroService.getParametroSearch(this.prefijoDecimal).subscribe((response: Parametro[]) => {
            this.listSettings = response;
            if(this.listSettings != null && this.listSettings != undefined && this.listSettings.length > 0){
                this.listDecimalCantidad = this.listSettings.filter( (e: Parametro) => e.codigo == 'TCONFDEC1')[0];
                this.listDecimalRedondeo = this.listSettings.filter( (e: Parametro) => e.codigo == 'TCONFDEC2')[0];
                this.idTipoParametroDecimal = this.listDecimalCantidad.idTipoParametro == null ? 
                this.listDecimalRedondeo.idTipoParametro: this.listDecimalCantidad.idTipoParametro;
                //console.log("this.listDecimalCantidad-getSetting",this.listDecimalCantidad);
                //console.log("this.listDecimalRedondeo-getSetting",this.listDecimalRedondeo);
                
                this.saveStorage(this.listDecimalCantidad.valorPrimario, this.listDecimalRedondeo.valorPrimario);
            }
        });
    }

    saveStorage(cantidad: any, redondeo: any){
        this.listDecimal.cantidad = cantidad == null ? 4: cantidad;
        this.listDecimal.redondeo = redondeo == null ? 4: redondeo;
        sessionStorage.setItem("listDecimal", JSON.stringify(this.listDecimal));
    }

    modalBuscarActa(){
        let obj: Recurso = new Recurso();        
       obj.numeroActa = this.form.get('numeroActa').value;
      //  if(this.form.value.disponibilidadActa === 'Disponible')
      //  {obj.disponibilidadActa = 'D';}
      //  if(this.form.value.disponibilidadActa === 'No Disponible')
      //  {obj.disponibilidadActa = 'ND'}      


        if(this.form.get('numeroActa').value != null && this.form.get('numeroActa').value != ''){            

          //let data = [];
          const dialogRef = this._dialog.open(BuscarActaComponent, {
            width: '1150px',
            height: '650px',
            data: { numeroActa: this.form.get('numeroActa').value}
          });

        } else {
            
              Swal.fire({
                title: 'Alerta!',
                text: "Debe digitar un número de acta.",
                icon: 'warning',
                //showCancelButton: true,
                confirmButtonColor: '#679738',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancelar'
              })
        }
    }
    
}
