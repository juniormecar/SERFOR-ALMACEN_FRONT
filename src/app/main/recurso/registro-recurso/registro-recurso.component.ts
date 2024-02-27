import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { Observable, Subject } from 'rxjs';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RegistroListSteps, RegistroStep } from './registroConstant';
import { Recurso } from 'app/shared/models/recurso.model';
import { RecursoService } from 'app/service/recurso.service';
import { BandejaRecursoResponse } from 'app/shared/models/response/bandeja-recurso-response';
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { RecursoProduco } from 'app/shared/models/recurso-producto.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormEspeciesComponent } from './modal/modal-form-especies/modal-form-especies.component';
import { Especie } from 'app/shared/models/especie.model';
import { Parametro } from 'app/shared/models/parametro.model';
import { ParametroService } from 'app/service/parametro.service';
import { Constants } from 'app/shared/models/util/constants';
import { CreateRecursoResponse } from 'app/shared/models/response/create-recurso-response';
import Swal from 'sweetalert2';
import { Almacen } from 'app/shared/models/almacen.model';
import { AlmacenService } from 'app/service/almacen.service';
import { BandejaAlmacenResponse } from 'app/shared/models/response/bandeja-almacen-response';
import { ModalEspecieCubicacionComponent } from './modal/modal-especie-cubicacion/modal-especie-cubicacion.component';
import { ModalFaunaDetalleComponent } from './modal/modal-fauna-detalle/modal-fauna-detalle.component';
import { ModalActaIntervencionComponent } from './modal/modal-acta-intervencion/modal-acta-intervencion.component';
import { PideService } from 'app/service/pide.service';
import { EspecieResponse } from 'app/shared/models/response/especie-response';
import { MatSort } from '@angular/material/sort';
import { CoreCentralService } from 'app/service/core-central.service';
import { Token } from 'app/shared/models/token.model';
import { finalize } from 'rxjs/operators';
import { EspecieRequest } from 'app/shared/models/request/flora';
import { Cubicacion } from 'app/shared/models/cubicacion.model';
import { CubicacionService } from 'app/service/cubicacion.service';
import { CubicacionResponse } from 'app/shared/models/response/cubicacion-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecursoPersona } from 'app/shared/models/recurso-persona.model';
import * as _moment from 'moment';
import { ModalPasComponent } from './modal/modal-pas/modal-pas.component';
import { RecursoPasResponse } from 'app/shared/models/response/recurso-pas-response';

//import {default as _rollupMoment} from 'moment';
import * as moment from 'moment';
//const moment = _rollupMoment || _moment;
import { MatTabGroup } from '@angular/material/tabs';
import { ArchivoService } from 'app/service/archivo.service';
import { DownloadFile } from 'app/shared/models/util/util';

interface General {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-registro-recurso',
  templateUrl: './registro-recurso.component.html',
  styleUrls: ['./registro-recurso.component.scss']
})

export class RegistroRecursoComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('fileInput') el!: ElementRef<HTMLInputElement>;
  file: File | null | string = null;
  onChange: any = () => { }
  showIcon: boolean = true
  accept: string = ".jpg, .png";
  acceptRecurso: string = ".pdf";
  tipoArchivoTablaCod: string[] = ["application/pdf", "image/png","image/jpg"];
  fileInfGenreal: any = {} ;

  origenes: General[] = [
    { value: 'CONC', viewValue: 'Concesión' },
    { value: 'PER', viewValue: 'Permiso' },
    { value: 'AUT', viewValue: 'Autorización' },
    { value: 'BOSLO', viewValue: 'Bosque Local' },
    { value: 'DESBOS', viewValue: 'Desbosque' },
    { value: 'CAMUSO', viewValue: 'Cambio de uso' },
    { value: 'PLANT', viewValue: 'Plantación' },
    { value: 'PLANCONSO', viewValue: 'Plan de Manejo consolidado' },
    { value: 'OTRO', viewValue: 'Otros' }
  ];

  listTipoDocumento: Parametro[] = [];
  listTipoProducto: Parametro[] = [];
  listTipoInfraccion: Parametro[] = [];
  listTipoSancion: Parametro[] = [];
  listTipoProductoAcerrada: Parametro[] = [];
  listTipoProductoRolliza: Parametro[] = [];
  listTipoPresMadTro: Parametro[] = [];
  listTipoPresMadPie: Parametro[] = [];
  listTipoPresNoMad: Parametro[] = [];
  listUnidadMedida: Parametro[] = [];
  listTipoProductoCata: Parametro[] = [];
  listAlmacen: Almacen[] = [];
  dataSource1 = new MatTableDataSource<Recurso>([]);
  tipoDocumento: string = Constants.TIPO_DOCUMENTO;
  tipoProducto: string = Constants.TIPO_PRODUCTO;
  tipoProductoAcerrada: string = Constants.SUB_PRODUCTO_ACERRADA;
  tipoProductoRolliza: string = Constants.SUB_PRODUCTO_ROLLIZA;
  presentacionMaderable: string = Constants.PRES_MADERABLE;
  presentacionNOMaderable: string = Constants.PRES_NOMADERABLE;
  tipoProductoCata: string = Constants.TIPO_PRODUCTO_CATA;
  unidadMedida: string = Constants.UNIDAD_MEDIDA;
  selection = new SelectionModel<Recurso>(true, []);
  almacenResponse: BandejaAlmacenResponse = new BandejaAlmacenResponse();
  recursoResponse: BandejaRecursoResponse = new BandejaRecursoResponse();
  listEspeciesSeleccionados: Especie[] = [];
  recursoRequest: Recurso = new Recurso();
  inputRegistro: FormGroup;
  favoriteSeason: string;
  totalToneladas: number = 0;
  totalM3: number = 0;
  otroDesc: boolean = false;
  numeroDocumento: string = '44691637';
  valueActaFlag:boolean = false;
  validActa: boolean = false;
  valueStringActa: String = '';
  flagRegistrar: boolean = true;
  flagCubicacion: boolean = false;
  cubicacionResponse: CubicacionResponse = new CubicacionResponse();
  totalVolumenPTconvertido: number = 0;
  fechaActual:any;
  horaActual:any;
  /******************************************* CATALOGO MADERABLE ********************************************************/
  listEspeciesCatalogo: Especie[] = [];
  listEspeciesMaderable: Especie[] = [];
  listEspeciesGeneral: Especie[] = [];
  listEspeciesGeneralNM: Especie[] = [];
  listEspeciesGeneralFA: Especie[] = [];
  dataSourceCatalogo = new MatTableDataSource<Especie>(this.listEspeciesCatalogo);
  displayedColumnsCatalogo = ['action', 'nameCientifico', 'nameComun', 'family'];
  selectionCatalogo = new SelectionModel<Especie>(true, []);
  name: string = "";
  especieResponse: EspecieResponse = new EspecieResponse();
  token: string;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatSort) sort: MatSort;
  listFloraMad: RecursoProduco[] = [];
  listFloraNoMad: RecursoProduco[] = [];
  listFauna: RecursoProduco[] = [];
  /***************************************** CATALOGO NO MADERABLE **********************************************************/
  listEspeciesCatalogoNoMad: Especie[] = [];
  listEspeciesNOMaderable: Especie[] = [];
  dataSourceCatalogoNoMad = new MatTableDataSource<Especie>(this.listEspeciesCatalogoNoMad);
  displayedColumnsCatalogoNoMad = ['action', 'nameCientifico', 'nameComun', 'family'];
  especieResponseNoMad: EspecieResponse = new EspecieResponse();
  /***************************************** CATALOGO FAUNA **********************************************************/
  listEspeciesCatalogoFA: Especie[] = [];
  listEspeciesFauna: Especie[] = [];
  dataSourceCatalogoFA = new MatTableDataSource<Especie>(this.listEspeciesCatalogoFA);
  displayedColumnsCatalogoFA = ['action', 'nameCientifico', 'nameComun', 'family'];
  especieResponseFauna: EspecieResponse = new EspecieResponse();
  page: number = 1;
  size: number = 3000;
  /********************************************* RECURSO PRODUCTO NO MADERABLE ******************************************************/
  listProductoNoMad: RecursoProduco[] = [];
  recursoResponseNoMad: BandejaRecursoResponse = new BandejaRecursoResponse();
  displayedColumnsNoMad = ['position', 'nameCientifico', 'nameComun', 'tipoAlmacenamiento', 'capacidadUnidad', 'cantidad', 'unidadMedida','total', 'archivo' ];
  dataSourceNoMad = new MatTableDataSource<RecursoProduco>(this.listProductoNoMad);
  totalToneladasNoMad: number = 0;
  /********************************************* RECURSO PRODUCTO FAUNA ******************************************************/
  listProductoFA: RecursoProduco[] = [];
  recursoResponseFA: BandejaRecursoResponse = new BandejaRecursoResponse();
  displayedColumnsFA = ['position', 'nameCientifico', 'nameComun', 'cantidad','detalle', 'archivo' ];
  dataSourceFA = new MatTableDataSource<RecursoProduco>(this.listProductoFA);
  totalToneladasFA: number = 0;
  /***************************************************************************************************/
  listRecursoProducto: RecursoProduco[] = [];
  listProducto: RecursoProduco[] = [];
  displayedColumns = ['position', 'nameCientifico', 'nameComun', 'tipoProducto', 'tipoSubProducto', 'cantidad', 'unidadMedida','action', 'cubicacion','archivo'];
  dataSource = new MatTableDataSource<RecursoProduco>(this.listProducto);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  course: RegistroStep[] = RegistroListSteps;
  animationDirection: 'left' | 'right' | 'none';
  courseStepContent: any;
  currentStep: number;
  titleStep: string = '';
  texto_boton: string = '';
  dataRecurso = new Recurso();
  idRecurso: string;
  listTipoIngreso: Parametro[] = [];
  tipoIngreso: string = Constants.TIPO_INGRESO;
  tipoInfraccion: string = Constants.TIPO_INFRACCION;
  tipoSancion: string = Constants.TIPO_SANCION;
  validaDNIClass: boolean = false;
  photo: string;
  Constants = Constants;
  tipoProductoCatalogo: string;
  nombreEspecie: string;
  cantidadCubicacion: number = 0;
  metroCubico:number=0;
  totalVolumenPT:number=0;
  totalVolumenM3:number=0;
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
  
  showArchivoRecurso: boolean = false;
  nuIdArchivoRecurso: number = 0;
  
  constructor(private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private recursoService: RecursoService,
    public _router: Router,
    public dialog: MatDialog,
    private parametroService: ParametroService,
    private almacenService: AlmacenService,
    private activaRoute: ActivatedRoute,
    private pideService: PideService,
    private cubicacionService: CubicacionService,
    private _matSnackBar: MatSnackBar,
    private _parametroService: ParametroService,
    private _servicioArchivo: ArchivoService,
    private coreCentralService: CoreCentralService) {
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
      fechaIngreso: ['', Validators.required],
      horaIngreso: [''],
      almacen: ['', Validators.required],
      numGuia: [''],
      nroActa: [''],
      tipoDoc: ['', Validators.required],
      numDoc: ['', Validators.required],
      tipoIngreso: ['', Validators.required],
      nombres: ['', Validators.required],
      direccion: ['', Validators.required],
      observaciones: [''],
      tipoInfraccion: ['', Validators.required],
      tipoSancion: ['', Validators.required],
      tipoDocCon: ['', Validators.required],
      numDocCon: ['', Validators.required],
      nombresCon: ['', Validators.required],
      placa: ['', Validators.required],
    });

    this.currentStep = 0;
    this.titleStep = this.course[0].title

    this.almacenResponse.pageNumber = 1;
    this.almacenResponse.pageSize = 1000;

    this.recursoResponse.pageNumber = 1;
    this.recursoResponse.pageSize = 1000;

    this.cubicacionResponse.pageNumber = 1;
    this.cubicacionResponse.pageSize = 10;


    this.dataRecurso = window.history.state.data;
    this.idRecurso = this.activaRoute.snapshot.paramMap.get('id');
    if (this.dataRecurso !== undefined) {
      this.inputRegistro.get('numGuia').patchValue(this.dataRecurso.txNroGuiaTransporteForestal);
      this.inputRegistro.get('nroActa').patchValue(this.dataRecurso.numeroActa);
      this.inputRegistro.get('tipoDoc').patchValue(this.dataRecurso.intervenido.tipoDocumento);
      this.inputRegistro.get('tipoIngreso').patchValue(this.dataRecurso.tipoIngreso);
      this.inputRegistro.get('numDoc').patchValue(this.dataRecurso.intervenido.numeroDocumento);
      this.inputRegistro.get('almacen').patchValue(this.dataRecurso.nuIdAlmacen);
      this.inputRegistro.get('tipoIngreso').patchValue(this.dataRecurso.tipoIngreso);
      this.inputRegistro.get('nombres').patchValue(this.dataRecurso.intervenido.nombresPersona);
      this.inputRegistro.get('direccion').patchValue(this.dataRecurso.direccion);
      this.inputRegistro.get('observaciones').patchValue(this.dataRecurso.txObservaciones);
      this.inputRegistro.get('tipoInfraccion').patchValue(this.dataRecurso.tipoInfraccion);
      this.inputRegistro.get('tipoSancion').patchValue(this.dataRecurso.tipoSancion);
      this.inputRegistro.get('tipoDocCon').patchValue(this.dataRecurso.conductor.tipoDocumento);
      this.inputRegistro.get('numDocCon').patchValue(this.dataRecurso.conductor.numeroDocumento);
      this.inputRegistro.get('nombresCon').patchValue(this.dataRecurso.conductor.nombresPersona);
      this.inputRegistro.get('placa').patchValue(this.dataRecurso.conductor.placa);
      this.inputRegistro.get('fechaIngreso').patchValue(this.dataRecurso.fechaIngreso);
      this.inputRegistro.get('horaIngreso').patchValue(this.dataRecurso.horaIngreso);
      this.fechaActual = this.dataRecurso.fechaIngreso;
      this.horaActual = this.dataRecurso.horaIngreso;
      this.photo = this.dataRecurso.foto;
      this.getRecursosEspecies(Number(this.idRecurso));
    }

    if (this.dataRecurso !== undefined) {
      this.texto_boton = 'Actualizar';
      this.flagRegistrar = false;
    } else {
      this.texto_boton = 'Registrar';
    }

    this.especieResponse.page = 1;
    this.especieResponse.size = 10;

    this.especieResponseNoMad.page = 1;
    this.especieResponseNoMad.size = 10;

    this.especieResponseFauna.page = 1;
    this.especieResponseFauna.size = 10;
    this.numeroDocumento = localStorage.getItem('usuario');
  }
  //-----------------------------------------------------------
  step = 0;

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
  //---------------------------------------------------------

  ngOnInit(): void {    
    this.setStep(5);
    this.searchTipoDocumento();
    this.searchTipoInfraccion();
    this.searchTipoSancion();
    this.searchTipoProducto();
    this.searchUnidadMedida();
    this.searchTipoIngreso();
    this.searchAlmacen();
    this.searchTipoProductoCata();
    this.searchTipoProductoAcerrada();
    this.searchTipoProductoRolliza();
    this.searchPresentacionTro();
    this.searchPresentacionPie();
    this.searchPresentacionNoMad();
    this.especieResponse.page = 1;
    this.especieResponse.size = 10;
    this.especieResponseNoMad.page = 1;
    this.especieResponseNoMad.size = 10;
    //this.getToken();
    this.getTokenNew();
    //this.getCubicacion();
    this.getSettingDecimal();
    this.fechaActual = this.fechaActual === undefined ? _moment() : this.fechaActual;
    this.horaActual = this.horaActual === undefined ? _moment(new Date()).format('HH:mm') : this.horaActual;
  }

 /* getToken() {

    let obj: Token = new Token();
    obj.codigoAplicacion = "MC";
    obj.mensaje = "string";
    obj.origen = "1";
    obj.password = "123";
    obj.passwordNew = "string";
    obj.requiereCambioContrasenia = "true";
    obj.token = "string";
    obj.tokenRecaptcha = "string";
    obj.username = "SUPERADMIN";


    this.coreCentralService.getToken(obj)
      .pipe(finalize(() => this.Search()))
      .subscribe((response: any) => {
        this.token = response.token;
      })
  }
*/
  getTokenNew() {

    let obj: Token = new Token();
    obj.username = "userAlmacenAPP";
    obj.password = "5Sit066VJMrmOoLvaXHk7Z9b";

    this.coreCentralService.getTokenNew(obj)
      .pipe(finalize(() => this.SearchIniMaderable()))
      .subscribe((response: any) => {
        this.token = response.token;
      })
  }

  async SearchIniMaderable() {
    let params = '1';
    this.coreCentralService.ListaPorFiltroEspecieForestalNew(params, this.token)
      .pipe(finalize(() => this.SearchIniNoMaderable()))
      .subscribe((response: EspecieResponse) => {
        this.listEspeciesMaderable = response.data;
        let contador=0;
        this.listEspeciesMaderable.forEach(item => {
          contador++;
          item.idEspecie=contador;
          //aca
          this.listProducto.forEach(resp => {
            if (item.idEspecie === resp.idEspecie) {
              item.add = true;
            }
          })
        });
       this.listEspeciesMaderable= this.listEspeciesMaderable.filter(result=>result.idEspecie!==11);
       console.log("this.listEspeciesMaderable ",this.listEspeciesMaderable)
      })
  }

  async SearchIniNoMaderable() {
    let params = '0';
    this.coreCentralService.ListaPorFiltroEspecieForestalNew(params, this.token)
      .pipe(finalize(() => this.SearchFaunaInit()))
      .subscribe((response: EspecieResponse) => {
        this.listEspeciesNOMaderable = response.data;
        let contador=0;
        this.listEspeciesNOMaderable.forEach(item => {
          contador++;
          item.idEspecie=contador;
          this.listProductoNoMad.forEach(resp => {
            if (item.idEspecie === resp.idEspecie) {
              item.add = true;
            }
          })
        });
      })
  }

  async SearchFaunaInit() {

    let params = '1';
    this.coreCentralService.ListaPorFaunaNew(params, this.token)
      .subscribe((response: any) => {
        this.listEspeciesCatalogoFA = response.data;
        console.log("this.listProductoFA ",this.listProductoFA)
        this.listEspeciesCatalogoFA.forEach(item => {
          this.listProductoFA.forEach(resp => {
            if (item.id === resp.idEspecie) {
              item.add = true;
            }
          })
        });
        console.log("this.listEspeciesCatalogoFA ",this.listEspeciesCatalogoFA)
      });
  }

  async SearchMaderable() {
    this.dataSourceCatalogo = new MatTableDataSource<Especie>([])
    this.especieResponse.data = this.listEspeciesMaderable;
    this.especieResponse.totalRecords = this.listEspeciesMaderable.length;
    let actual = this.especieResponse.page * this.especieResponse.size
    this.especieResponse.data = this.especieResponse.data.slice(
      actual,
      actual+this.especieResponse.size
    );
    this.dataSourceCatalogo = new MatTableDataSource<Especie>(this.especieResponse.data);
  }

  async SearchMaderableName() {
    if(this.nombreEspecie !== undefined && this.nombreEspecie!== null){
      if (this.nombreEspecie.length > 2) {
        this.listEspeciesGeneral = [];
        this.dataSourceCatalogo = new MatTableDataSource<Especie>([]);
        this.listEspeciesGeneral = this.listEspeciesMaderable.filter((c: Especie) => c.nombreComun.toUpperCase().includes(this.nombreEspecie.toUpperCase())
          || c.nombreCientifico.toUpperCase().includes(this.nombreEspecie.toUpperCase()));
        this.especieResponse.data = this.listEspeciesGeneral;
        this.especieResponse.totalRecords = this.listEspeciesGeneral.length;
        if (this.especieResponse.totalRecords >= 10) {
          let actual = this.especieResponse.page * this.especieResponse.size
          this.especieResponse.data = this.especieResponse.data.slice(
            (actual - this.recursoResponse.pageSize)+1,
            actual
          );
        }
        this.dataSourceCatalogo = new MatTableDataSource<Especie>(this.especieResponse.data);
      } else if (this.nombreEspecie.length === 0) {
        this.SearchMaderable();
      }
    }
  }

  async SearchNOMaderable() {
    this.dataSourceCatalogoNoMad = new MatTableDataSource<Especie>([])
    this.especieResponseNoMad.data = this.listEspeciesNOMaderable;
    this.especieResponseNoMad.totalRecords = this.listEspeciesNOMaderable.length;
    if (this.especieResponseNoMad.totalRecords >= 10) {
      let actual = this.especieResponseNoMad.page * this.especieResponseNoMad.size
      this.especieResponseNoMad.data = this.especieResponseNoMad.data.slice(
        (actual - this.especieResponseNoMad.size)+1,
        actual
      );
    }
    this.dataSourceCatalogoNoMad = new MatTableDataSource<Especie>(this.especieResponseNoMad.data);
  }

  async SearchNOMaderableName() {
    if (this.nombreEspecie !== undefined && this.nombreEspecie !== null) {
      if (this.nombreEspecie.length > 2) {
        this.listEspeciesGeneralNM = [];
        this.dataSourceCatalogoNoMad = new MatTableDataSource<Especie>([])
        this.listEspeciesGeneralNM = this.listEspeciesNOMaderable.filter((c: Especie) => c.nombreComun.toUpperCase().includes(this.nombreEspecie.toUpperCase())
          || c.nombreCientifico.toUpperCase().includes(this.nombreEspecie.toUpperCase()));
        this.especieResponseNoMad.data = this.listEspeciesGeneralNM;
        this.especieResponseNoMad.totalRecords = this.listEspeciesGeneralNM.length;
        if (this.especieResponseNoMad.totalRecords >= 10) {
          let actual = this.especieResponseNoMad.page * this.especieResponseNoMad.size
          this.especieResponseNoMad.data = this.especieResponseNoMad.data.slice(
            (actual - this.especieResponseNoMad.size) + 1,
            actual
          );
        }
        this.dataSourceCatalogoNoMad = new MatTableDataSource<Especie>(this.especieResponseNoMad.data);
      } else if (this.nombreEspecie.length === 0) {
        this.SearchNOMaderable();
      }
    }
  }

  async SearchFauna() {
    this.dataSourceCatalogoFA = new MatTableDataSource<Especie>([])
    this.especieResponseFauna.data = this.listEspeciesCatalogoFA;
    this.especieResponseFauna.totalRecords = this.listEspeciesCatalogoFA.length;
    let actual = this.especieResponseFauna.page * this.especieResponseFauna.size
    this.especieResponseFauna.data = this.especieResponseFauna.data.slice(
      actual,
      actual+this.especieResponseFauna.size
    );
    this.dataSourceCatalogoFA = new MatTableDataSource<Especie>(this.especieResponseFauna.data);
  }

  async SearchFaunaName() {
    if (this.nombreEspecie !== undefined && this.nombreEspecie !== null) {
      if (this.nombreEspecie.length > 2) {
        this.listEspeciesGeneral = [];
        this.dataSourceCatalogoFA = new MatTableDataSource<Especie>([])
        this.listEspeciesGeneralFA = this.listEspeciesCatalogoFA.filter((c: Especie) => c.nombreComun.toUpperCase().includes(this.nombreEspecie.toUpperCase())
          || c.nombreCientifico.toUpperCase().includes(this.nombreEspecie.toUpperCase()));
        this.especieResponseFauna.data = this.listEspeciesGeneralFA;
        this.especieResponseFauna.totalRecords = this.listEspeciesGeneralFA.length;
        if (this.especieResponseFauna.totalRecords >= 10) {
          let actual = this.especieResponseFauna.page * this.especieResponseFauna.size
          this.especieResponseFauna.data = this.especieResponseFauna.data.slice(
            (actual - this.especieResponseFauna.size) + 1,
            actual
          );
        }
        this.dataSourceCatalogoFA = new MatTableDataSource<Especie>(this.especieResponseFauna.data);
      } else if (this.nombreEspecie.length === 0) {
        this.SearchFauna();
      }
    }
  }



  agregarMaderable(): void {
    this.listProducto = this.listProducto.filter(item => item.idEspecie !== 0);
    let element: RecursoProduco = new RecursoProduco();

    if(this.inputRegistro.get('tipoIngreso').value === 'TIPINGRNOR'){
      element.disponibilidadActa = 'D'
    }
    if(this.inputRegistro.get('tipoIngreso').value === 'TIPINGRINTER'){
      element.disponibilidadActa = 'ND'
    }

    element.nuIdRecursoProducto = 0;
    element.idEspecie = 999999;
    element.nombreCientifico = "";
    element.nombreComun = "";
    element.tipoProducto = "";
    //element.txCantidadProducto = 0;
    element.unidadMedida = "UND";
    element.idUsuarioRegistro = 1;
    element.tipoSubProducto = "";
    element.type = Constants.MADERABLE;
    this.listProducto.push(element);
    this.listRecursoProducto.push(element);
    this.calculateTotal();
  }

  agregarNoMaderable(): void {
    this.listProductoNoMad = this.listProductoNoMad.filter(item => item.idEspecie !== 0);
      let element: RecursoProduco = new RecursoProduco();
      if(this.inputRegistro.get('tipoIngreso').value === 'TIPINGRNOR'){
        element.disponibilidadActa = 'D'
      }
      if(this.inputRegistro.get('tipoIngreso').value === 'TIPINGRINTER'){
        element.disponibilidadActa = 'ND'
      }
      element.nuIdRecursoProducto = 0;
      element.idEspecie = 999999;
      element.nombreCientifico = "";
      element.nombreComun = "";
      element.tipoAlmacenamiento = "";
     // element.capacidadUnidad = "0";
      element.tipoProducto = "";
      //element.txCantidadProducto = 0;
      element.unidadMedida = "UND";
      element.idUsuarioRegistro = 1;
      element.type = Constants.NOMADERABLE;
      this.listProductoNoMad.push(element);
      this.listRecursoProducto.push(element);
      this.calculateTotalNoMad();
  }

  agregarFauna(): void {
    this.listProductoFA = this.listProductoFA.filter(item => item.idEspecie !== 0);
      let element: RecursoProduco = new RecursoProduco();     
      element.disponibilidadActa = 'D'     
      element.nuIdRecursoProducto = 0;
      element.idEspecie = 999999;
      element.nombreCientifico = "";
      element.nombreComun = "";
      element.tipoProducto = "";
     // element.txCantidadProducto = 0;
      element.unidadMedida = "UND";
      element.idUsuarioRegistro = 1;
      element.type = Constants.FAUNA;
      this.listProductoFA.push(element);
      this.listRecursoProducto.push(element);
      this.dataSourceFA = new MatTableDataSource<RecursoProduco>(this.listProductoFA);
  }

  agregar(obj: Especie): void {
    if (this.tipoProductoCatalogo === Constants.PRODUCTO_MADERABLE) {
      this.listEspeciesMaderable.forEach(item => {
        if (item.idEspecie === obj.idEspecie) {
          item.add = true;
        }
      });
      /*this.dataSourceCatalogo = new MatTableDataSource<Especie>([])
      this.especieResponse.data = this.listEspeciesMaderable;
      this.especieResponse.totalRecords = this.listEspeciesMaderable.length;
      let actual = this.especieResponse.page * this.especieResponse.size
      this.especieResponse.data = this.especieResponse.data.slice(
        actual,
        actual+this.especieResponse.size
      );
      this.dataSourceCatalogo = new MatTableDataSource<Especie>(this.especieResponse.data);*/
      this.SearchMaderableName();
      /************************************************************************************/
      this.listProducto = this.listProducto.filter(item => item.idEspecie !== 0);
      let element: RecursoProduco = new RecursoProduco();
      if(this.inputRegistro.get('tipoIngreso').value === 'TIPINGRNOR'){
        element.disponibilidadActa = Constants.DISPONIBLE;
      }
      if(this.inputRegistro.get('tipoIngreso').value === 'TIPINGRINTER'){
        element.disponibilidadActa = Constants.NO_DISPONIBLE;
      }
      element.nuIdRecursoProducto = 0;
      element.idEspecie = obj.idEspecie;
      element.nombreCientifico = obj.nombreCientifico;
      element.nombreComun = obj.nombreComun;
      element.tipoProducto = "";
      if(Number(obj.cantidad) >= 0){
        element.txCantidadProducto = Number(obj.cantidad);
      }
      element.unidadMedida = "UND";
      element.idUsuarioRegistro = 1;
      element.tipoSubProducto = "";
      element.type = Constants.MADERABLE;
      this.listProducto.push(element);
      //console.log("this.listProducto ",this.listProducto)
      this.listRecursoProducto.push(element);
      this.calculateTotal();
    } else if (this.tipoProductoCatalogo === Constants.PRODUCTO_NOMADERABLE) {
      this.listEspeciesNOMaderable.forEach(item => {
        if (item.idEspecie === obj.idEspecie) {
          item.add = true;
        }
      });
      /*this.dataSourceCatalogoNoMad = new MatTableDataSource<Especie>([])
      this.especieResponseNoMad.data = this.listEspeciesNOMaderable;
      this.especieResponseNoMad.totalRecords = this.listEspeciesNOMaderable.length;
      if (this.especieResponseNoMad.totalRecords >= 10) {
        let actual = this.especieResponseNoMad.page * this.especieResponseNoMad.size
        this.especieResponseNoMad.data = this.especieResponseNoMad.data.slice(
          (actual - this.especieResponseNoMad.size)+1,
          actual
        );
      }
      this.dataSourceCatalogoNoMad = new MatTableDataSource<Especie>(this.especieResponseNoMad.data);*/
      this.SearchNOMaderableName();
      /************************************************************************************/
      this.listProductoNoMad = this.listProductoNoMad.filter(item => item.idEspecie !== 0);
      let element: RecursoProduco = new RecursoProduco();
      element.nuIdRecursoProducto = 0;
      if(this.inputRegistro.get('tipoIngreso').value === 'TIPINGRNOR'){
        element.disponibilidadActa = Constants.DISPONIBLE;
      }
      if(this.inputRegistro.get('tipoIngreso').value === 'TIPINGRINTER'){
        element.disponibilidadActa = Constants.NO_DISPONIBLE; 
      }
      element.idEspecie = obj.idEspecie;
      element.nombreCientifico = obj.nombreCientifico;
      element.nombreComun = obj.nombreComun;
      element.tipoAlmacenamiento = "";
      //element.capacidadUnidad = "0";
      element.tipoProducto = "";
      if(Number(obj.cantidad) >= 0){
        element.txCantidadProducto = Number(obj.cantidad);
      }
      element.unidadMedida = "UND";
      element.idUsuarioRegistro = 1;
      element.type = Constants.NOMADERABLE;
      this.listProductoNoMad.push(element);
      this.listRecursoProducto.push(element);
      this.calculateTotalNoMad();
    } else if (this.tipoProductoCatalogo === Constants.PRODUCTO_FAUNA) {
      this.listEspeciesCatalogoFA.forEach(item => {
        if (item.id === obj.id) {
          item.add = true;
        }
      });
      /*this.dataSourceCatalogoFA = new MatTableDataSource<Especie>([])
      this.especieResponseFauna.data = this.listEspeciesCatalogoFA;
      this.especieResponseFauna.totalRecords = this.listEspeciesCatalogoFA.length;
      let actual = this.especieResponseFauna.page * this.especieResponseFauna.size
      this.especieResponseFauna.data = this.especieResponseFauna.data.slice(
        actual,
        actual+this.especieResponse.size
      );
      this.dataSourceCatalogoFA = new MatTableDataSource<Especie>(this.especieResponseFauna.data);*/
      this.SearchFaunaName();
      /************************************************************************************/
      this.listProductoFA = this.listProductoFA.filter(item => item.idEspecie !== 0);
      let element: RecursoProduco = new RecursoProduco();
      element.disponibilidadActa = Constants.DISPONIBLE      
      element.nuIdRecursoProducto = 0;
      element.idEspecie = obj.id;
      element.nombreCientifico = obj.nombreCientifico;
      element.nombreComun = obj.nombreComun;
      element.tipoProducto = "";
      if(Number(obj.cantidad) >= 0){
        element.txCantidadProducto = Number(obj.cantidad);
      }
      element.unidadMedida = "UND";
      element.idUsuarioRegistro = 1;
      element.type = Constants.FAUNA;
      this.listProductoFA.push(element);
      this.listRecursoProducto.push(element);
      this.dataSourceFA = new MatTableDataSource<RecursoProduco>(this.listProductoFA);
    }
  }

  async search() {
    if (this.tipoProductoCatalogo === Constants.PRODUCTO_MADERABLE) {
      this.SearchMaderable();
      this.nombreEspecie = '';
    } else if (this.tipoProductoCatalogo === Constants.PRODUCTO_NOMADERABLE) {
      this.SearchNOMaderable();
      this.nombreEspecie = '';
    } else if (this.tipoProductoCatalogo === Constants.PRODUCTO_FAUNA) {
      this.SearchFauna();
      this.nombreEspecie = '';
    }
    
  }

  async searchNombre() {
    if (this.tipoProductoCatalogo === Constants.PRODUCTO_MADERABLE) {
      this.SearchMaderableName();
    } else if (this.tipoProductoCatalogo === Constants.PRODUCTO_NOMADERABLE) {
      this.SearchNOMaderableName();
    } else if (this.tipoProductoCatalogo === Constants.PRODUCTO_FAUNA) {
      this.SearchFaunaName();
    }
  }

  pageDataSourceCatalogo(e: PageEvent): PageEvent {
    if (this.nombreEspecie.length > 2) {
      if (this.tipoProductoCatalogo === Constants.PRODUCTO_MADERABLE) {
        this.especieResponse.page = e.pageIndex + 1;
        this.especieResponse.size = e.pageSize;
        this.SearchMaderableName();
      } else if (this.tipoProductoCatalogo === Constants.PRODUCTO_NOMADERABLE) {
        this.especieResponseNoMad.page = e.pageIndex + 1;
        this.especieResponseNoMad.size = e.pageSize;
        this.SearchNOMaderableName();
      } else if (this.tipoProductoCatalogo === Constants.PRODUCTO_FAUNA) {
        this.especieResponseFauna.page = e.pageIndex + 1;
        this.especieResponseFauna.size = e.pageSize;
        this.SearchFaunaName();
      }
    } else if (this.nombreEspecie.length === 0) {
      if (this.tipoProductoCatalogo === Constants.PRODUCTO_MADERABLE) {
        this.especieResponse.page = e.pageIndex + 1;
        this.especieResponse.size = e.pageSize;
        this.SearchMaderable();
      } else if (this.tipoProductoCatalogo === Constants.PRODUCTO_NOMADERABLE) {
        this.especieResponseNoMad.page = e.pageIndex + 1;
        this.especieResponseNoMad.size = e.pageSize;
        this.SearchNOMaderable();
      } else if (this.tipoProductoCatalogo === Constants.PRODUCTO_FAUNA) {
        this.especieResponseFauna.page = e.pageIndex + 1;
        this.especieResponseFauna.size = e.pageSize;
        this.SearchFauna();
      }
    }
    return e;
  }


  getRecursosEspecies(idRecurso: number) {

    this.dataSource = new MatTableDataSource<RecursoProduco>([])
    this.dataSourceNoMad = new MatTableDataSource<RecursoProduco>([])
    this.dataSourceFA = new MatTableDataSource<RecursoProduco>([])
    this.recursoService.getRecursoEspeciesSearch(null, idRecurso,
      this.recursoResponse.pageNumber, this.recursoResponse.pageSize)
      .subscribe((response: BandejaRecursoResponse) => {
        this.listRecursoProducto = response.data
        this.listProducto = response.data.filter(item => item.type === Constants.MADERABLE);
        this.listProductoNoMad = response.data.filter(item => item.type === Constants.NOMADERABLE);
        this.listProductoFA = response.data.filter(item => item.type === Constants.FAUNA);
        this.dataSourceFA = new MatTableDataSource<RecursoProduco>(this.listProductoFA);
        this.calculateTotal();
        this.calculateTotalNoMad();
        this.validarFileRecuso(response.data)
      });
  }

  validarFileRecuso(data: Recurso[]){
    console.log("validarFileRecuso-data", data);
    if(data !=null && data != undefined && data.length > 0){
      if(data[0].nuIdArchivoRecurso != null && data[0].nuIdArchivoRecurso != undefined
        && data[0].nuIdArchivoRecurso != '0'){
          console.log("ingreso")
          this.showArchivoRecurso = true;
          this.nuIdArchivoRecurso = Number(data[0].nuIdArchivoRecurso);
        }
    }
  }

  delete(obj: Especie): void {
    this.listEspeciesMaderable.forEach(item => {
      if (item.idEspecie === obj.idEspecie)  {
        item.add = false;
      }
    });
    this.dataSourceCatalogo = new MatTableDataSource<Especie>([])
    this.especieResponse.data = this.listEspeciesMaderable;
    this.especieResponse.totalRecords = this.listEspeciesMaderable.length;
    let actual = this.especieResponse.page * this.especieResponse.size
    this.especieResponse.data = this.especieResponse.data.slice(
      actual,
      actual+this.especieResponse.size
    );
    this.dataSourceCatalogo = new MatTableDataSource<Especie>(this.especieResponse.data);
    /************************************************************************************/
    this.listProducto = this.listProducto.filter(item => item.idEspecie !== 0);
    var index = this.listProducto.map(x => {
      return x.idEspecie;
    }).indexOf(obj.idEspecie);

    var index2 = this.listRecursoProducto.map(x => {
      return x.idEspecie;
    }).indexOf(obj.idEspecie);

    if (this.listProducto[index].nuIdRecursoProducto !== 0) {

      Swal.fire({
        title: '¿Desea eliminar el producto maderable seleccionado?',
        text: "Los cambios no se van a revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#43a047',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {

        if (result.isConfirmed) {

          this.recursoService.deleteRecursoProducto(this.listProducto[index].nuIdRecursoProducto).subscribe((response: any) => {
            if (response.success) {
              this.listProducto.splice(index, 1);
              this.listRecursoProducto.splice(index2, 1);
              this.calculateTotal();
            }
          }, error => {
          })
        }
      })
    } else {
      this.listProducto.splice(index, 1);
      this.listRecursoProducto.splice(index2, 1);
      this.calculateTotal();
    }


  }

  deleteNoMad(obj: Especie): void {
    this.listEspeciesNOMaderable.forEach(item => {
      if (item.idEspecie === obj.idEspecie)  {
        item.add = false;
      }
    });
    this.dataSourceCatalogoNoMad = new MatTableDataSource<Especie>([])
    this.especieResponseNoMad.data = this.listEspeciesNOMaderable;
    this.especieResponseNoMad.totalRecords = this.listEspeciesNOMaderable.length;
    if (this.especieResponseNoMad.totalRecords >= 10) {
      let actual = this.especieResponseNoMad.page * this.especieResponseNoMad.size
      this.especieResponseNoMad.data = this.especieResponseNoMad.data.slice(
        (actual - this.especieResponseNoMad.size)+1,
        actual
      );
    }
    this.dataSourceCatalogoNoMad = new MatTableDataSource<Especie>(this.especieResponseNoMad.data);
    /************************************************************************************/
    this.listProductoNoMad = this.listProductoNoMad.filter(item => item.idEspecie !== 0);
    var index = this.listProductoNoMad.map(x => {
      return x.idEspecie;
    }).indexOf(obj.idEspecie);
    var index2 = this.listRecursoProducto.map(x => {
      return x.idEspecie;
    }).indexOf(obj.idEspecie);

    if (this.listProductoNoMad[index].nuIdRecursoProducto !== 0) {

      Swal.fire({
        title: '¿Desea eliminar el producto no maderable seleccionado?',
        text: "Los cambios no se van a revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#43a047',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {

        if (result.isConfirmed) {

          this.recursoService.deleteRecursoProducto(this.listProductoNoMad[index].nuIdRecursoProducto).subscribe((response: any) => {
            if (response.success) {
              this.listProductoNoMad.splice(index, 1);
              this.listRecursoProducto.splice(index2, 1);
              this.calculateTotalNoMad();
            }
          }, error => {
          })
        }
      })
    } else {
      this.listProductoNoMad.splice(index, 1);
      this.listRecursoProducto.splice(index2, 1);
      this.calculateTotalNoMad();
    }


  }

  deleteFauna(obj: Especie): void {
    this.listEspeciesCatalogoFA.forEach(item => {
      if (item.id === obj.idEspecie) {
        item.add = false;
      }
    });
    this.dataSourceCatalogoFA = new MatTableDataSource<Especie>([])
    this.especieResponseFauna.data = this.listEspeciesCatalogoFA;
    this.especieResponseFauna.totalRecords = this.listEspeciesCatalogoFA.length;
    let actual = this.especieResponseFauna.page * this.especieResponseFauna.size
    this.especieResponseFauna.data = this.especieResponseFauna.data.slice(
      actual,
      actual+this.especieResponse.size
    );
    this.dataSourceCatalogoFA = new MatTableDataSource<Especie>(this.especieResponseFauna.data);
    /************************************************************************************/
    this.listProductoFA = this.listProductoFA.filter(item => item.idEspecie !== 0);
    var index = this.listProductoFA.map(x => {
      return x.idEspecie;
    }).indexOf(obj.idEspecie);

    var index2 = this.listRecursoProducto.map(x => {
      return x.idEspecie;
    }).indexOf(obj.idEspecie);
    if (this.listProductoFA[index].nuIdRecursoProducto !== 0) {

      Swal.fire({
        title: '¿Desea eliminar el producto no maderable seleccionado?',
        text: "Los cambios no se van a revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#43a047',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {

        if (result.isConfirmed) {

          this.recursoService.deleteRecursoProducto(this.listProductoFA[index].nuIdRecursoProducto).subscribe((response: any) => {
            if (response.success) {
              this.listProductoFA.splice(index, 1);
              this.listRecursoProducto.splice(index2, 1);
              this.dataSourceFA = new MatTableDataSource<RecursoProduco>(this.listProductoFA);
            }
          }, error => {
          })
        }
      })
    } else {
      this.listProductoFA.splice(index, 1);
      this.listRecursoProducto.splice(index2, 1);
      this.dataSourceFA = new MatTableDataSource<RecursoProduco>(this.listProductoFA);
    }

  }

  calculateTotal() {
    this.totalToneladas = 0;
    this.totalM3 = 0;
    this.listProducto = this.listProducto.filter(item => item.idEspecie !== 0);
    this.listProducto.forEach(item => {
      if(item.txCantidadProducto !== undefined && item.txCantidadProducto !== null ){
        if (item.unidadMedida === 'UND') {
          this.totalToneladas +=Number(item.txCantidadProducto);
        }
        if(item.metroCubico!==null && item.metroCubico!==undefined){
          this.totalM3+=Number(item.metroCubico);
        }
      }
    })

    let element: RecursoProduco = new RecursoProduco();
    element.nuIdRecursoProducto = 0;
    element.idEspecie = 0;
    element.nombreCientifico = '';
    element.nombreComun = 'Total';
    element.tipoProducto = "M3";
    element.txCantidadProducto = this.totalToneladas;
    element.unidadMedida = "Piezas";
    element.idUsuarioRegistro = 1;
    element.metroCubico = this.totalM3;
    element.nuIdArchivoRecursoProducto = 'noFile';
    element.nuIdArchivoRecurso = 'noFile';
    this.listProducto.push(element);
    this.recursoResponse.totalRecords = this.listProducto.length - 1;
    this.dataSource = new MatTableDataSource<RecursoProduco>(this.listProducto);
    //this.getCubicacion(this.listProducto);
  }

  calculateTotalNoMad() {
    this.listProductoNoMad.forEach(item => {
      if (item.unidadMedida === 'KG') {
        this.totalToneladasNoMad += Number(item.txCantidadProducto) / 1000
      }
      if (item.unidadMedida === 'GR') {
        this.totalToneladasNoMad += Number(item.txCantidadProducto) / 1000000
      }
      else if (item.unidadMedida === 'TON') {
        this.totalToneladasNoMad += Number(item.txCantidadProducto)
      }
    })

    // let element: RecursoProduco = new RecursoProduco();
    // element.nuIdRecursoProducto = 0;
    // element.idEspecie = 0;
    // element.nombreCientifico = '';
    // element.nombreComun = 'Total';
    // element.tipoProducto = "";
    // element.txCantidadProducto = this.totalToneladasNoMad;
    // element.unidadMedida = "Tonelada";
    // element.idUsuarioRegistro = 1;
    // this.listProductoNoMad.push(element);
    this.dataSourceNoMad = new MatTableDataSource<RecursoProduco>(this.listProductoNoMad);
  }


  calculateTotalTon() {
    this.totalToneladas = 0;
    this.totalM3 = 0;
    this.listProducto = this.listProducto.filter(item => item.idEspecie !== 0);
    this.listProducto.forEach(item => {
     if(item.txCantidadProducto !== undefined && item.txCantidadProducto !== null ){
        if (item.unidadMedida === 'UND') {
          this.totalToneladas +=Number(item.txCantidadProducto);
        }
        if(item.metroCubico!==null && item.metroCubico!==undefined){
          this.totalM3+=Number(item.metroCubico);
        }
      }
    })
  }

  calculateTotalM3Modal() {
    this.listProducto = this.listProducto.filter(item => item.idEspecie !== 0);
    this.listProducto.forEach(item => {
     if(item.txCantidadProducto !== undefined && item.txCantidadProducto !== null ){
        if(item.metroCubico!==null && item.metroCubico!==undefined){
          this.totalM3+=Number(item.metroCubico);
        }
      }
    })
  }

  calculateTotalTonNoMad() {
    this.listProductoNoMad.forEach(item => {

      if (item.unidadMedida === 'KG') {
        this.totalToneladasNoMad += Number(item.txCantidadProducto) / 1000
      }
      if (item.unidadMedida === 'GR') {
        this.totalToneladasNoMad += Number(item.txCantidadProducto) / 1000000
      }
      else if (item.unidadMedida === 'TON') {
        this.totalToneladasNoMad += Number(item.txCantidadProducto)
      }
    })    
  }

  multipli(row:RecursoProduco){
    const index = this.listProductoNoMad.indexOf(row, 1);    
    if(row.capacidadUnidad !== undefined && row.capacidadUnidad !== null  && row.txCantidadProducto !== undefined && row.txCantidadProducto !== null)
    {
    row.cantidadTotal = Number(row.txCantidadProducto) * Number(row.capacidadUnidad);
    this.listProductoNoMad[index] = row; 
    }
}


  validarOtros(event: any) {
    if (event.value === 'OTRO') {
      this.otroDesc = true;
    } else {
      this.otroDesc = false;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  generarActa(): void {
    const dialogRef = this.dialog.open(ModalActaIntervencionComponent, {
      width: '1300px',
      height: '800px',
      data: { idRecurso: this.idRecurso, dataRecurso: this.dataRecurso }
    });

  }

  searchPass(): void {

    if(this.inputRegistro.get('nroActa').value ){
      const dialogRef = this.dialog.open(ModalPasComponent, {
        width: '650px',
        height: '650px',
        data: { nroActa: this.inputRegistro.get('nroActa').value }
      });
      setTimeout(() => { 

        this.recursoService.getRecursoActasSearchPas(this.inputRegistro.get('nroActa').value )
        .pipe(finalize(() => this.dialog.closeAll()))
        .subscribe((response: RecursoPasResponse) => {
          console.log("response ",response)

          this.listProducto = [];
          this.listProductoNoMad = [];
          this.listProductoFA = [];
          this.listRecursoProducto = [];

          this.dataSource = new MatTableDataSource<RecursoProduco>(this.listProducto)
          this.dataSourceNoMad = new MatTableDataSource<RecursoProduco>(this.listProductoNoMad);
          this.dataSourceFA = new MatTableDataSource<RecursoProduco>(this.listProductoFA);
          this.fechaActual = moment(response.data[0].feFechaRegistro).format('MM/DD/YYYY') ;
          this.inputRegistro.get('fechaIngreso').patchValue(response.data[0].feFechaRegistro);
          this.inputRegistro.get('tipoIngreso').patchValue(Constants.INTERVENCION);
          this.inputRegistro.get('direccion').patchValue(response.data[0].txDireccionIntervencion);
          this.inputRegistro.get('observaciones').patchValue(response.data[0].txObservaciones);

          this.inputRegistro.get('tipoDoc').patchValue(response.data[0].intervenidoPas.txtipoDocumento);
          this.inputRegistro.get('numDoc').patchValue(response.data[0].intervenidoPas.txnumeroDocumento);
          this.inputRegistro.get('nombres').patchValue(response.data[0].intervenidoPas.txnombreCompleto);

          let validateMad=false;
          let validateNoMad=false;
          let validateFa=false;
  
          if(response.data[0].nuTipoProductoEspecie === 1 ){
            response.data[0].lstIntervencionDetalle.forEach(result => {
              this.listEspeciesMaderable.forEach(item => {
                if (item.nombreCientifico === result.txEspecie && item.nombreComun === result.txNombreComun) {
                  item.add = true;
                  validateMad = true;
                  result.nuEspecieID = item.idEspecie;
                }
              });

              this.listEspeciesNOMaderable.forEach(item => {
                if (item.nombreCientifico === result.txEspecie && item.nombreComun === result.txNombreComun) {
                  item.add = true;
                  validateNoMad = true;
                  result.nuEspecieID = item.idEspecie;
                }
              });
  
              if(validateMad){
                this.tipoProductoCatalogo = Constants.MADERABLE;
                let obj: Especie = new Especie();
                obj.idEspecie = result.nuEspecieID;
                obj.nombreCientifico = result.txEspecie;
                obj.nombreComun = result.txNombreComun;
                obj.cantidad = result.nuCantidad;
                this.agregar(obj);
              }

              if(validateNoMad){
                this.tipoProductoCatalogo = Constants.NOMADERABLE;
                let obj: Especie = new Especie();
                obj.idEspecie = result.nuEspecieID;
                obj.nombreCientifico = result.txEspecie;
                obj.nombreComun = result.txNombreComun;
                obj.cantidad = result.nuCantidad;
                this.agregar(obj);
              }
  
            });
          }else{
            debugger
            response.data[0].lstIntervencionDetalle.forEach(result => {
              this.listEspeciesCatalogoFA.forEach(item => {
                if (item.nombreCientifico === result.txEspecie && item.nombreComun === result.txNombreComun) {
                  item.add = true;
                  validateFa = true;
                  result.nuEspecieID = item.id;
                }
              });
  
              if(validateFa){
                this.tipoProductoCatalogo = Constants.FAUNA;
                let obj: Especie = new Especie();
                obj.id = result.nuEspecieID;
                obj.nombreCientifico = result.txEspecie;
                obj.nombreComun = result.txNombreComun;
                obj.cantidad = result.nuCantidad;
                this.agregar(obj);
              }
            });
          }
          
          this.tipoProductoCatalogo = '';
        })
        ;

      }, 2000)
      
    }
    
    
  }

  agregarCubicacion(nuIdRecursoProducto: number, txCantidadProducto: string,tipoProducto:string,nombreCientifico:string,nombreComun:string): void {
    

    //console.log('probando el nuIdRecursoProducto',nuIdRecursoProducto);
    if(nuIdRecursoProducto === 0){
      Swal.fire({
        title: 'Mensaje!',
        text:  'Primero debe registrar la especie',
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
    else{
      const dialogRef = this.dialog.open(ModalEspecieCubicacionComponent, {
        width: '1300px',
        height: '800px',
        data: { id: nuIdRecursoProducto, cantidad: txCantidadProducto,tipoProducto: tipoProducto, nombreCientifico:nombreCientifico,nombreComun:nombreComun }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        this.getCubicacion(this.listProducto);
        
        this.totalVolumenPTconvertido = result;
        //this.getRecursosEspecies(Number(this.idRecurso))
        this._matSnackBar.open('Especie guardada correctamente', 'OK', {
          //verticalPosition: 'top',  // 'top' | 'bottom'
          horizontalPosition: 'center',  // 'start' | 'center' | 'end' | 'left' | 'right'
         // panelClass: 'mail-compose-dialog',
          duration        : 2000
        });
        });
    }
    

  }

  agregarFaunaDetalle(nuIdRecursoProducto: number, txCantidadProducto: string,nombreCientifico:string,nombreComun:string): void {
    

    //console.log('probando el nuIdRecursoProducto',nuIdRecursoProducto);
    if(nuIdRecursoProducto === 0){
      Swal.fire({
        title: 'Mensaje!',
        text:  'Primero debe registrar la especie',
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
    else{
      const dialogRef = this.dialog.open(ModalFaunaDetalleComponent, {
        width: '1300px',
        height: '800px',
        data: { id: nuIdRecursoProducto, cantidad: txCantidadProducto, nombreCientifico:nombreCientifico,nombreComun:nombreComun }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        this.getCubicacion(this.listProducto)
        this.totalVolumenPTconvertido = result;
        //this.getRecursosEspecies(Number(this.idRecurso))
        this._matSnackBar.open('Especie guardada correctamente', 'OK', {
          //verticalPosition: 'top',  // 'top' | 'bottom'
          horizontalPosition: 'center',  // 'start' | 'center' | 'end' | 'left' | 'right'
         // panelClass: 'mail-compose-dialog',
          duration        : 2000
        });
        });
    }
    

  }


  searchTipoDocumento() {
    this.parametroService.getParametroSearch(this.tipoDocumento).subscribe((response: Parametro[]) => {
      this.listTipoDocumento = response;
    });
  }

  searchTipoInfraccion() {
    this.parametroService.getParametroSearch(this.tipoInfraccion).subscribe((response: Parametro[]) => {
      this.listTipoInfraccion = response;
    });
  }

  searchTipoSancion() {
    this.parametroService.getParametroSearch(this.tipoSancion).subscribe((response: Parametro[]) => {
      this.listTipoSancion = response;
    });
  }

  searchTipoProducto() {
    this.parametroService.getParametroSearch(this.tipoProducto).subscribe((response: Parametro[]) => {
      this.listTipoProducto = response;
    });
  }

  searchTipoProductoAcerrada() {
    this.parametroService.getParametroSearch(this.tipoProductoAcerrada).subscribe((response: Parametro[]) => {
      this.listTipoProductoAcerrada = response;
    });
  }

  searchTipoProductoRolliza() {
    this.parametroService.getParametroSearch(this.tipoProductoRolliza).subscribe((response: Parametro[]) => {
      this.listTipoProductoRolliza = response;
    });
  }

  // @ts-ignore
  dataArray(tipoProducto): (any)[] {
    if (tipoProducto === 'ACE') {
      this.parametroService.getParametroSearch(this.tipoProductoAcerrada).subscribe((response: Parametro[]) => {
        return this.listTipoProductoAcerrada = response;
      });
    } else if (tipoProducto === 'ROLL') {
      this.parametroService.getParametroSearch(this.tipoProductoRolliza).subscribe((response: Parametro[]) => {
        return this.listTipoProductoAcerrada = response;
      });
    }
  }

  searchPresentacionTro() {
    this.parametroService.getParametroSearch(this.presentacionMaderable).subscribe((response: Parametro[]) => {
      this.listTipoPresMadTro = response;
      this.listTipoPresMadTro = this.listTipoPresMadTro.filter(item => item.codigo === 'TIPOPREMADTRO');
    });
  }

  searchPresentacionPie() {
    this.parametroService.getParametroSearch(this.presentacionMaderable).subscribe((response: Parametro[]) => {
      this.listTipoPresMadPie = response;
      this.listTipoPresMadPie = this.listTipoPresMadPie.filter(item => item.codigo === 'TIPOPREMADPIE');
    });
  }

  searchPresentacionNoMad() {
    this.parametroService.getParametroSearch(this.presentacionNOMaderable).subscribe((response: Parametro[]) => {
      this.listTipoPresNoMad = response;
    });
  }


  searchTipoProductoCata() {
    this.parametroService.getParametroSearch(this.tipoProductoCata).subscribe((response: Parametro[]) => {
      this.listTipoProductoCata = response;
    });
  }

  searchUnidadMedida() {
    this.parametroService.getParametroSearch(this.unidadMedida).subscribe((response: Parametro[]) => {
      this.listUnidadMedida = response;
    });
  }

  searchTipoIngreso() {
    this.parametroService.getParametroSearch(this.tipoIngreso).subscribe((response: Parametro[]) => {
      this.listTipoIngreso = response;
    });
  }

  async searchAlmacen() {
    this.dataSource = new MatTableDataSource<RecursoProduco>([])
    let almacenRequest: Almacen = new Almacen;
    almacenRequest.txNombreAlmacen = '';
    almacenRequest.txNumeroDocumento = this.numeroDocumento;
    this.almacenService.getAlmacenSearch(almacenRequest, this.almacenResponse.pageNumber, this.almacenResponse.pageSize).subscribe((response: BandejaAlmacenResponse) => {
      this.almacenResponse = response;
      this.listAlmacen = response.data;
    })
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

  registro() {
    this.registerRecurso();
  }


  registerRecurso() {
    let obj: Recurso = new Recurso();
    let objRpI: RecursoPersona = new RecursoPersona();
    let objRpC: RecursoPersona = new RecursoPersona();
    obj.nuIdRecurso = this.dataRecurso !== undefined ? Number(this.idRecurso) : 0;
    obj.txNroGuiaTransporteForestal = this.inputRegistro.get('numGuia').value;
    obj.numeroActa = this.inputRegistro.get('nroActa').value;    
    obj.lstEspecie = this.listRecursoProducto;
    obj.nuIdAlmacen = this.inputRegistro.get('almacen').value;
    obj.tipoIngreso = this.inputRegistro.get('tipoIngreso').value;    
    obj.direccion = this.inputRegistro.get('direccion').value;    obj.foto = this.photo;
    obj.txObservaciones = this.inputRegistro.get('observaciones').value;
    obj.tipoInfraccion = this.inputRegistro.get('tipoInfraccion').value;
    obj.tipoSancion = this.inputRegistro.get('tipoSancion').value;
   
    let fechaIngreso = new Date(this.inputRegistro.get('fechaIngreso').value)
    fechaIngreso.setMinutes(fechaIngreso.getMinutes() + fechaIngreso.getTimezoneOffset())
    obj.fechaIngreso = fechaIngreso;
    obj.horaIngreso = this.inputRegistro.get('horaIngreso').value;

    console.log('this.dataRecurso',this.dataRecurso);
    objRpI.idRecursoPersona = this.dataRecurso !== undefined ? this.dataRecurso.intervenido.idRecursoPersona:0;
    objRpI.tipoDocumento = this.inputRegistro.get('tipoDoc').value;
    objRpI.numeroDocumento = this.inputRegistro.get('numDoc').value;
    objRpI.nombresPersona = this.inputRegistro.get('nombres').value;
    objRpI.tipoPersona = 'TPERSONAI';

    objRpC.idRecursoPersona = this.dataRecurso !== undefined ? this.dataRecurso.conductor.idRecursoPersona:0;
    objRpC.tipoDocumento = this.inputRegistro.get('tipoDocCon').value;
    objRpC.numeroDocumento = this.inputRegistro.get('numDocCon').value;
    objRpC.nombresPersona = this.inputRegistro.get('nombresCon').value;
    objRpC.placa = this.inputRegistro.get('placa').value;
    objRpC.tipoPersona = 'TPERSONAC';

    obj.intervenido = objRpI;
    obj.conductor = objRpC;

    // if(this.inputRegistro.get('tipoIngreso').value === 'TIPINGRNOR'){
    //   obj.disponibilidadActa = 'D'
    // }
    // if(this.inputRegistro.get('tipoIngreso').value === 'TIPINGRINTER'){
    //   obj.disponibilidadActa = 'ND'
    // }

    //this.SearchRegistrosActas(obj.numeroActa)
   /* if(this.dataRecurso === undefined || this.dataRecurso == null){
      if(obj.tipoIngreso =='TIPINGRINTER' && !this.validActa) 
      return Swal.fire('Mensaje!','Debe validar el número de Acta','warning');

    if(obj.tipoIngreso =='TIPINGRINTER' && this.valueActaFlag ) {
      this.validActa = false;
      return Swal.fire('Mensaje!','El número de Acta ya existe','warning');
    } */
    if(obj.tipoIngreso == null || obj.tipoIngreso =='' ) 
      return Swal.fire('Mensaje!','Debe seleccionar el tipo de Ingreso','warning');

    if(obj.tipoIngreso =='TIPINGRINTER' && (obj.numeroActa == null || obj.numeroActa == '')) 
      return Swal.fire('Mensaje!','Debe agregar número de Acta','warning');
/*
    if(obj.numeroActa.length >0 && !this.validActa ) 
      return Swal.fire('Mensaje!','Debe validar el numero de acta ingresado','warning');
      
    if(obj.tipoIngreso =='TIPINGRNOR' && obj.numeroActa.length > 0 && this.valueActaFlag) 
      return Swal.fire('Mensaje!','El número de Acta ya existe','warning');

    if(obj.numeroActa.length > 0 && !this.valueActaFlag && obj.numeroActa != this.valueStringActa)
      return Swal.fire('Mensaje!','El número de acta no es el mismo que con el que se valido','warning');
    }
*/
    let message = this.validRecursoProducto(obj.lstEspecie);
    if(message!= '') return Swal.fire('Mensaje!',message,'warning');

    this.recursoService.postRecurso(obj).subscribe((response: CreateRecursoResponse) => {
      if (response.success) {

        Swal.fire({
          title: 'Mensaje de Confirmación',
          text:  'Artículos guardados correctamente en el almacen.',
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
        this.idRecurso = response.data.nuIdRecurso.toString();
        this.dataRecurso = obj;
        this.getRecursosEspecies(Number(this.idRecurso));
        //this._router.navigate(['bandeja-recurso']);

      } else {
        Swal.fire({
          title: 'Mensaje!',
          text:  'Error inesperado al registrar los productos del almacen',
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
    })

  }

  validRecursoProducto(listDetalleInit){
  
    let validar: boolean = true;
    let flagNombre: boolean = true;
    let flagNombreNM: boolean = true;
    let flagNombreFA: boolean = true;
    let flagTipoProducto: boolean = true;
    let flagSubProducto: boolean = true;
    let flagTrozaPiezas: boolean = true;
    let flagUnidadMedida: boolean = true;
    let flagTipoAlmacenamiento: boolean = true;
    let flagCapacidadUnidad: boolean = true;
    let flagTxCantidadProducto: boolean = true;

    let message: string = '(*) Debe ingresar los siguientes campos:';

    let listDetalle = listDetalleInit.filter( e => (e.nombreCientifico != '' || e.nombreCientifico != null || e.nombreCientifico == null) && e.type === 'MAD');
    console.log('listDetallelistDetallelistDetallelistDetallelistDetalle',listDetalle);
  
    for( let index = 0 ; index < listDetalle.length; index++){
      if ((listDetalle[index].nombreComun == '' || listDetalle[index].nombreComun == null) 
         && (listDetalle[index].nombreCientifico == '' || listDetalle[index].nombreCientifico == null) && flagNombre) {
        validar = false;
        flagNombre = false;
        message += '\n - Nombre Común o Científico';
      }

      if ((listDetalle[index].tipoProducto == '' || listDetalle[index].tipoProducto == null) && flagTipoProducto) {
        validar = false;
        flagTipoProducto = false;
        message += '\n - Tipo Producto';
      }
  
      if ((listDetalle[index].tipoSubProducto == '' || listDetalle[index].tipoSubProducto == null) && flagSubProducto) {
        validar = false;
        flagSubProducto = false;
        message += '\n - Sub Producto';
      }

      if ((listDetalle[index].txCantidadProducto == 0 || listDetalle[index].txCantidadProducto == null) && flagTrozaPiezas) {
        validar = false;
        flagTrozaPiezas = false;
        message += '\n - Trozas/Piezas';
      }

      if ((listDetalle[index].unidadMedida == '' || listDetalle[index].unidadMedida == null) && flagUnidadMedida) {
        validar = false;
        flagUnidadMedida = false;
        message += '\n - Unidad Medida';
      }
    }
    let listDetalleNM = listDetalleInit.filter( e => (e.nombreCientifico != '' || e.nombreCientifico != null || e.nombreCientifico == null) && e.type === 'NOMAD');
    for( let index = 0 ; index < listDetalleNM.length; index++){
      
      if ((listDetalleNM[index].nombreComun == '' || listDetalleNM[index].nombreComun == null) 
         && (listDetalleNM[index].nombreCientifico == '' || listDetalleNM[index].nombreCientifico == null) && flagNombreNM) {
        validar = false;
        flagNombreNM = false;
        message += '\n - Nombre Común o Científico';
      }

      if ((listDetalleNM[index].tipoAlmacenamiento == '' || listDetalleNM[index].tipoAlmacenamiento == null) && flagTipoAlmacenamiento) {
        validar = false;
        flagTipoAlmacenamiento = false;
        message += '\n - Tipo de Almacenamiento';
      }
  
      if ((listDetalleNM[index].capacidadUnidad == 0 || listDetalleNM[index].capacidadUnidad == null) && flagCapacidadUnidad) {
        validar = false;
        flagCapacidadUnidad = false;
        message += '\n - Capacidad/Unidad';
      }

      if ((listDetalleNM[index].txCantidadProducto == 0 || listDetalleNM[index].txCantidadProducto == null) && flagTxCantidadProducto) {
        validar = false;
        flagTxCantidadProducto = false;
        message += '\n - Cantidad';
      }

      if ((listDetalleNM[index].unidadMedida == '' || listDetalleNM[index].unidadMedida == null) && flagUnidadMedida) {
        validar = false;
        flagUnidadMedida = false;
        message += '\n - Unidad Medida';
      }
    }
    let listDetalleFA = listDetalleInit.filter( e => (e.nombreCientifico != '' || e.nombreCientifico != null || e.nombreCientifico == null) && e.type === 'FA');
    for( let index = 0 ; index < listDetalleFA.length; index++){
     
      if ((listDetalleFA[index].nombreComun == '' || listDetalleFA[index].nombreComun == null) 
      && (listDetalleFA[index].nombreCientifico == '' || listDetalleFA[index].nombreCientifico == null) && flagNombreFA) {
        validar = false;
        flagNombreFA = false;
        message += '\n - Nombre Común o Científico';
      }

      if ((listDetalleFA[index].txCantidadProducto == 0 || listDetalleFA[index].txCantidadProducto == null) && flagTxCantidadProducto) {
        validar = false;
        flagTxCantidadProducto = false;
        message += '\n - Cantidad en cero o vacio';
      }

    }
    //if (!validar) this.ErrorMensaje(mensaje);
    return (validar == false) ? message:'';
    //return (validar == false) ? Swal.fire('Mensaje!',message,'warning'): true;
  }

  async SearchRegistrosActas() {
    let acta = this.inputRegistro.get('nroActa').value;
    this.validActa = true;
   // this.dataSource = new MatTableDataSource<Recurso>([])
    this.recursoService.getRecursoActasSearch(acta,
    this.recursoResponse.pageNumber,this.recursoResponse.pageSize).subscribe((response:BandejaRecursoResponse)=>{
      if(response.success){
        //this.recursoResponse =response;
        //this.dataSource = new MatTableDataSource<Recurso>(response.data);
        if(response.data != null && response.data.length > 0 ){
          this.valueActaFlag = true;
          Swal.fire('Mensaje!','El número de Acta ya existe','warning');
        } else {
          this.valueActaFlag = false;
          this.valueStringActa = acta;
          Swal.fire('Mensaje!','El número se encuentra disponible','success');
        } //this.valueActaFlag = true;        //this.resultsLength=response.totalRecords;
      }  else {
        this.valueActaFlag = false;
        Swal.fire('Mensaje!','Se genero error al validar el número de Acta','error');
      }
    }
    )
  }

  validarDNI() {
    let params = { "numDNIConsulta": this.inputRegistro.get("numDoc").value }
    
    this.pideService.consultarDNI(params).subscribe((result: any) => {
     
      // 
      if (result.dataService && result.dataService) {
        this.validaDNIClass = true;
        if (result.dataService.datosPersona) {
          let persona = result.dataService.datosPersona;
          let nombres, paterno, materno;
          nombres = persona.prenombres != null ? persona.prenombres : '';
          paterno = persona.apPrimer != null ? persona.apPrimer : '';
          materno = persona.apSegundo != null ? persona.apSegundo : '';
          this.inputRegistro.get("nombres").patchValue(nombres + ' ' + paterno + ' ' + materno);
          //this.inputRegistro.get("direccion").patchValue(persona.direccion);
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
  validarDNIconductor() {
    let params = { "numDNIConsulta": this.inputRegistro.get("numDocCon").value }
    
    this.pideService.consultarDNI(params).subscribe((result: any) => {
     
      // 
      if (result.dataService && result.dataService) {
        this.validaDNIClass = true;
        if (result.dataService.datosPersona) {
          let persona = result.dataService.datosPersona;
          let nombres, paterno, materno;
          nombres = persona.prenombres != null ? persona.prenombres : '';
          paterno = persona.apPrimer != null ? persona.apPrimer : '';
          materno = persona.apSegundo != null ? persona.apSegundo : '';
          this.inputRegistro.get("nombresCon").patchValue(nombres + ' ' + paterno + ' ' + materno);
          //this.inputRegistro.get("direccion").patchValue(persona.direccion);
          //this.photo = persona.foto;
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
            text:  result.dataService.deResultado,
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
          text:  'Hay errores con el servicio de validación de DNI. Contactar con el administrador del sistema.',
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
    }, () => {

      // this.toast.error('Hay errores con el servicio de validación de DNI. Contactar con el administrador del sistema.');
    }
    )
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

redondeo(row:RecursoProduco){
    const index = this.listProducto.indexOf(row, 0);
    row.metroCubico = Number(row.metroCubico.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
    this.listProducto[index] = row;    
}

  getCubicacion(listProductos: RecursoProduco[]){
    let datafiltered = []
    let flagCubicacion = { "flagCubicacion": false }
    this.metroCubico = 0;
    this.totalVolumenM3 = 0;
    this.totalVolumenPT = 0;   
    let idRecursoProducto;
    this.totalM3 = 0;
    listProductos = listProductos.filter(item=>item.idEspecie!=0)
    listProductos.forEach((df:any) => {
      this.metroCubico = df.volumenM3;
     // ////console.log('listProductos',listProductos);
      flagCubicacion.flagCubicacion = false;
      if(df.nuIdRecursoProducto != null && df.nuIdRecursoProducto > 0){
        this.cubicacionService.getRecursoProductoCubicacion(df.nuIdRecursoProducto,
          this.cubicacionResponse.pageNumber, this.cubicacionResponse.pageSize)
          .subscribe((response: CubicacionResponse) => {
            //////console.log("response cubicacion",response);
            if(response.data !=null && response.data.length >0) {
              this.cantidadCubicacion = 0;
              response.data.forEach((rp:any) => {
                if(idRecursoProducto!==rp.nuIdRecursoProducto){
                  this.totalVolumenM3 = 0;
                  this.totalVolumenPT = 0;
                }
                idRecursoProducto = rp.nuIdRecursoProducto;
                this.cantidadCubicacion += rp.cantidad;
                ////console.log("rp ",rp)
                this.totalVolumenM3 += rp.volumenM3;
                this.totalVolumenPT += rp.volumenPT;  
                
                
                if(rp.nuIdRecursoProducto === df.nuIdRecursoProducto){
                  //console.log("entro ",rp.nuIdRecursoProducto)
                  //console.log("entro2 ",df.nuIdRecursoProducto)
                  //console.log("totalVolumenM3 ",this.totalVolumenM3)
                  //console.log("totalVolumenPT ",this.totalVolumenPT)
                  if(this.totalVolumenM3 > 0){
                    df.metroCubico = Number(this.totalVolumenM3.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
                    //this.totalM3 = df.metroCubico;
                  }else{
                    df.metroCubico = this.totalVolumenPT/423.8;
                    df.metroCubico = Number(df.metroCubico.toFixed(Number(this.listDecimalCantidad.valorPrimario)));
                    //this.totalM3 = df.metroCubico;
                  }
                }

              });
              
             

              if(this.cantidadCubicacion >= df.txCantidadProducto){
                flagCubicacion.flagCubicacion = true;
              } else{
                flagCubicacion.flagCubicacion = false;
              }

              if(df.metroCubico!==null && df.metroCubico!==undefined){
                this.totalM3+=Number(df.metroCubico);
              }

              //////console.log("flagCubicacion.flagCubicacion ",flagCubicacion.flagCubicacion);
              datafiltered.push(Object.assign(df,flagCubicacion));
            } else {
              flagCubicacion.flagCubicacion = false;
              datafiltered.push(Object.assign(df,flagCubicacion));
            }
          })
      } else {
        df.metroCubico = 0 ;
        datafiltered.push(Object.assign(df,flagCubicacion));
      }


    }
    
    )
    //////console.log("datafiltered ",datafiltered)
    this.listProducto = datafiltered;
    ////console.log("this.listProductoJUNIOR",this.listProducto);
  }

  cancelar() {
    this._router.navigate(['bandeja-recurso']);
  }

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  cambiarPestana(indice: number) {
    this.tabGroup.selectedIndex = indice;
  }

  ///Nuevos
  addArchivoTabla(item: any, file: any,index:any) {
    const files = file?.target?.files as FileList
    if (files && files.length > 0) {
      const fileExt = files[0].type.toLocaleLowerCase();
      if (this.tipoArchivoTablaCod.includes(fileExt)) {
        console.log("INGRESA AQUI")
        const file = files[0];
        console.log("files-addArchivoTabla", file);
        //this.fileInfGenrealOsinfor.file = files[0];
        this.guardarArchivo(item, file);
      } else {
        Swal.fire(
          'Mensaje!',
          '(*) Formato no valido (jpg o png)',
          'error'
        )
      }
    }
  }

  changeFile(item: any,e: any,index:any) {
    console.log("item-changeFile",item);
    console.log("e-changeFile",e)

    this.addArchivoTabla(item,e,index);
  }

  onFileChange(e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target) {
      if (e.target.files.length) {
        let type = e.target.dataset.type;

        this.fileInfGenreal.url = URL.createObjectURL(e.target.files[0]);
        this.fileInfGenreal.nombreFile = e.target.files[0].name;
        this.fileInfGenreal.file = e.target.files[0];
        this.fileInfGenreal.descripcion = type;
        this.fileInfGenreal.inServer = false;
      }
    }
  }

  guardarArchivo(item: any, file: any) {

    let codigoTipo = item.type;
    let codigoUrlArchivo = item.type + Constants.BACKSLASH + Constants.BACKSLASH + String(item.nuIdRecurso) 
    + Constants.BACKSLASH + Constants.BACKSLASH + String(item.nuIdRecursoProducto) + Constants.BACKSLASH + Constants.BACKSLASH ;
    //this.dialog.open(LoadingComponent, { disableClose: true });
    this._servicioArchivo
      .cargarArchivoGeneralCodRecurso(
        1,
        codigoTipo,
        null,
        item.nuIdRecursoProducto,
        codigoUrlArchivo,
        file,
      )
      .pipe(finalize(() => this.dialog.closeAll()))
      .subscribe((result: any) => {
        this.getRecursosEspecies(Number(this.idRecurso));
        item.archivo = result.data;
        this.fileInfGenreal.id = result.data;
      });
  }

  descargarArchivoTabla(idFile: number) {
    console.log("idArchivo", idFile);
    const params = { "idArchivo": idFile };
    this._servicioArchivo.descargarArchivoGeneral(params).subscribe((result: any) => {
      this.dialog.closeAll();
      if (result.data !== null && result.data !== undefined) {
        DownloadFile(result.data.archivo, result.data.nombeArchivo, result.data.contenTypeArchivo);
      }
    }, () => {
      this.dialog.closeAll();
      Swal.fire(
        'Mensaje!',
        'No se pudo descargar el archivo.',
        'error'
      )
    });
  }

  eliminarArchivoGeneral(idFile: number) {
    console.log("idArchivo", idFile);
    const params = { "idArchivo": idFile, "idUsuarioElimina": 1 };
    this._servicioArchivo.eliminarArchivoGeneral(params).subscribe((result: any) => {
      this.getRecursosEspecies(Number(this.idRecurso));
    }, () => {
      Swal.fire(
        'Mensaje!',
        'No se pudo eliminar el archivo',
        'error'
      )
    });
  }

  addArchivoRecurso(file: any) {
      console.log("file-addArchivoRecurso",file);
      const files = file?.target?.files as FileList
      if (files && files.length > 0) {
        const fileExt = files[0].type.toLocaleLowerCase();
        if (this.tipoArchivoTablaCod.includes(fileExt)) {
          const file = files[0];
          console.log("files-addArchivoRecurso", file);
          //this.fileInfGenrealOsinfor.file = files[0];
          this.guardarArchivoRecurso(file);
        } else {
          Swal.fire(
            'Mensaje!',
            '(*) Formato no valido (pdf)',
            'error'
          )
        }
      }
    //this.addArchivoTabla(item,e,index);
  }

  guardarArchivoRecurso( file: any) {

    let codigoTipo = 'INGRESO';
    console.log("this.idRecurso: ", this.idRecurso)
    let codigoUrlArchivo = codigoTipo + Constants.BACKSLASH + Constants.BACKSLASH + String(this.idRecurso) 
    + Constants.BACKSLASH + Constants.BACKSLASH;
    //this.dialog.open(LoadingComponent, { disableClose: true });
    this._servicioArchivo
      .cargarArchivoGeneralCodRecurso(
        1,
        codigoTipo,
        Number(this.idRecurso),
        null,
        codigoUrlArchivo,
        file,
      )
      .pipe(finalize(() => this.dialog.closeAll()))
      .subscribe((result: any) => {
        this.getRecursosEspecies(Number(this.idRecurso));
        this.showArchivoRecurso = true;
        this.fileInfGenreal.id = result.data;
      });
  }

  descargarArchivoRecurso() {
    console.log("idArchivo", this.nuIdArchivoRecurso);
    const params = { "idArchivo": this.nuIdArchivoRecurso };
    this._servicioArchivo.descargarArchivoGeneral(params).subscribe((result: any) => {
      this.dialog.closeAll();
      if (result.data !== null && result.data !== undefined) {
        DownloadFile(result.data.archivo, result.data.nombeArchivo, result.data.contenTypeArchivo);
      }
    }, () => {
      this.dialog.closeAll();
      Swal.fire(
        'Mensaje!',
        'No se pudo descargar el archivo.',
        'error'
      )
    });
  }
}



