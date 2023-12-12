import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { RegistroRecursoComponent } from './main/recurso/registro-recurso/registro-recurso.component';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BandejaAlmacenComponent } from './main/almacen/bandeja-almacen/bandeja-almacen.component';
import { RegistroAlmacenComponent } from './main/almacen/registro-almacen/registro-almacen.component';
import { ActualizarAlmacenComponent } from './main/almacen/actualizar-almacen/actualizar-almacen.component';
import { BandejaRecursoComponent } from './main/recurso/bandeja-recurso/bandeja-recurso.component';
import { ModalFormEspeciesComponent } from './main/recurso/registro-recurso/modal/modal-form-especies/modal-form-especies.component';
import { SharedModule } from './shared/shared.module';
import { BeneficiarioComponent } from './main/transferencia/beneficiario/beneficiario.component';
import { AlmacenComponent } from './main/transferencia/almacen/almacen.component';
import { ModalEspecieCubicacionComponent } from './main/recurso/registro-recurso/modal/modal-especie-cubicacion/modal-especie-cubicacion.component';
import { DevolucionesComponent } from './main/transferencia/devoluciones/devoluciones.component';
import { ModalActaIntervencionComponent } from './main/recurso/registro-recurso/modal/modal-acta-intervencion/modal-acta-intervencion.component';
import { KardexComponent } from './main/reporte/kardex/kardex.component';
import { TransferenciaComponent } from './main/reporte/transferencia/transferencia/transferencia.component';
import { ActionMessageComponent } from './main/popups-common/action-message/action-message.component';
import { TransferenciaAlmacenesComponent } from './main/reporte/transferencia/transferencia-almacenes/transferencia-almacenes.component';
import { BandejaInventarioComponent } from './main/inventario/bandeja-inventario/bandeja-inventario/bandeja-inventario.component';

import { SalidasComponent } from './main/transferencia/salidas/salidas.component';
import { DetalleComponent } from './main/inventario/detalle/detalle/detalle.component';

import { MatTabsModule } from '@angular/material/tabs';
import { DetalleAlmacenComponent } from './main/inventario/detalle-almacen/detalle-almacen/detalle-almacen.component';
import { ModalAlmacenEncargadosComponent } from './main/almacen/registro-almacen/modal/modal-almacen-encargados/modal-almacen-encargados/modal-almacen-encargados.component';
import { TransferenciaBeneficiarioDetalleComponent } from './main/reporte/transferencia/transferencia/modal/transferencia-beneficiario-detalle/transferencia-beneficiario-detalle/transferencia-beneficiario-detalle.component';
import { TransferenciaAlmacenDetalleComponent } from './main/reporte/transferencia/transferencia-almacenes/modal/transferencia-almacen-detalle/transferencia-almacen-detalle/transferencia-almacen-detalle.component';
import { LoginComponent } from './main/login/login.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BajasComponent } from './main/transferencia/bajas/bajas.component';
import { SettingsComponent } from './main/settings/settings.component';
import { BuscarActaComponent } from './main/modal/buscar-acta/buscar-acta.component';
import { ModalFaunaDetalleComponent } from './main/recurso/registro-recurso/modal/modal-fauna-detalle/modal-fauna-detalle.component';
import { ModalPasComponent } from './main/recurso/registro-recurso/modal/modal-pas/modal-pas.component';
import { FaunaSalidaComponent } from './main/transferencia/fauna-salida/fauna-salida.component';
import { ReportesComponent } from './main/reporte/reportes/reportes.component';
import { BandejaATFComponent } from './main/mantenimiento/atf/bandeja-atf/bandeja-atf.component';
import { RegistroAtfComponent } from './main/mantenimiento/atf/bandeja-atf/modal/registro-atf/registro-atf.component';
import { BandejaPuestoControlComponent } from './main/mantenimiento/puesto-control/bandeja-puesto-control/bandeja-puesto-control.component';
import { RegistroPuestoControlComponent } from './main/mantenimiento/puesto-control/bandeja-puesto-control/modal/registro-puesto-control/registro-puesto-control.component';
import { BandejaTipoParametroComponent } from './main/mantenimiento/tipo-parametro/bandeja-tipo-parametro/bandeja-tipo-parametro.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportesAvanzadoComponent } from './main/reporte/reportes-avanzado/reportes-avanzado.component';
import { RegistroTipoParametroComponent } from './main/mantenimiento/tipo-parametro/bandeja-tipo-parametro/modal/registro-tipo-parametro/registro-tipo-parametro.component';
import { BandejaParametroComponent } from './main/mantenimiento/parametro/bandeja-parametro/bandeja-parametro.component';
import { RegistroParametroComponent } from './main/mantenimiento/parametro/bandeja-parametro/modal/registro-parametro/registro-parametro.component';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registro-recurso',
        component: RegistroRecursoComponent
    },
    {
        path: 'registro-recurso/:id',
        component: RegistroRecursoComponent
    },
    {
        path: 'bandeja-almacen',
        component: BandejaAlmacenComponent
    },
    {
        path: 'registro-almacen',
        component: RegistroAlmacenComponent
    },
    {
        path: 'actualizar-almacen',
        component: ActualizarAlmacenComponent
    },
    {
        path: 'bandeja-recurso',
        component: BandejaRecursoComponent
    },
    {
        path: 'actualizar-almacen/:id',
        component: ActualizarAlmacenComponent
    },
    {
        path: 'reporte',
        component: KardexComponent
    },
    {
        path: 'transferencia',
        component: TransferenciaComponent
    },
    {
        path: 'transferencia-almacen',
        component: TransferenciaAlmacenesComponent
    },
    {
        path: 'kardex',
        component: KardexComponent
    },
    {
        path: 'bandeja-inventario',
        component: BandejaInventarioComponent
    },
    {
        path: 'reportes',
        component: ReportesComponent
    },
    
    {

        path: 'bandeja-atf',
        component: BandejaATFComponent
    },

    {
        path: 'bandeja-puestoControl',
        component: BandejaPuestoControlComponent
    },

    {
        path: 'bandeja-tipoParametro',
        component: BandejaTipoParametroComponent
    },

    {
        path: 'bandeja-parametro',
        component: BandejaParametroComponent
    },
        
    {
        path: 'reportes-avanzado',
        component: ReportesAvanzadoComponent

    },
    {
        path: '',
        pathMatch:'full',
        redirectTo: 'login',

    },
];

@NgModule({
    declarations: [
        AppComponent,
        RegistroRecursoComponent,
        BandejaAlmacenComponent,
        RegistroAlmacenComponent,
        ActualizarAlmacenComponent,
        BandejaRecursoComponent,
        ModalFormEspeciesComponent,
        BeneficiarioComponent,
        AlmacenComponent,
        ModalEspecieCubicacionComponent,
        DevolucionesComponent,
        ModalActaIntervencionComponent,
        KardexComponent,
        TransferenciaComponent,
        ActionMessageComponent,
        TransferenciaAlmacenesComponent,
        BandejaInventarioComponent,
        SalidasComponent,
        DetalleComponent,
        DetalleAlmacenComponent,
        ModalAlmacenEncargadosComponent,
        TransferenciaBeneficiarioDetalleComponent,
        TransferenciaAlmacenDetalleComponent,
        LoginComponent,
        BajasComponent,
        SettingsComponent,
        BuscarActaComponent,
        ModalFaunaDetalleComponent,
        ModalPasComponent,
        FaunaSalidaComponent,
        ReportesComponent,
        BandejaATFComponent,
        RegistroAtfComponent,
        BandejaPuestoControlComponent,
        RegistroPuestoControlComponent,
        BandejaTipoParametroComponent,

        ReportesAvanzadoComponent,

        RegistroTipoParametroComponent,

        BandejaParametroComponent,

        RegistroParametroComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatToolbarModule,
        MatSelectModule,
        MatExpansionModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        // App modules
        LayoutModule,
        SampleModule,
        AccordionModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,

        AccordionModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatRadioModule,
        MatTableModule,
        MatPaginatorModule,
        
        MatIconModule,
        MatTabsModule,
        MatSnackBarModule,
        NgxChartsModule
    ],
    exports: [
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatToolbarModule,
        MatSelectModule,
        MatExpansionModule,
        MatRadioModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
