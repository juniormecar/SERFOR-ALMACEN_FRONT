import { Component, Inject, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject } from 'rxjs';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActualizarListSteps, ActualizarStep } from './actualizarAlmacenConstant';
import { Almacen } from 'app/shared/models/almacen.model';
import { AlmacenResponsable } from 'app/shared/models/almacen-responsable.model';
import { Recurso } from 'app/shared/models/recurso.model';
import { RecursoService } from 'app/service/recurso.service';
import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetalleRecursosComponent } from 'app/shared/modals/detalle-recursos/detalle-recursos.component';
import { ActivatedRoute } from '@angular/router';
import { ATF } from 'app/shared/models/atf.model';
import { AtfService } from 'app/service/atf.service';
import { finalize } from 'rxjs/operators';
import { PuestoControlService } from 'app/service/puesto-control.service';
import { PuestoControl } from 'app/shared/models/puesto-control.model';
import { Parametro } from 'app/shared/models/parametro.model';
import { Constants } from 'app/shared/models/util/constants';
import { ParametroService } from 'app/service/parametro.service';
import { AlmacenComponent } from 'app/main/transferencia/almacen/almacen.component';
import { BeneficiarioComponent } from 'app/main/transferencia/beneficiario/beneficiario.component';
import { DevolucionesComponent } from 'app/main/transferencia/devoluciones/devoluciones.component';
import { PideService } from 'app/service/pide.service';
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import { AlmacenService } from 'app/service/almacen.service';
import { CreateAlmacenResponse } from 'app/shared/models/response/create-almacen-response';
import { RecursoProduco } from 'app/shared/models/recurso-producto.model';
import { SalidasComponent } from 'app/main/transferencia/salidas/salidas.component';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
import { AlmacenResponsableResponse } from 'app/shared/models/response/almacen-responsable-response';
import { ModalAlmacenEncargadosComponent } from 'app/main/almacen/registro-almacen/modal/modal-almacen-encargados/modal-almacen-encargados/modal-almacen-encargados.component';
import { DeleteAlmacenResponsableResponse } from 'app/shared/models/response/delete-almacen-responsable-response';
import { Decimal } from 'app/shared/models/settings.model';
import { FaunaSalidaComponent } from 'app/main/transferencia/fauna-salida/fauna-salida.component';


@Component({
  selector: 'app-actualizar-almacen',
  templateUrl: './actualizar-almacen.component.html',
  styleUrls: ['./actualizar-almacen.component.scss']
})
export class ActualizarAlmacenComponent implements OnInit {

  dataRecurso = new Almacen();
  dataSource = new MatTableDataSource<Recurso>([]);
  dataSourceFauna = new MatTableDataSource<Recurso>([]);
  dataSourceNoMad = new MatTableDataSource<Recurso>([]);
  dataSourceMad = new MatTableDataSource<Recurso>([]);
  dataSourceEncargado = new MatTableDataSource<AlmacenResponsable>([]);
  almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
  almacenResponsableResponse: AlmacenResponsableResponse = new AlmacenResponsableResponse();
  lstrecursos: RecursoProduco[] = [];
  recursoResponse: BandejaRecursoResponse = new BandejaRecursoResponse();
  recursoResponseFauna: BandejaRecursoResponse = new BandejaRecursoResponse();
  recursoResponseNoMad: BandejaRecursoResponse = new BandejaRecursoResponse();
  recursoResponseMad: BandejaRecursoResponse = new BandejaRecursoResponse();
  inputRegistro: FormGroup;
  inputProductos: FormGroup;
  course: ActualizarStep[] = ActualizarListSteps;
  animationDirection: 'left' | 'right' | 'none';
  courseStepContent: any;
  currentStep: number;
  titleStep: string = '';
  step = 0;
  resultsLength = 0;
  type: string = '';
  //dataSource: any = false
  listATF: ATF[] = [];
  listPuestoControl: PuestoControl[] = [];
  displayedColumns: string[] = ['position', 'nroGuiaTransporteForestal', 'numeroActa', 'nombreCientifico', 'nombreComun', 'txCantidadProducto', 'descontar', 'metroCubico', 'descontarMetroCubico','unidadMedida','flagAgregar'];
  displayedColumnsNMFA: string[] = ['position', 'nroGuiaTransporteForestal', 'numeroActa', 'nombreCientifico', 'nombreComun', 'txCantidadProducto', 'descontar','flagAgregar'];
  displayedColumnsEncargado = ['position', 'tipoDocumento', 'numeroDocumento', 'nombresResponsable','acciones'];
  listAlmacenResponsable: AlmacenResponsable[] = [];
  totalM3: number = 0;
  almacenRequest: Almacen = new Almacen();
  dataAlmacen = new Almacen();
  idAlmacen: any;
  listTipoAlmacen: Parametro[] = [];
  listTipoDocumento: Parametro[] = [];
  tipoAlmacen: string = Constants.TIPO_ALMACEN;
  tipoDocumento: string = Constants.TIPO_DOCUMENTO;
  validaDNIClass: boolean = false;
  photo: string;
  validCheck: boolean = true;
  listUnidadMedida: Parametro[] = [];
  unidadMedida: string = Constants.UNIDAD_MEDIDA;

  totalToneladas: number = 0;
  listProducto: Recurso[] = [];
  productosResponse:any = {
    data: [],
    pageNumber: 0,
    pageSize: 10,
    totalRecords: 0,
    previousPageIndex: 1
  }
  dataSourceFilter = new MatTableDataSource<Recurso>([]);
  queryFauna: string = "";
  nroGuia: string = "";
  nroActa: string = "";
  tipoIngresoForm: string = "";
  lstDecimal = new Decimal();
  cantidadPipe!: string;
  cantidad!: number;
  redondeo!: string;

  dataSourceFaunaFilter = new MatTableDataSource<Recurso>([]);
  dataSourceNoMadFilter = new MatTableDataSource<Recurso>([]);
  dataSourceMadFilter = new MatTableDataSource<Recurso>([]);

  dataSourceFaunaFilterActa = new MatTableDataSource<Recurso>([]);
  dataSourceNoMadFilterActa = new MatTableDataSource<Recurso>([]);
  dataSourceMadFilterActa = new MatTableDataSource<Recurso>([]);

  totalRecordFauna !: number;
  totalRecordNoMad !: number;
  totalRecordMad !: number;

  listTipoIngreso: Parametro[] = [];
  listTipo: Parametro[] = [];
  tipoIngreso: string = Constants.TIPO_INGRESO;
  tipo: string = Constants.VISUALIZACION;

  typeRecurso: string = '';

  constructor(private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _recursoService: RecursoService,
    private activaRoute: ActivatedRoute,
    public _dialog: MatDialog,
    private atfService: AtfService,
    public _router: Router,
    private puestoControlService: PuestoControlService,
    private pideService: PideService,
    private almacenService: AlmacenService,
    private parametroService: ParametroService) {
    //////console.log("window.history.state ", window.history.state)
    this.dataRecurso = window.history.state.data;
    this.type = window.history.state.type;
    if (this.type === 'edit') {
      this.course = this.course.filter(resp => resp.stepId === 'step01')
    } else {
      this.course = this.course.filter(resp => resp.stepId === 'step02')
    }
    this.idAlmacen = this.activaRoute.snapshot.paramMap.get('id');
    this.recursoResponse.pageNumber = 1;
    this.recursoResponse.pageSize = 10;
    this.recursoResponseFauna.pageNumber = 1;
    this.recursoResponseFauna.pageSize = 3000;
    this.recursoResponseNoMad.pageNumber = 1;
    this.recursoResponseNoMad.pageSize = 3000;
    this.recursoResponseMad.pageNumber = 1;
    this.recursoResponseMad.pageSize = 3000;
    this.almacenResponse.pageNumber = 1;
    this.almacenResponse.pageSize = 3000;
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: false
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

    this.inputRegistro = this._formBuilder.group({
      puestoControl: ['', Validators.required],
      numeroATF: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      nombreAlmacen: ['', Validators.required],
      tipoAlmacen: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombreEncargado: ['', Validators.required],
      capacidadMaderable: ['', Validators.required],
      capacidadNoMaderable: ['', Validators.required],
      capacidadFauna: ['', Validators.required],
      direccionAlmacen: ['', Validators.required]
    });
    this.inputProductos = this._formBuilder.group({
      numeroGuia: [''],
      numeroActa: [''],
      nombresApellidos: [''],
      nombreProducto: [''],
      tipoIngresoForm: ['']
    });
    this.dataAlmacen = window.history.state.data;
    this.idAlmacen = this.activaRoute.snapshot.paramMap.get('id');
    //////console.log('this.dataAlmacen', this.dataAlmacen);
    //////console.log('this.dataRecurso', this.dataRecurso);
    if (this.dataAlmacen !== undefined) {
      this.inputRegistro.get('nombreAlmacen').patchValue(this.dataRecurso.txNombreAlmacen);
      this.inputRegistro.get('tipoDocumento').patchValue(this.dataRecurso.txTipoDocumento);
      this.inputRegistro.get('numeroDocumento').patchValue(this.dataRecurso.txNumeroDocumento);
      this.inputRegistro.get('nombreEncargado').patchValue(this.dataRecurso.txNombresEncargado);
      this.inputRegistro.get('capacidadMaderable').patchValue(this.dataRecurso.capacidadMaderable);
      this.inputRegistro.get('capacidadNoMaderable').patchValue(this.dataRecurso.capacidadNoMaderable);
      this.inputRegistro.get('capacidadFauna').patchValue(this.dataRecurso.capacidadFauna);
      this.inputRegistro.get('direccionAlmacen').patchValue(this.dataRecurso.direccionAlmacen);
      this.photo = this.dataRecurso.foto;
    }
    this.searchATF();
    this.searchTipoAlmacen();
    this.searchTipoDocumento();
    this.currentStep = 0;
    this.titleStep = this.course[0].title

    this.lstDecimal = JSON.parse(sessionStorage.getItem('listDecimal'));
    this.cantidad = Number(this.lstDecimal.cantidad);
    this.cantidadPipe = '0.0-' + this.cantidad;
    this.redondeo = this.lstDecimal.redondeo;
    //////console.log("this.lstDecimal",this.lstDecimal)
  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
    let param: {
    }
  }

  prevStep() {
    this.step--;
  }

  ngOnInit(): void {
    if (this.dataRecurso == null) {
      this.getRecursos(this.idAlmacen);
      this.getRecursos2(this.idAlmacen);
    } else {
      this.idAlmacen = this.dataRecurso.nuIdAlmacen;
      this.getRecursos(this.dataRecurso.nuIdAlmacen);
      this.getRecursos2(this.dataRecurso.nuIdAlmacen);
    }
    this.searchAlmacenResponsable();
    this.searchUnidadMedida();
    this.searchTipoIngreso();
    this.searchTipo();
  }

  gotoStep(step): void {
    this.animationDirection = this.currentStep < step ? 'left' : 'right';
    this.currentStep = step;
    this.titleStep = this.course[this.currentStep].title
  }

  gotoNextStep(): void {
    if (this.currentStep === this.course.length) {
      return;
    }
    this.animationDirection = 'left';
    this.currentStep++;
    this.titleStep = this.course[this.currentStep].title
  }

  /**
   * Go to previous step
   */
  gotoPreviousStep(): void {
    if (this.currentStep === 0) {
      return;
    }
    this.animationDirection = 'right';
    this.currentStep--;
    this.titleStep = this.course[this.currentStep].title
  }

  searchATF() {
    this.atfService.getATFSearch()
      .pipe(finalize(() => this.searchPuestoControl()))
      .subscribe((response: ATF[]) => {
        this.listATF = response;
        if (this.dataAlmacen !== undefined) {
          this.inputRegistro.get('numeroATF').patchValue(Number(this.dataRecurso.txNumeroATF));
        }
      });
  }

  searchPuestoControl() {
    this.puestoControlService.getPuestoControlSearch(this.inputRegistro.get('numeroATF').value)
      .pipe(finalize(() => this.getValores()))
      .subscribe((response: PuestoControl[]) => {
        this.listPuestoControl = response;
      });
  }

  searchTipoAlmacen() {
    this.parametroService.getParametroSearch(this.tipoAlmacen)
      .subscribe((response: Parametro[]) => {
        this.listTipoAlmacen = response;
      });
  }

  searchTipoDocumento() {
    this.parametroService.getParametroSearch(this.tipoDocumento).subscribe((response: Parametro[]) => {
      this.listTipoDocumento = response;
    });
  }

  getValores() {
    if (this.dataAlmacen !== undefined) {
      this.inputRegistro.get('puestoControl').patchValue(Number(this.dataRecurso.txPuestoControl));
      this.inputRegistro.get('tipoAlmacen').patchValue(this.dataRecurso.txTipoAlmacen);
      //this.getRecursos(Number(this.idAlmacen));
    }
  }

  /*getRecursos(idAlmacen: any) {
    this.dataSource = new MatTableDataSource<Recurso>([])
    this._recursoService.getRecursoSearchVerProductos(null, null, null, null,null, idAlmacen,null,null,null,null,null,null,null,null,
      this.recursoResponse.pageNumber, this.recursoResponse.pageSize)
      .subscribe((response: BandejaRecursoResponse) => {

        ////console.log("response-getRecursos3",response);
        let datafiltrada = response.data.filter( 
          ( rd: any) => rd.txCantidadProducto != '0'
        );
        if(datafiltrada.length < 1) this.validCheck = false;
        this.dataSourceFilter = new MatTableDataSource<Recurso>(response.data);
        this.listFilterTotal();
      })
  }*/

  getRecursos(idAlmacen: any) {
    this.getRecursosFauna(idAlmacen);
    this.getRecursosNoMad(idAlmacen);
    this.getRecursosMad(idAlmacen);
  }

  getRecursosFauna(idAlmacen: any) {
    
    this.dataSource = new MatTableDataSource<Recurso>([])
    this._recursoService.getRecursoSearchVerProductos(null, null, null, null,null, idAlmacen,null,null,null,null,null,null,null,'FA',null,
    null,null,this.recursoResponseFauna.pageNumber, this.recursoResponseFauna.pageSize,'DESC')
      .subscribe((response: BandejaRecursoResponse) => {

         let dataSourceFaunaFilterAc = response.data;

        this.totalRecordFauna = response.totalRecords;
        let datafiltrada = response.data.filter( 
          ( rd: any) => rd.txCantidadProducto != '0'
        );
        if(datafiltrada.length < 1) this.validCheck = false;

        var lstHallazgos: RecursoProduco[] = [];
        this.totalRecordMad = response.totalRecords;
        response.data.forEach((item:any)=>{
          var hallazgo:RecursoProduco = new RecursoProduco();
          if(item.tipoIngreso == 'Hallazgo'){
            if(lstHallazgos.length === 0){
              hallazgo.nombreCientifico = item.nombreCientifico;
              hallazgo.nombreComun = item.nombreComun;
              hallazgo.unidadMedida= item.unidadMedida;
              hallazgo.txCantidadProducto= item.txCantidadProducto;
              hallazgo.tipoIngreso= item.tipoIngreso;
              lstHallazgos.push(hallazgo);
            }else{
              var acumular=true;
              lstHallazgos.forEach(result=>{
                if(item.nombreCientifico===result.nombreCientifico && item.nombreComun===result.nombreComun && item.unidadMedida===result.unidadMedida){
                  result.txCantidadProducto=Number(result.txCantidadProducto)+Number(item.txCantidadProducto);
                  acumular=false;
                }
              })
              if(acumular){
                hallazgo.nombreCientifico = item.nombreCientifico;
                hallazgo.nombreComun = item.nombreComun;
                hallazgo.unidadMedida= item.unidadMedida;
                hallazgo.txCantidadProducto= item.txCantidadProducto;
                hallazgo.tipoIngreso= item.tipoIngreso;
                lstHallazgos.push(hallazgo);
              }
            }
          }
          
        })
       
        //console.log("lstHallazgos ",lstHallazgos);

        var lista: Recurso[] = [];
        response.data.forEach((result:any)=>{
          
          if(result.tipoIngreso === 'Hallazgo'){
           
            if(lista.length === 0){
              lista.push(result);
            }else{
              var acumular=true;
              lista.forEach((item:any)=>{
                if(result.nombreCientifico===item.nombreCientifico && result.nombreComun===item.nombreComun && 
                   result.unidadMedida===item.unidadMedida && item.tipoIngreso === result.tipoIngreso){
                    acumular=false;
                  }
              })
              if(acumular){
                lista.push(result);
              }else{
                lista.forEach((item:any)=>{
                  
                  if(result.nombreCientifico===item.nombreCientifico && result.nombreComun===item.nombreComun && 
                     result.unidadMedida===item.unidadMedida && item.tipoIngreso === result.tipoIngreso){
                    lstHallazgos.forEach(result2=>{
                      
                      if(result2.nombreCientifico===item.nombreCientifico && result2.nombreComun===item.nombreComun && result2.unidadMedida===item.unidadMedida){
                       item.txCantidadProducto=result2.txCantidadProducto;
                      }
                    })
                  }
              })
              }
            }
            
          }else{
            lista.push(result);
          }
          
        })
        //console.log("lista ",lista);
        this.dataSourceFaunaFilter = new MatTableDataSource<Recurso>(lista);
        this.dataSourceFaunaFilterActa = new MatTableDataSource<Recurso>(dataSourceFaunaFilterAc);
        this.listFilterTotalFauna(this.dataSourceFaunaFilter.data);
        //this.calculateTotal(this.dataSource.data);
        //this.listFilterTotal();
      })
  }

  getRecursosNoMad(idAlmacen: any) {
    this.dataSource = new MatTableDataSource<Recurso>([])
    this._recursoService.getRecursoSearchVerProductos(null, null, null, null,null, idAlmacen,null,null,null,null,null,null,null,'NOMAD',null,
    null,null,this.recursoResponseNoMad.pageNumber, this.recursoResponseNoMad.pageSize,'DESC')
      .subscribe((response: BandejaRecursoResponse) => {

        let dataSourceNoMadFilterAc = response.data;

        this.totalRecordNoMad = response.totalRecords;
        let datafiltrada = response.data.filter( 
          ( rd: any) => rd.txCantidadProducto != '0'
        );
        if(datafiltrada.length < 1) this.validCheck = false;

        
        var lstHallazgos: RecursoProduco[] = [];
        this.totalRecordMad = response.totalRecords;
        response.data.forEach((item:any)=>{
          var hallazgo:RecursoProduco = new RecursoProduco();
          if(item.tipoIngreso == 'Hallazgo'){
            if(lstHallazgos.length === 0){
              hallazgo.nombreCientifico = item.nombreCientifico;
              hallazgo.nombreComun = item.nombreComun;
              hallazgo.unidadMedida= item.unidadMedida;
              hallazgo.txCantidadProducto= item.txCantidadProducto;
              hallazgo.tipoIngreso= item.tipoIngreso;
              lstHallazgos.push(hallazgo);
            }else{
              var acumular=true;
              lstHallazgos.forEach(result=>{
                if(item.nombreCientifico===result.nombreCientifico && item.nombreComun===result.nombreComun && item.unidadMedida===result.unidadMedida){
                  result.txCantidadProducto=Number(result.txCantidadProducto)+Number(item.txCantidadProducto);
                  acumular=false;
                }
              })
              if(acumular){
                hallazgo.nombreCientifico = item.nombreCientifico;
                hallazgo.nombreComun = item.nombreComun;
                hallazgo.unidadMedida= item.unidadMedida;
                hallazgo.txCantidadProducto= item.txCantidadProducto;
                hallazgo.tipoIngreso= item.tipoIngreso;
                lstHallazgos.push(hallazgo);
              }
            }
          }
          
        })
       
        console.log("lstHallazgos NOMAD ",lstHallazgos);

        var lista: Recurso[] = [];
        response.data.forEach((result:any)=>{
          
          if(result.tipoIngreso === 'Hallazgo'){
           
            if(lista.length === 0){
              lista.push(result);
            }else{
              var acumular=true;
              lista.forEach((item:any)=>{
                if(result.nombreCientifico===item.nombreCientifico && result.nombreComun===item.nombreComun && 
                   result.unidadMedida===item.unidadMedida && item.tipoIngreso === result.tipoIngreso){
                    acumular=false;
                  }
              })
              if(acumular){
                lista.push(result);
              }else{
                lista.forEach((item:any)=>{
                  
                  if(result.nombreCientifico===item.nombreCientifico && result.nombreComun===item.nombreComun && 
                     result.unidadMedida===item.unidadMedida && item.tipoIngreso === result.tipoIngreso){
                    lstHallazgos.forEach(result2=>{
                      
                      if(result2.nombreCientifico===item.nombreCientifico && result2.nombreComun===item.nombreComun && result2.unidadMedida===item.unidadMedida){
                       item.txCantidadProducto=result2.txCantidadProducto;
                      }
                    })
                  }
              })
              }
            }
            
          }else{
            lista.push(result);
          }
          
        })
        //console.log("lista ",lista);
        this.dataSourceNoMadFilter = new MatTableDataSource<Recurso>(lista);
        this.dataSourceNoMadFilterActa = new MatTableDataSource<Recurso>(dataSourceNoMadFilterAc); 
        this.listFilterTotalNoMad(this.dataSourceNoMadFilter.data);
        //this.calculateTotal(this.dataSource.data);
        //this.listFilterTotal();
      })
  }

  getRecursosMad(idAlmacen: any) {
    this.dataSource = new MatTableDataSource<Recurso>([])
    this._recursoService.getRecursoSearchVerProductos(null, null, null, null,null, idAlmacen,null,null,null,null,null,null,null,'MAD',null,
    null,null,this.recursoResponseMad.pageNumber, this.recursoResponseMad.pageSize,'DESC')
      .subscribe((response: BandejaRecursoResponse) => {

        let dataSourceMadFilterAc = response.data;

        let datafiltrada = response.data.filter( 
          ( rd: any) => rd.txCantidadProducto != '0'
        );
        if(datafiltrada.length < 1) this.validCheck = false;
        
        var lstHallazgos: RecursoProduco[] = [];
        this.totalRecordMad = response.totalRecords;
        response.data.forEach((item:any)=>{
          var hallazgo:RecursoProduco = new RecursoProduco();
          if(item.tipoIngreso == 'Hallazgo'){
            if(lstHallazgos.length === 0){
              hallazgo.nombreCientifico = item.nombreCientifico;
              hallazgo.nombreComun = item.nombreComun;
              hallazgo.unidadMedida= item.unidadMedida;
              hallazgo.txCantidadProducto= item.txCantidadProducto;
              hallazgo.metroCubico= item.metroCubico;
              hallazgo.tipoIngreso= item.tipoIngreso;
              lstHallazgos.push(hallazgo);
            }else{
              var acumular=true;
              lstHallazgos.forEach(result=>{
                if(item.nombreCientifico===result.nombreCientifico && item.nombreComun===result.nombreComun && item.unidadMedida===result.unidadMedida){
                  result.txCantidadProducto=Number(result.txCantidadProducto)+Number(item.txCantidadProducto);
                  result.metroCubico=Number(result.metroCubico)+Number(item.metroCubico);
                  acumular=false;
                }
              })
              if(acumular){
                hallazgo.nombreCientifico = item.nombreCientifico;
                hallazgo.nombreComun = item.nombreComun;
                hallazgo.unidadMedida= item.unidadMedida;
                hallazgo.txCantidadProducto= item.txCantidadProducto;
                hallazgo.metroCubico= item.metroCubico;
                hallazgo.tipoIngreso= item.tipoIngreso;
                lstHallazgos.push(hallazgo);
              }
            }
          }
          
        })
       
        //console.log("lstHallazgos ",lstHallazgos);

        var lista: Recurso[] = [];
        response.data.forEach((result:any)=>{
          
          if(result.tipoIngreso === 'Hallazgo'){
           
            if(lista.length === 0){
              lista.push(result);
            }else{
              var acumular=true;
              lista.forEach((item:any)=>{
                if(result.nombreCientifico===item.nombreCientifico && result.nombreComun===item.nombreComun && 
                   result.unidadMedida===item.unidadMedida && item.tipoIngreso === result.tipoIngreso){
                    acumular=false;
                  }
              })
              if(acumular){
                lista.push(result);
              }else{
                lista.forEach((item:any)=>{
                  
                  if(result.nombreCientifico===item.nombreCientifico && result.nombreComun===item.nombreComun && 
                     result.unidadMedida===item.unidadMedida && item.tipoIngreso === result.tipoIngreso){
                    lstHallazgos.forEach(result2=>{
                      
                      if(result2.nombreCientifico===item.nombreCientifico && result2.nombreComun===item.nombreComun && result2.unidadMedida===item.unidadMedida){
                       item.txCantidadProducto=result2.txCantidadProducto;
                       item.metroCubico=result2.metroCubico;
                      }
                    })
                  }
              })
              }
            }
            
          }else{
            lista.push(result);
          }
          
        })
        //console.log("lista ",lista);
        this.dataSourceMadFilter = new MatTableDataSource<Recurso>(lista);
        this.dataSourceMadFilterActa = new MatTableDataSource<Recurso>(dataSourceMadFilterAc);
        this.listFilterTotalMad(this.dataSourceMadFilter.data);
        //this.calculateTotal(this.dataSource.data);
        //this.listFilterTotal();
      })
  }

  /*calculateTotal(datasource: any) {
    let listProducto = datasource.filter(item => item.idEspecie !== 0 && item.tipo === 'FA');
    let listProductoNoMad = datasource.filter(item => item.idEspecie !== 0 && item.tipo === 'NOMAD');
    let listProductoMad = datasource.filter(item => item.idEspecie !== 0 && item.tipo === 'MAD');

   // this.getListProductosFauna(listProducto);
   // this.getListProductosNoMad(listProductoNoMad);
    this.getListProductosMad(listProductoMad);
   }*/

  getListProductosFauna(listProducto: any, totalRecords: any){
    this.totalToneladas = 0;
    listProducto.forEach(item => {
      if (item.unidadMedida === 'TON') {
        this.totalToneladas += Number(item.txCantidadProducto)
        item.txCantidadProducto = this.cutDecimalsWithoutRounding(item.txCantidadProducto, this.cantidad) ;
      }
      if (item.unidadMedida === 'KG') {
        this.totalToneladas += Number(item.txCantidadProducto) / 1000
        item.txCantidadProducto = Number(item.txCantidadProducto) / 1000
        item.txCantidadProducto = this.cutDecimalsWithoutRounding(item.txCantidadProducto, this.cantidad) ;
        item.unidadMedida = 'TON';
      }
      if (item.unidadMedida === 'GR') {
        this.totalToneladas += Number(item.txCantidadProducto) / 1000000
        item.txCantidadProducto = Number(item.txCantidadProducto) / 1000000
        item.txCantidadProducto = this.cutDecimalsWithoutRounding(item.txCantidadProducto, this.cantidad) ;
        item.unidadMedida = 'TON'
      }
    })

    let totalToneladasCalculada = this.cutDecimalsWithoutRounding(this.totalToneladas, this.cantidad) ;

    let element: RecursoProduco = new RecursoProduco();
    element =
      {
        nuIdRecursoProducto: 0,
        idEspecie: 0,
        nombreCientifico:'',
        nombreComun:'Total:',
        tipoProducto: "",
        tipo: "TOTAL",
        txCantidadProducto: Number(totalToneladasCalculada),
        unidadMedida: "TON"
      }

    listProducto.push(element);
    this.recursoResponseFauna.totalRecords = totalRecords;//this.totalRecordFauna; //listProducto.length - 1;
    this.dataSource = new MatTableDataSource<Recurso>(listProducto);
  }

  getListProductosNoMad(listProductoNoMad: any, totalRecords: any){
    this.totalToneladas = 0;
    let txCantidad;
    listProductoNoMad.forEach(item => {
      if (item.unidadMedida === 'TON') {
        this.totalToneladas += Number(item.txCantidadProducto)
        item.txCantidadProducto = this.cutDecimalsWithoutRounding(item.txCantidadProducto, this.cantidad) ;
      }
      if (item.unidadMedida === 'KG') {
        this.totalToneladas += Number(item.txCantidadProducto) / 1000
        item.txCantidadProducto = Number(item.txCantidadProducto) / 1000
        item.txCantidadProducto = this.cutDecimalsWithoutRounding(item.txCantidadProducto, this.cantidad) ;
        item.unidadMedida = 'TON'
      }
      if (item.unidadMedida === 'GR') {
        this.totalToneladas += Number(item.txCantidadProducto) / 1000000
        item.txCantidadProducto = Number(item.txCantidadProducto) / 1000000
        item.txCantidadProducto = this.cutDecimalsWithoutRounding(item.txCantidadProducto, this.cantidad) ;
        item.unidadMedida = 'TON'
      }
    })

    let totalToneladasCalculada = this.cutDecimalsWithoutRounding(this.totalToneladas, this.cantidad) ;

    let element: RecursoProduco = new RecursoProduco();
    element =
      {
        nuIdRecursoProducto: 0,
        idEspecie: 0,
        nombreCientifico:'',
        nombreComun:'Total:',
        tipoProducto: "",
        tipo: "TOTAL",
        txCantidadProducto: Number(totalToneladasCalculada),
        unidadMedida: "TON"
      }

    listProductoNoMad.push(element);
    this.recursoResponseNoMad.totalRecords = totalRecords;//listProductoNoMad.length - 1;
    this.dataSourceNoMad = new MatTableDataSource<Recurso>(listProductoNoMad);
  }

  getListProductosMad(listProductoMad: any){
    //console.log("listProductoMad-getListProductosMad",listProductoMad)
    this.totalToneladas = 0;
    this.totalM3 = 0;
    
    listProductoMad.forEach(item => {
     /* if (item.unidadMedida === 'TON') {
        this.totalToneladas += Number(item.txCantidadProducto)
        item.txCantidadProducto = this.cutDecimalsWithoutRounding(item.txCantidadProducto, this.cantidad) ;
      }
      if (item.unidadMedida === 'KG') {
        this.totalToneladas += Number(item.txCantidadProducto) / 1000
        item.txCantidadProducto = Number(item.txCantidadProducto) / 1000
        item.txCantidadProducto = this.cutDecimalsWithoutRounding(item.txCantidadProducto, this.cantidad) ;
        item.unidadMedida = 'TON'
      }
      if (item.unidadMedida === 'GR') {
        this.totalToneladas += Number(item.txCantidadProducto) / 1000000
        item.txCantidadProducto = Number(item.txCantidadProducto) / 1000000
        item.txCantidadProducto = this.cutDecimalsWithoutRounding(item.txCantidadProducto, this.cantidad) ;
        item.unidadMedida =  'TON'
      }*/
      if (item.unidadMedida === 'UND') {
        this.totalToneladas +=Number(item.txCantidadProducto);
      }
      this.totalM3+=Number(item.metroCubico);
    })

    //let totalToneladasCalculada = this.cutDecimalsWithoutRounding(this.totalToneladas, this.cantidad) ;

    let element: RecursoProduco = new RecursoProduco();
    element =
      {
        nuIdRecursoProducto: 0,
        idEspecie: 0,
        nombreCientifico:'',
        nombreComun:'Total:',
        tipoProducto: "",
        tipo: "TOTAL",
        txCantidadProducto: Number(this.totalToneladas),
        unidadMedida: "",
        metroCubico: this.totalM3
      }

    listProductoMad.push(element);
    this.dataSourceMad = new MatTableDataSource<Recurso>(listProductoMad);
  }

  cutDecimalsWithoutRounding(numFloat: number, toFixed: number) {

    let numFloat_bf = '0';
    let numFloat_af  = '0';

    if(this.redondeo === 'Mayor'){
      //////console.log("numFloat",numFloat);
      return (numFloat > 0) ? Number(numFloat).toFixed(this.cantidad): numFloat;
    } else{
      let isNegative = false;

        if ( numFloat < 0 ) {
          numFloat *= -1; // Equivale a Math.abs();     
          isNegative = true;
        }
        // Recogemos el valor ANTES del separador
         numFloat_bf = numFloat.toString().split('.')[0];
        // Recogemos el valor DESPUÉS del separador
         numFloat_af = numFloat.toString().split('.')[1];
  
        if(numFloat_af != null || numFloat_af != undefined){
          // Recortar los decimales según el valor de 'toFixed'
          if (numFloat_af.length > toFixed ) {
            numFloat_af = `.${numFloat_af.slice(0, -numFloat_af.length + toFixed)}`; 
          } else {
            numFloat_af = `.`+`${numFloat_af}`; 
          }

          return parseFloat(`${( isNegative ? '-': '' )}${numFloat_bf}${numFloat_af}`);
      } else {
        return (numFloat > 0) ? Number(numFloat).toFixed(this.cantidad): numFloat;
      }

    }

  }

  getRecursos2(idAlmacen: any) {
    this.lstrecursos=[];
    this.dataSource = new MatTableDataSource<Recurso>([])
    this._recursoService.getRecursoSearchVerProductos(null, null, null, null,null, idAlmacen,null,null,null,null,null,null,null,null,null,
      null,null,this.recursoResponse.pageNumber, this.recursoResponse.pageSize,'DESC')
      .subscribe((response: BandejaRecursoResponse) => {
        //////console.log("response.data", response.data);
        let contador:number=0;
        response.data.forEach((item:any) => {
          contador=0;
          if(this.lstrecursos.length>0){
            this.lstrecursos.forEach((item2:any) => {
              if(item.idEspecie===item2.idEspecie && contador== 0){
                item2.txCantidadProducto+=Number(item2.txCantidadProducto);
                const index = this.lstrecursos.indexOf(item2);
                this.lstrecursos[index] = item2;   
                contador++;
                
              }else{
                contador++;
              }

              if(contador>0){
                this.lstrecursos.push(item);
              }
            });
          }else{
            this.lstrecursos.push(item);
          }
        })
        //////console.log("this.lstrecursos", this.lstrecursos);
      })
  }

  searchUnidadMedida() {
    this.parametroService.getParametroSearch(this.unidadMedida).subscribe((response: Parametro[]) => {
      this.listUnidadMedida = response;
      //////console.log("listUnidadMedida",this.listUnidadMedida)
    });
  }

  pageDataSource(e: PageEvent, type: string): PageEvent {
    //console.log("e",e);
    //console.log("type",type);
    this.productosResponse.pageNumber = e.pageIndex;
    this.productosResponse.pageSize = e.pageSize;
    this.btnBuscarRecursos(type);
    return e;
  }

  actualizar() {
    this.registerAlmacen();
  }

  registerAlmacen() {
    let obj: Almacen = new Almacen();

    obj.nuIdAlmacen = this.dataAlmacen !== undefined ? this.dataAlmacen.nuIdAlmacen : 0;
    obj.txNombreAlmacen = this.inputRegistro.get('nombreAlmacen').value
    obj.txTipoAlmacen = this.inputRegistro.get('tipoAlmacen').value
    obj.txTipoDocumento = this.inputRegistro.get('tipoDocumento').value
    obj.txNumeroDocumento = this.inputRegistro.get('numeroDocumento').value
    obj.txNombresEncargado = this.inputRegistro.get('nombreEncargado').value
    obj.capacidadMaderable = this.inputRegistro.get('capacidadMaderable').value
    obj.capacidadNoMaderable = this.inputRegistro.get('capacidadNoMaderable').value
    obj.capacidadFauna = this.inputRegistro.get('capacidadFauna').value
    obj.txNumeroATF = this.inputRegistro.get('numeroATF').value
    obj.txPuestoControl = this.inputRegistro.get('puestoControl').value
    obj.foto = this.photo;
    obj.direccionAlmacen = this.inputRegistro.get('direccionAlmacen').value
    obj.lstAlmacenResponsable = this.listAlmacenResponsable;
    this.almacenService.postAlmacen(obj).subscribe((response: CreateAlmacenResponse) => {

      if (response.success) {

        Swal.fire({
          title: 'Mensaje de Confirmación',
          text: 'Almacén guardado correctamente.',
          icon: 'success',
          width: 350,
          // showCancelButton: true,
         // confirmButtonColor: '#3085d6',
         confirmButtonColor: '#C73410',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'ok'
        }).then((result) => {
          if (result.isConfirmed) {
          }
        })

        this._router.navigate(['bandeja-almacen']);

      } else {
        Swal.fire({
          title: 'Mensaje!',
          text: 'Error inesperado al registrar el almacén..',
          icon: 'error',
          width: 350,
          // showCancelButton: true,
         // confirmButtonColor: '#3085d6',
         confirmButtonColor: '#C73410',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'ok'
        }).then((result) => {
          if (result.isConfirmed) {
          }
        })

      }
    }, error => {
      //////console.log("error ", error)
    })


  }


  salidas() {
    let dataFiltered: Recurso[] = [];

    let dataFilteredFauna = this.dataSource.filteredData.filter((t: any) => t.flagAgregar === true);
    let dataFilteredNoMad = this.dataSourceNoMad.filteredData.filter((t: any) => t.flagAgregar === true);
    let dataFilteredMad = this.dataSourceMad.filteredData.filter((t: any) => t.flagAgregar === true);


    //Si sólo selecciona Fauna
    if((dataFilteredFauna.length !== 0 && dataFilteredNoMad.length === 0 && dataFilteredMad.length === 0)){
      //console.log('acá se abre nuevo modal');


      let dataFauna = [];

      //let dataFiltered = this.dataSource.filteredData.filter((t: any) => t.flagAgregar == true)
      let dataFiltered = dataFilteredFauna;
      let datos: Number[] = []
      dataFiltered.forEach((df: any) => {
        if (!datos.includes(df.nuIdRecurso)) {
          datos.push(df.nuIdRecurso);
        }
      });
  
      for (var i = 0; i < datos.length; i++) {
        const idRecurso = datos[i];
        let dataList = dataFiltered.filter(dat => dat.nuIdRecurso == idRecurso);
        if (dataList.length > 0) {
          let dataParam = {
            nuIdRecurso: idRecurso,
            lstTransferenciaDetalle: dataList
          }
          dataFauna.push(dataParam);
        }
      }
  
      //////console.log("dataBeneficiario", dataBeneficiario);
      const dialogRef = this._dialog.open(FaunaSalidaComponent, {
        width: '1000px',
        height: '500px',
        data: { idAlmacen: this.idAlmacen, data: dataFauna }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result == 1) {
          this.getRecursos(this.idAlmacen);
        }
      })


    }

    else{

    //Si no selecciona nada
    if((dataFilteredFauna.length === 0 && dataFilteredNoMad.length === 0 && dataFilteredMad.length === 0)){}
    else{

    //Si selecciona Flora y Fauna al mismo tiempo
    if((dataFilteredFauna.length !== 0 && dataFilteredNoMad.length !== 0 && dataFilteredMad.length !== 0) || (dataFilteredFauna.length !== 0 && dataFilteredNoMad.length) || (dataFilteredFauna.length !== 0 && dataFilteredMad.length))
    {   
      Swal.fire({
        title: 'Mensaje!',
        text: 'No debe seleccionar Flora y Fauna al mismo tiempo',
        icon: 'error',
        width: 350,
        // showCancelButton: true,
       // confirmButtonColor: '#3085d6',
       confirmButtonColor: '#C73410',
        // cancelButtonColor: '#d33',
        confirmButtonText: 'ok'
      }).then((result) => {
        if (result.isConfirmed) {
        }
      })
    }

    //Hace toda la lógica
    else{    
    
    let dataGeneralMad = [];
    let dataGeneralMadComp = dataFilteredMad.filter(x=>x.tipoIngreso=== 'Hallazgo');
    var contador = 0;
    if(dataFilteredMad.length > 0){
      
        dataFilteredMad
        .forEach((resp:any)=>{
          var descontar = resp.descontar;
          var descontarM3 = resp.descontarMetroCubico;
          if(resp.tipoIngreso=== 'Hallazgo'){
            this._recursoService.getRecursoSearchVerProductos(null, null, null, 
                                                              null,null, this.idAlmacen,null,null,resp.nombreCientifico,resp.nombreComun,null,null,null,null,resp.unidadMedida,
                                                              null,null,this.recursoResponseFauna.pageNumber, this.recursoResponseFauna.pageSize,'ASC')
                        .subscribe((response: BandejaRecursoResponse) => {
                
                response.data.filter(x=> Number(x.txCantidadProducto) > 0);
                response.data.forEach((item:any)=>{  
                  
                  if (descontar > 0 && descontar !== null && resp.txCantidadProducto != null && descontar !==undefined && resp.txCantidadProducto != undefined) {
                    if(descontar>=Number(item.txCantidadProducto)){
                      descontar = Number(descontar) - Number(item.txCantidadProducto);
                      item.descontar = Number(item.txCantidadProducto);
                    }else{
                      item.descontar = Number(descontar);
                      descontar=0;
                    }
                  }
  
                  if (descontarM3 > 0 && descontarM3 !== null && resp.metroCubico != null && descontarM3 !== undefined && resp.metroCubico != undefined) {
                    if(descontarM3>=Number(item.metroCubico)){
                      descontarM3 = Number(descontarM3) - Number(item.metroCubico);
                      item.descontarMetroCubico = Number(item.metroCubico);
                    }else{
                      item.descontarMetroCubico = Number(descontarM3);
                      descontarM3=0;
                    }
                  }
  
                  if((item.descontar !== null && item.descontar!==undefined) || (item.descontarMetroCubico !== null && item.descontarMetroCubico!==undefined)){
                    dataGeneralMad.push(item);
                    dataFiltered.push(item);
                  }
  
                })  
                contador++;
                if(contador == dataGeneralMadComp.length){
                  
                  if(dataFilteredFauna.length > 0){
                    dataFilteredFauna.forEach( fa => dataFiltered.push(fa))
                  }
              
                  if(dataFilteredNoMad.length > 0){
                    dataFilteredNoMad.forEach( nm => dataFiltered.push(nm))  
                  }
                  this.getSalidas(dataFiltered,contador);
                }
            })
          }else{
            if((descontar !== null && descontar !==undefined && resp.txCantidadProducto != null && resp.txCantidadProducto != undefined) || 
            (descontarM3 !== null && descontarM3 !== undefined && resp.metroCubico != null && resp.metroCubico != undefined)){
              dataGeneralMad.push(resp);
              dataFiltered.push(resp);
              if(dataGeneralMadComp.length==0){
                contador++;
              }
            }
          } 
        })

        if (dataGeneralMadComp.length == 0) {

          if (dataFilteredFauna.length > 0) {
            dataFilteredFauna.forEach(fa => dataFiltered.push(fa))
          }

          if (dataFilteredNoMad.length > 0) {
            dataFilteredNoMad.forEach(nm => dataFiltered.push(nm))
          }
          this.getSalidas(dataFiltered,contador);
        }
    }

    if(dataFilteredMad.length === 0){

      if(dataFilteredFauna.length > 0){
        dataFilteredFauna.forEach( fa => dataFiltered.push(fa))
      }
  
      if(dataFilteredNoMad.length > 0){
        dataFilteredNoMad.forEach( nm => dataFiltered.push(nm))  
      }

      contador++;

      this.getSalidas(dataFiltered,contador);

    }

     }
    }
  }
}

  getSalidas(dataFiltered: Recurso[], contador) {
    
    if (Number(contador) > 0) {
      let data = [];
      let datos: Number[] = []
      dataFiltered.forEach((df: any) => {
        if (!datos.includes(df.nuIdRecurso)) {
          datos.push(df.nuIdRecurso);
        }
      });
      for (var i = 0; i < datos.length; i++) {
        const idRecurso = datos[i];
        let dataList = dataFiltered.filter(dat => dat.nuIdRecurso == idRecurso);
        if (dataList.length > 0) {
          let dataParam = {
            nuIdRecurso: idRecurso, 
            lstTransferenciaDetalle: dataList
          }
          data.push(dataParam);
        }
      }
      const dialogRef = this._dialog.open(SalidasComponent, {
        width: '795px',
        height: '550px',
        data: { data: data, idAlmacen: this.idAlmacen }
      });
      dialogRef.afterClosed().subscribe(result => {
        //if (result != null && result == 1 && ) {
        this.getRecursos(this.idAlmacen);
        //}
      })
    }

  }


  openDialogBeneficiario(): void {
    let dataBeneficiario = [];

    let dataFiltered = this.dataSource.filteredData.filter((t: any) => t.flagAgregar == true)
    let datos: Number[] = []
    dataFiltered.forEach((df: any) => {
      if (!datos.includes(df.nuIdRecurso)) {
        datos.push(df.nuIdRecurso);
      }
    });

    for (var i = 0; i < datos.length; i++) {
      const idRecurso = datos[i];
      let dataList = dataFiltered.filter(dat => dat.nuIdRecurso == idRecurso);
      if (dataList.length > 0) {
        let dataParam = {
          nuIdRecurso: idRecurso,
          lstTransferenciaDetalle: dataList
        }
        dataBeneficiario.push(dataParam);
      }
    }

    //////console.log("dataBeneficiario", dataBeneficiario);
    const dialogRef = this._dialog.open(BeneficiarioComponent, {
      width: '1000px',
      height: '700px',
      data: { id: this.idAlmacen, data: dataBeneficiario }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result == 1) {
        this.getRecursos(this.idAlmacen);
      }
    })
  }

  openDialogAlmacen(): void {
    let data = [];
    
    let dataFiltered = this.dataSource.filteredData.filter((t: any) => t.flagAgregar == true)
    //console.log("dataFiltered ",dataFiltered)
    let datos: Number[] = []
    dataFiltered.forEach((df: any) => {
      if (!datos.includes(df.nuIdRecurso)) {
        datos.push(df.nuIdRecurso);
      }
    });

    for (var i = 0; i < datos.length; i++) {
      const idRecurso = datos[i];
      let dataList = dataFiltered.filter(dat => dat.nuIdRecurso == idRecurso);
      if (dataList.length > 0) {
        let dataParam = {
          nuIdRecurso: idRecurso,
          lstTransferenciaDetalle: dataList
        }
        data.push(dataParam);
      }
    }
    //console.log("data ",data)
    const dialogRef = this._dialog.open(AlmacenComponent, {
      width: '1100px',
      height: '700px',
      data: { data: data, idAlmacen: this.idAlmacen }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result == 1) {
        this.getRecursos(this.idAlmacen);
      }
    })
  }

  cancelar() {
    this._router.navigate(['bandeja-almacen']);
  }

  limpiarCampos(): void {
    this.inputProductos.get('numeroGuia').setValue('');
    this.inputProductos.get('numeroActa').setValue('');
    this.inputProductos.get('tipoIngresoForm').setValue('');
    this.inputProductos.get('nombreProducto').setValue('');
  }

  validarDNI() {
    //////console.log('validarDNI');
    let params = { "numDNIConsulta": this.inputRegistro.get("numeroDocumento").value }
    //////console.log("params ", params)
    this.pideService.consultarDNI(params).subscribe((result: any) => {
      //////console.log("result ", result)
      // 
      if (result.dataService && result.dataService) {
        this.validaDNIClass = true;
        if (result.dataService.datosPersona) {
          let persona = result.dataService.datosPersona;
          let nombres, paterno, materno;
          nombres = persona.prenombres != null ? persona.prenombres : '';
          paterno = persona.apPrimer != null ? persona.apPrimer : '';
          materno = persona.apSegundo != null ? persona.apSegundo : '';
          //////console.log("nombre ", result)
          this.inputRegistro.get("nombreEncargado").patchValue(nombres + ' ' + paterno + ' ' + materno);
          this.photo = persona.foto;
          Swal.fire({
            title: 'Mensaje de Confirmación',
            text: 'Se validó el DNI en RENIEC.',
            icon: 'success',
            width: 350,
            // showCancelButton: true,
           // confirmButtonColor: '#3085d6',
           confirmButtonColor: '#C73410',
            // cancelButtonColor: '#d33',
            confirmButtonText: 'ok'
          }).then((result) => {
            if (result.isConfirmed) {
            }
          })
        } else {

          Swal.fire({
            title: 'Mensaje de Confirmación',
            text: result.dataService.deResultado,
            icon: 'warning',
            width: 350,
            // showCancelButton: true,
           // confirmButtonColor: '#3085d6',
           confirmButtonColor: '#C73410',
            // cancelButtonColor: '#d33',
            confirmButtonText: 'ok'
          }).then((result) => {
            if (result.isConfirmed) {
            }
          })
        }
      } else {
        Swal.fire({
          title: 'Mensaje de error',
          text: 'Hay errores con el servicio de validación de DNI. Contactar con el administrador del sistema.',
          icon: 'error',
          width: 350,
          // showCancelButton: true,
         // confirmButtonColor: '#3085d6',
         confirmButtonColor: '#C73410',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'ok'
        }).then((result) => {
          if (result.isConfirmed) {
          }
        })
      }
    }, () => {

      // this.toast.error('Hay errores con el servicio de validación de DNI. Contactar con el administrador del sistema.');
    }
    )
  }

  async searchAlmacenResponsable() {
    this.dataSourceEncargado = new MatTableDataSource<AlmacenResponsable>([])
    this.almacenRequest.nuIdAlmacen = this.idAlmacen;   
    this.almacenService.getAlmacenResponsableSearch(this.almacenRequest,this.almacenResponse.pageNumber,this.almacenResponse.pageSize).subscribe((response:BandejaAlmacenResponse)=>{
      if(response.success){
        this.listAlmacenResponsable = response.data;
        this.almacenResponse = response;
        this.dataSourceEncargado = new MatTableDataSource<AlmacenResponsable>(response.data);
        this.resultsLength=response.totalRecords;
      }      
    })
  }

  seleccionarTodo(e:any){
    let datafilteredCheck = []
    this.dataSource.data.forEach( t=> t.flagAgregar = e.target.checked);
    if(e.target.checked == true){
      let dataFiltered = this.dataSource.data.filter((t: any) => t.flagAgregar == true)
      //////console.log("dataFiltered",dataFiltered)
      dataFiltered.forEach((df: any) => {
        const descontar = {
          "descontar": Number(df.txCantidadProducto)
        }
        datafilteredCheck.push(Object.assign(df,descontar))
      });
      this.dataSource.data = datafilteredCheck;
      //////console.log("datefiltered-seleccionarTodo",datafilteredCheck);
      } else {
        let dataFiltered = this.dataSource.data.filter((t: any) => t.flagAgregar == false)
        //////console.log("dataFiltered-else",dataFiltered)
        dataFiltered.forEach((df: any) => df.descontar = null );
        this.dataSource.data = dataFiltered;
      }
  } 

  openModalAlmacenResponsable(dataEncargado:AlmacenResponsable, type:String, index: any){
    const dialogRef = this._dialog.open(ModalAlmacenEncargadosComponent, {
      width: '1000px',
      height: '500px',
      data: { dataEncargado:dataEncargado, type: type }
    });
    dialogRef.afterClosed().subscribe(result => {  
      if (result !== null && result !== -1 && result !== undefined) {
        if(result.type === 'EDIT'){
          this.listAlmacenResponsable[index].tipoDocumento = result.tipoDocumento;
          this.listAlmacenResponsable[index].numeroDocumento = result.numeroDocumento;
          this.listAlmacenResponsable[index].nombresResponsable = result.nombresResponsable;

        } else {
          let indexNew = this.listAlmacenResponsable.indexOf(result,0);
          if(indexNew === -1){
            this.listAlmacenResponsable.push(result);
          }else{
            this.listAlmacenResponsable[indexNew] = result;
          }
        };

        this.dataSourceEncargado = new MatTableDataSource<AlmacenResponsable>(this.listAlmacenResponsable);
      }
    })
  }    

  eliminar(almacenResponsable:AlmacenResponsable) { 
    //////console.log("listAlmacenResponsable",this.listAlmacenResponsable);
    let index = this.listAlmacenResponsable.indexOf(almacenResponsable,0);
    //////console.log("index",index);
    //////console.log("almacenResponsable",almacenResponsable);
    
    if(almacenResponsable.idAlmacenResponsable !== 0)
    {
      Swal.fire({
        title: '¿Desea eliminar al responsable?',
        text: "Los cambios no se van a revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#43a047',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
            if (result.isConfirmed) {

              this.almacenService.deleteAlmacenResponsable(almacenResponsable.idAlmacenResponsable).subscribe((response: DeleteAlmacenResponsableResponse) => {
                //////console.log("response ", response)
                
                if(response.success)
                {
                  this.searchAlmacenResponsable();
                }
  
              }, error => {
                //////console.log("error ", error)
              })

            }
      })   
    }
    else {
        this.listAlmacenResponsable.splice(index,1);
        this.dataSourceEncargado = new MatTableDataSource<AlmacenResponsable>(this.listAlmacenResponsable);
    }
    
  }

  /*listFilterTotal() {
    this.productosResponse.data = this.dataSourceFilter.data;
    this.productosResponse.totalRecords = this.dataSourceFilter.data.length;
    //let actual = this.especieResponse.page * this.especieResponse.size
    this.productosResponse.data = this.productosResponse.data.slice(
      this.productosResponse.pageNumber,
      this.productosResponse.pageNumber + this.productosResponse.pageSize
    );
    //this.dataSource = this.productosResponse.data;
    this.calculateTotal(this.productosResponse.data);
  }*/

  listFilterTotalFauna(dataSourceFaunaFilter: any) {
    console.log("dataSourceFaunaFilter ",dataSourceFaunaFilter)
    this.productosResponse.data = [];
    ////console.log("this.dataSourceFaunaFilter.data",dataSourceFaunaFilter)
    this.productosResponse.data = dataSourceFaunaFilter;
    this.recursoResponseFauna.totalRecords = dataSourceFaunaFilter.length;
    this.recursoResponseFauna.pageSize = this.productosResponse.pageSize;
    let actual = this.productosResponse.pageNumber * this.productosResponse.pageSize;
    //if(this.productosResponse.totalRecords > 5){
      this.productosResponse.data = this.productosResponse.data.slice(
        actual,
        actual + this.productosResponse.pageSize
      );
      console.log("this.productosResponse.data ",this.productosResponse.data)
    this.dataSource = new MatTableDataSource<Recurso>(this.productosResponse.data);
    //this.dataSource = this.productosResponse.data;
   // this.getListProductosFauna(this.productosResponse.data);
  }

  listFilterTotalNoMad(dataSourceNoMadFilter: any) {
    console.log("this.dataSourceNoMadFilter.data",dataSourceNoMadFilter)
    this.productosResponse.data = [];
    this.productosResponse.data = dataSourceNoMadFilter;
    this.recursoResponseNoMad.totalRecords = dataSourceNoMadFilter.length;
    this.recursoResponseNoMad.pageSize = this.productosResponse.pageSize;
    let actual = this.productosResponse.pageNumber * this.productosResponse.pageSize;
    //if(this.productosResponse.totalRecords > 5){
      this.productosResponse.data = this.productosResponse.data.slice(
        actual,
        actual + this.productosResponse.pageSize
      );//this.productosResponse.data.length - 1;
      console.log("this.productosResponse.data ",this.productosResponse.data)
    this.dataSourceNoMad = new MatTableDataSource<Recurso>(this.productosResponse.data);
    //this.dataSource = this.productosResponse.data;
    //this.getListProductosNoMad(this.productosResponse.data);
  }

  listFilterTotalMad(dataSourceMadFilter: any) {
    //console.log("productosResponse",this.productosResponse);
    //console.log("this.dataSourceMadFilter.data",dataSourceMadFilter)
    //console.log("this.dataSourceMadFilter.length",dataSourceMadFilter.length)
    //console.log("this.productosResponse",this.productosResponse);

    this.productosResponse.data = [];
    this.productosResponse.data = dataSourceMadFilter;
    this.recursoResponseMad.totalRecords = dataSourceMadFilter.length;
    this.recursoResponseMad.pageSize = this.productosResponse.pageSize;
    let actual = this.productosResponse.pageNumber * this.productosResponse.pageSize;
    //if(this.productosResponse.totalRecords > 5){
      this.productosResponse.data = this.productosResponse.data.slice(
        actual,
        actual + this.productosResponse.pageSize
      );
    //}
    //this.dataSource = this.productosResponse.data;
    ////console.log("actual",actual)
    this.getListProductosMad(this.productosResponse.data);
  }

  /*btnBuscarRecursos() {
    let  listado: Recurso[] = [];
    this.queryFauna = this.inputProductos.get('nombreProducto').value;
    this.nroGuia = this.inputProductos.get('numeroGuia').value;
    this.nroActa = this.inputProductos.get('numeroActa').value;

    if((this.queryFauna == null || this.queryFauna == '') && (this.nroGuia == null || this.nroGuia == '') && (this.nroActa == null || this.nroActa == '') ){
      listado = this.dataSourceFilter.data;
      //////console.log("validación cero")
    } else {

      if(this.queryFauna !== null || this.queryFauna !== ''){
        //////console.log("validación uno")
        listado = this.dataSourceFilter.data.filter( (c: any) => c.nombreComun.toUpperCase().includes(this.queryFauna.toUpperCase())
      || c.nombreCientifico.toUpperCase().includes(this.queryFauna.toUpperCase()));
      
      } 
      if(this.nroGuia !== null && this.nroGuia !== undefined && this.nroGuia !== ''){
        listado = this.dataSourceFilter.data.filter( (c: any) => c.nroGuiaTransporteForestal.includes(this.nroGuia));
        
      }       
      if(this.nroActa !== null && this.nroActa !== undefined && this.nroActa !== ''){
        listado = this.dataSourceFilter.data.filter( (c: any) => c.numeroActa.includes(this.nroActa));
        
      }   
    }

    //////console.log("listado",listado);
    this.productosResponse.data = listado;
    this.productosResponse.totalRecords = listado.length;
    if(this.productosResponse.totalRecords > 10){
      this.productosResponse.data = this.productosResponse.data.slice(
        this.productosResponse.pageNumber,
        this.productosResponse.pageNumber + this.productosResponse.pageSize
      );
    }
    //////console.log("this.productosResponse.data",this.productosResponse.data);
    this.calculateTotal(this.productosResponse.data);
  }*/

  btnBuscar(){
    this.productosResponse.pageNumber = 0;
    this.productosResponse.pageSize = 10;
    this.productosResponse.previousPageIndex = 0;
    this.btnBuscarRecursos(this.typeRecurso);
  }

  btnBuscarRecursos(type: string) {
    let  listadoFauna: Recurso[] = [];
    let  listadoNoMad: Recurso[] = [];
    let  listadoMad: Recurso[] = [];

    let listadoFaunaNoAcumulado: Recurso[] = [];
    listadoFaunaNoAcumulado = this.dataSourceFaunaFilterActa.data;

    let listadoNoMadNoAcumulado: Recurso[] = [];
    listadoNoMadNoAcumulado = this.dataSourceNoMadFilterActa.data;

    let listadoMadNoAcumulado: Recurso[] = [];
    listadoMadNoAcumulado = this.dataSourceMadFilterActa.data;
    
    this.queryFauna = this.inputProductos.get('nombreProducto').value;
    this.nroGuia = this.inputProductos.get('numeroGuia').value;
    this.nroActa = this.inputProductos.get('numeroActa').value;
    this.tipoIngresoForm = this.inputProductos.get('tipoIngresoForm').value;
    listadoMad = this.dataSourceMadFilter.data;
    listadoFauna = this.dataSourceFaunaFilter.data;
    listadoNoMad = this.dataSourceNoMadFilter.data;
    ////console.log("this.tipoIngresoForm-btnBuscarRecursos", this.tipoIngresoForm)

    if((this.queryFauna == null || this.queryFauna == '') && (this.nroGuia == null || this.nroGuia == '') && (this.nroActa == null || this.nroActa == '') 
        && (this.tipoIngresoForm == null || this.tipoIngresoForm == '') ){
      listadoFauna = this.dataSourceFaunaFilter.data;
      listadoNoMad = this.dataSourceNoMadFilter.data;
      listadoMad = this.dataSourceMadFilter.data;
      //console.log('listadoFauna',listadoFauna);
      //console.log('listadoNoMad',listadoNoMad);
      //console.log('listadoMad',listadoMad);
    } else {

      if(this.queryFauna !== null || this.queryFauna !== ''){
        listadoFauna = listadoFauna.filter( (c: any) => c.nombreComun.toUpperCase().includes(this.queryFauna.toUpperCase())
      || c.nombreCientifico.toUpperCase().includes(this.queryFauna.toUpperCase()));
      } 
      if(this.nroGuia !== null && this.nroGuia !== undefined && this.nroGuia !== ''){
        listadoFauna = listadoFauna.filter( (c: any) => c.nroGuiaTransporteForestal.includes(this.nroGuia));
      }       
      if(this.nroActa !== null && this.nroActa !== undefined && this.nroActa !== ''){
        listadoFauna = listadoFaunaNoAcumulado.filter( (c: any) => c.numeroActa.includes(this.nroActa));
      } 
      if(this.tipoIngresoForm !== null && this.tipoIngresoForm !== undefined && this.tipoIngresoForm !== ''){
        listadoFauna = listadoFauna.filter( (c: any) => c.disponibilidadActa.includes(this.tipoIngresoForm));
      } 
      if(this.tipoIngresoForm !== null && this.tipoIngresoForm !== undefined && this.tipoIngresoForm !== '' && this.tipoIngresoForm === 'Hallazgo'){
        listadoFauna = listadoFauna.filter( (c: any) => c.tipoIngreso===this.tipoIngresoForm);
      }
      
      if(this.tipoIngresoForm !== null && this.tipoIngresoForm !== undefined && this.tipoIngresoForm !== '' && this.tipoIngresoForm !== 'Hallazgo'){
        listadoFauna = listadoFauna.filter( (c: any) => c.disponibilidadActa===this.tipoIngresoForm);
      }


      /*** NO MAD ***/
      if(this.queryFauna !== null || this.queryFauna !== ''){
        listadoNoMad = listadoNoMad.filter( (c: any) => c.nombreComun.toUpperCase().includes(this.queryFauna.toUpperCase())
      || c.nombreCientifico.toUpperCase().includes(this.queryFauna.toUpperCase()));
      } 
      if(this.nroGuia !== null && this.nroGuia !== undefined && this.nroGuia !== ''){
        listadoNoMad = listadoNoMad.filter( (c: any) => c.nroGuiaTransporteForestal.includes(this.nroGuia));
      }       
      if(this.nroActa !== null && this.nroActa !== undefined && this.nroActa !== ''){
        listadoNoMad = listadoNoMadNoAcumulado.filter( (c: any) => c.numeroActa.includes(this.nroActa));
      }
      if(this.tipoIngresoForm !== null && this.tipoIngresoForm !== undefined && this.tipoIngresoForm !== '' && this.tipoIngresoForm === 'Hallazgo'){
        listadoNoMad = listadoNoMad.filter( (c: any) => c.tipoIngreso===this.tipoIngresoForm);
      }
      
      if(this.tipoIngresoForm !== null && this.tipoIngresoForm !== undefined && this.tipoIngresoForm !== '' && this.tipoIngresoForm !== 'Hallazgo'){
        listadoNoMad = listadoNoMad.filter( (c: any) => c.disponibilidadActa===this.tipoIngresoForm);
      }

      /*** MAD ***/
      if(this.queryFauna !== null || this.queryFauna !== ''){

        listadoMad = listadoMad.filter( (c: any) => c.nombreComun.toUpperCase().includes(this.queryFauna.toUpperCase())
      || c.nombreCientifico.toUpperCase().includes(this.queryFauna.toUpperCase()));
      } 
      if(this.nroGuia !== null && this.nroGuia !== undefined && this.nroGuia !== ''){
        listadoMad = listadoMad.filter( (c: any) => c.nroGuiaTransporteForestal.includes(this.nroGuia));
      }       
      if(this.nroActa !== null && this.nroActa !== undefined && this.nroActa !== ''){
        listadoMad = listadoMadNoAcumulado.filter( (c: any) => c.numeroActa.includes(this.nroActa));
      }

      if(this.tipoIngresoForm !== null && this.tipoIngresoForm !== undefined && this.tipoIngresoForm !== '' && this.tipoIngresoForm === 'Hallazgo'){
        listadoMad = listadoMad.filter( (c: any) => c.tipoIngreso===this.tipoIngresoForm);
      }
      
      if(this.tipoIngresoForm !== null && this.tipoIngresoForm !== undefined && this.tipoIngresoForm !== '' && this.tipoIngresoForm !== 'Hallazgo'){
      listadoMad = listadoMad.filter( (c: any) => c.disponibilidadActa===this.tipoIngresoForm);
      }
    }

    if(type == 'M'){
      this.listFilterTotalMad(listadoMad);
    } else if( type == 'NM'){
      this.listFilterTotalNoMad(listadoNoMad);
    }else if( type == 'F'){
      this.listFilterTotalFauna(listadoNoMad);
    }else{
      this.listFilterTotalFauna(listadoFauna);
      this.listFilterTotalMad(listadoMad);
      this.listFilterTotalNoMad(listadoNoMad);
    }

  }

  searchTipoIngreso() {
    this.parametroService.getParametroSearch(this.tipoIngreso).subscribe((response: Parametro[]) => {
      this.listTipoIngreso = response;
    });
  }
  searchTipo() {
    this.parametroService.getParametroSearch(this.tipo).subscribe((response: Parametro[]) => {
      this.listTipo = response;
    });
  }

}
