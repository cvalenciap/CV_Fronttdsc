import { Component, OnInit, ViewChild , ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import {BandejaSalidaService as BandejaSalidaPendientesService, FileServerService} from '../../../services';
import {Response, Documento, Paginacion, FiltroDocumento, OpcionBusqueda} from '../../../models';
import {BuscarDocumentoSalidaComponent} from '../../dialogs/buscar-documento-salida/buscar-documento-salida.component';
import { ToastrService } from 'ngx-toastr';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import { SessionService } from '../../../auth/session.service';
import {ModalidadFiltro, TipoArchivo, NivelError} from '../../../models/enums';

@Component({
  selector: 'bandeja-pendientes',
  templateUrl: 'bandeja-pendientes.template.html',
  styleUrls: ['bandeja-pendientes.component.scss']
})
export class BandejaPendientesComponent implements OnInit {
  static item;
  items: Documento[];
  selectedRow: number;
  paginacion: Paginacion;
  loading: boolean;
  textoBusqueda: string;
  parametroBusqueda: string;
  modalidad: string;
  switchBotones: number;
  // bandeja: string;
  @ViewChild(BuscarDocumentoSalidaComponent) busquedaAvanzada;
  @ViewChild('buscar') buscar: ElementRef;

  public urlReportePdf: string;
  @ViewChild('reportePdfSwal') private reportePdfSwal: SwalComponent;

  /** VARIABLES DE COMPONENTES */
  @ViewChild(BuscarDocumentoSalidaComponent) private buscarDocumentoComponent;

  /** VARIABLES PARA MANEJAR LA CONFIGURACIÓN EN FILTROS */
  public opcionesBusqueda: OpcionBusqueda;
  public configuracionesBusqueda: OpcionBusqueda[];

  /** VARIABLES PARA EL MANEJO DE FILTROS */
  public filtro: FiltroDocumento;
  public filtroAvanzado: FiltroDocumento;
  private SESSION_KEY_FILTRO = 'bandeja-pendientes.filtro';
  private SESSION_KEY_PAGINACION = 'bandeja-pendientes.paginacion';
  public textoInfoBusqueda: string;

  constructor(private router: Router, private toastr: ToastrService, public session: SessionService,
              private fileService: FileServerService, private bandejaService: BandejaSalidaPendientesService) {
  }

  ngOnInit() {
    this.inicializarVariables();
    this.inicializarOpcionesConfiguraciones();
    this.getDocumentos();
    // this.OnConfigurarBusqueda();
  }

  private inicializarVariables(): void {
    this.paginacion = new Paginacion({registros: 10});
    this.textoInfoBusqueda = 'inicio';
    this.switchBotones = 0;
    this.selectedRow = -1;
    this.loading = true;
    this.items = [];
    // this.filitroIni();
  }

  private inicializarOpcionesConfiguraciones(): void {
    this.configuracionesBusqueda = [
      {parametro: 'correlativo', longitud: 10, descripcion: 'Número de registro', validar: 'digit'},
      {parametro: 'tipoDocumento', longitud: 60, descripcion: 'Tipo de Documento', validar: 'word'},
      {parametro: 'numeroDocumento', longitud: 40, descripcion: 'Número de documento'},
      {parametro: 'dirigido', longitud: 1000, descripcion: 'Dirigido'},
      {parametro: 'asunto', longitud: 1000, descripcion: 'Asunto'},
      {parametro: 'referencia', longitud: 1000, descripcion: 'Referencia'},
      {parametro: 'docEntrada', longitud: 10, descripcion: 'Doc. Entrada'}
    ];
    this.leerFiltrosSession();
    this.leerPaginacionSession();
  }

  private leerFiltrosSession(): void {
    if (this.session.read(this.SESSION_KEY_FILTRO)) {
      this.filtro = Object.assign(new FiltroDocumento(), <FiltroDocumento>this.session.read(this.SESSION_KEY_FILTRO));
      this.validarFiltrosIniciales();
    } else {
      this.filtro = new FiltroDocumento();
      this.filtro.modalidad = ModalidadFiltro.RECIENTES;
      this.textoBusqueda = '';
      this.opcionesBusqueda = this.configuracionesBusqueda[0];
      this.textoInfoBusqueda = 'inicio';
    }
  }

  private leerPaginacionSession(): void {
    if (this.session.read(this.SESSION_KEY_PAGINACION)) {
      this.paginacion = Object.assign(new Paginacion(), <Paginacion>this.session.read(this.SESSION_KEY_PAGINACION));
    } else {
      this.paginacion = new Paginacion({registros: 10});
    }
  }

  private validarFiltrosIniciales(): void {
    let busqueda = false;
    if (!this.filtro.avanzado) {
      if (this.filtro.correlativo !== undefined) {
        busqueda = true;
        this.textoBusqueda = this.filtro.correlativo;
        this.opcionesBusqueda = this.configuracionesBusqueda[0];
      } else if (this.filtro.tipoDocumento !== undefined) {
        busqueda = true;
        this.textoBusqueda = this.filtro.tipoDocumento;
        this.opcionesBusqueda = this.configuracionesBusqueda[1];
      } else if (this.filtro.numeroDocumento !== undefined) {
        busqueda = true;
        this.textoBusqueda = this.filtro.numeroDocumento;
        this.opcionesBusqueda = this.configuracionesBusqueda[2];
      } else if (this.filtro.dirigido !== undefined) {
        busqueda = true;
        this.textoBusqueda = this.filtro.dirigido;
        this.opcionesBusqueda = this.configuracionesBusqueda[3];
      } else if (this.filtro.asunto !== undefined) {
        busqueda = true;
        this.textoBusqueda = this.filtro.asunto;
        this.opcionesBusqueda = this.configuracionesBusqueda[4];
      } else if (this.filtro.referencia !== undefined) {
        busqueda = true;
        this.textoBusqueda = this.filtro.referencia;
        this.opcionesBusqueda = this.configuracionesBusqueda[5];
      } else if (this.filtro.docEntrada !== undefined) {
        busqueda = true;
        this.textoBusqueda = this.filtro.docEntrada;
        this.opcionesBusqueda = this.configuracionesBusqueda[6];
      } else {
        this.textoBusqueda = '';
        this.opcionesBusqueda = this.configuracionesBusqueda[0];
      }
      if (busqueda) { this.textoInfoBusqueda = 'busqueda'; } else { this.textoInfoBusqueda = 'inicio'; }
    } else {
      this.textoBusqueda = '';
      this.opcionesBusqueda = this.configuracionesBusqueda[0];
      this.textoInfoBusqueda = 'busqueda-avanzada';
    }
  }

  OnConfigurarBusqueda(opciones: OpcionBusqueda) {
    this.textoBusqueda = '';
    this.opcionesBusqueda = opciones;
    this.filtro = new FiltroDocumento();
    this.filtro.modalidad = ModalidadFiltro.RECIENTES;
    this.buscar.nativeElement.focus();
  }

  OnRestablecer() {
    this.filtro = new FiltroDocumento();
    this.filtro.modalidad = ModalidadFiltro.RECIENTES;
    this.filtro.avanzado = false;
    this.textoInfoBusqueda = 'inicio';
    this.getDocumentos();
    // this.OnBusquedaAvanzada(null);
  }

  /*OnConfigurarBusqueda() {
    switch (this.parametroBusqueda) {
      case 'correlativo': {
        this.buscar.nativeElement.maxLength = 10;
        this.buscar.nativeElement.placeholder = 'Número de Registro';
        this.buscar.nativeElement.onkeypress = (e) => e.charCode >= 48 && e.charCode <= 57
        break;
      }
      case 'tipoDocumento': {
        this.buscar.nativeElement.maxLength = 60;
        this.buscar.nativeElement.placeholder = 'Tipo de Documento';
        this.buscar.nativeElement.onkeypress = '';
        break;
      }
      case 'numeroDocumento': {
        this.buscar.nativeElement.maxLength = 40;
        this.buscar.nativeElement.placeholder = 'Número de Documento';
        this.buscar.nativeElement.onkeypress = '';
        break;
      }
      case 'asunto': {
        this.buscar.nativeElement.maxLength = 1000;
        this.buscar.nativeElement.placeholder = 'Asunto';
        this.buscar.nativeElement.onkeypress = '';
        break;
      }
      case 'referencia': {
        this.buscar.nativeElement.maxLength = 1000;
        this.buscar.nativeElement.placeholder = 'Referencia';
        this.buscar.nativeElement.onkeypress = '';
        break;
      }
      case 'dirigido': {
        this.buscar.nativeElement.maxLength = 1000;
        this.buscar.nativeElement.placeholder = 'Dirigido';
        this.buscar.nativeElement.onkeypress = '';
        break;
      }
      case 'docEntrada': {
        this.buscar.nativeElement.maxLength = 10;
        this.buscar.nativeElement.placeholder = 'Documento Entrada';
        this.buscar.nativeElement.onkeypress = '';
        break;
      }
    }
    this.modalidad = '1';
    this.textoBusqueda = null;
  }*/


  /* filitroIni(){
    this.filtroAvanzado.modalidad=ModalidadFiltro.RECIENTES;
    this.filtroAvanzado.asunto=null;
    this.filtroAvanzado.correlativo=null;
    this.filtroAvanzado.estado="0";
    this.filtroAvanzado.fechaFin = null;
    this.filtroAvanzado.fechaInicio = null;
    this.filtroAvanzado.nano=(new Date()).toISOString().substr(0,4);
    this.filtroAvanzado.tipoDocumento=null;
    this.filtroAvanzado.numeroDocumento = null
    this.filtroAvanzado.origen="0";
    this.filtroAvanzado.prioridad="0"
    this.filtroAvanzado.dirigido=null;
    this.filtroAvanzado.remitente=null;
    this.filtroAvanzado.docEntrada = null;
  } */

  getDocumentos(): void {
    /*const parametros: {
      modalidad?: string,
      correlativo?: string,
      nano?: string,
      asunto?: string;
      origen?: string,
      referencia? : string,
      tipoDocumento?: string;
      numeroDocumento?: string;
      remitente?: string;
      dirigido?:string;
      prioridad_alta?: string,
      estado?: string,
      prioridad?: string,
      docEntrada?:string} = {};
      parametros.correlativo=this.filtroAvanzado.correlativo;
      parametros.modalidad=this.filtroAvanzado.modalidad.toString();
      parametros.estado=this.filtroAvanzado.estado;
      parametros.origen=this.filtroAvanzado.origen;
      parametros.prioridad=this.filtroAvanzado.prioridad;
      parametros.nano=this.filtroAvanzado.nano;
      parametros.referencia=this.filtroAvanzado.referencia;
      parametros.asunto=this.filtroAvanzado.asunto;
      parametros.tipoDocumento=this.filtroAvanzado.tipoDocumento;
      parametros.numeroDocumento=this.filtroAvanzado.numeroDocumento;
      parametros.remitente=this.filtroAvanzado.remitente;
      parametros.dirigido=this.filtroAvanzado.dirigido;
      parametros.prioridad=this.filtroAvanzado.prioridad;
      parametros.docEntrada = this.filtroAvanzado.docEntrada; */
      this.loading = true;
      this.bandejaService.buscarDocumentos(this.filtro.values, this.paginacion.pagina, this.paginacion.registros).subscribe(
        (response: Response) => {
          this.items = response.resultado;
          console.log('Filtros guardados 1: ', this.filtro);
          // guardar filtro de búsqueda y paginación para recordar
          this.paginacion = new Paginacion(response.paginacion);
          if (this.paginacion.totalRegistros > 0) {
            this.switchBotones = 1;
          } else {
            this.switchBotones = 0;
          }
          this.session.save(this.SESSION_KEY_FILTRO, this.filtro);
          this.session.save(this.SESSION_KEY_PAGINACION, this.paginacion);
          this.loading = false;
        },
        (response: Response) => this.controlarError(response),
      );
  }

  OnPDF() {
    /*const parametros: {
      modalidad?: string,
      correlativo?: string,
      nano?: string,
      asunto?: string;
      origen?: string,
      tipoDocumento?: string;
      numeroDocumento?: string;
      remitente?: string;
      prioridad_alta?: string,
      estado?: string,
      prioridad?: string,
      referencia?:string} = {};
      parametros.modalidad=this.filtroAvanzado.modalidad.toString();
      parametros.estado=this.filtroAvanzado.estado;
      parametros.origen=this.filtroAvanzado.origen;
      parametros.prioridad=this.filtroAvanzado.prioridad;
      parametros.nano=this.filtroAvanzado.nano;
      parametros.asunto=this.filtroAvanzado.asunto;
      parametros.tipoDocumento=this.filtroAvanzado.tipoDocumento;
      parametros.referencia = this.filtroAvanzado.referencia;
      parametros.numeroDocumento=this.filtroAvanzado.numeroDocumento;
      parametros.remitente=this.filtroAvanzado.remitente;
      parametros.prioridad=this.filtroAvanzado.prioridad; */
      const toastr = this.toastr;
      const this_ = this;
      this.loading= true;
      this.bandejaService.generarPDF(this.filtro.values).subscribe(
        (data)=> {
          const file = new Blob([data], { type: TipoArchivo.pdf });
          const fileURL = URL.createObjectURL(file);
          this_.urlReportePdf = fileURL;
          this_.reportePdfSwal.show();
          toastr.info('Documento generado', 'Confirmación');
          this.loading= false;
        },
      (response: Response) => this.controlarError(response),
      );
  }

  OnExcel() {
    /*const parametros: {
      modalidad?: string,
      correlativo?: string,
      nano?: string,
      asunto?: string;
      origen?: string,
      tipoDocumento?: string;
      numeroDocumento?: string;
      remitente?: string;
      docEntrada?:string;
      prioridad_alta?: string,
      estado?: string,
      prioridad?: string,
      referencia?:string} = {};
      parametros.modalidad=this.filtroAvanzado.modalidad.toString();
      parametros.estado=this.filtroAvanzado.estado;
      parametros.origen=this.filtroAvanzado.origen;
      parametros.prioridad=this.filtroAvanzado.prioridad;
      parametros.nano=this.filtroAvanzado.nano;
      parametros.asunto=this.filtroAvanzado.asunto;
      parametros.referencia = this.filtroAvanzado.referencia;
      parametros.tipoDocumento=this.filtroAvanzado.tipoDocumento;
      parametros.numeroDocumento=this.filtroAvanzado.numeroDocumento;
      parametros.remitente=this.filtroAvanzado.remitente;
      parametros.prioridad=this.filtroAvanzado.prioridad;
      parametros.docEntrada = this.filtroAvanzado.docEntrada; */
      const toastr = this.toastr;
      const this_ = this;
      this.loading = true;
      this.bandejaService.generarExcel(this.filtro.values).subscribe(
        (data)=> {
          toastr.info('Documento generado', 'Confirmación');
          const file = new Blob([data], {type: TipoArchivo.xlsx});
          const fileURL = URL.createObjectURL(file);
          this_.fileService.downloadFile(file, 'bandeja-pendientes.xlsx');
          this.loading = false;
          // window.open(fileURL);
          /*if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(file, 'bandeja-pendientes.xlsx');
          } else {
            window.open(fileURL);
          }*/
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getDocumentos();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getDocumentos();
  }

  OnItemClick(index, item: Documento) {
    this.selectedRow = index;
    if (!item.movimiento) {
      this.router.navigate(['bandeja-salida/editar/' + item.numero]);
    } else {
      this.router.navigate(['bandeja-salida/editar/' + item.numero + '/' + item.movimiento.codigo]);
    }
  }

  OnBuscar(): void {
    /* if (this.parametroBusqueda == 'correlativo' && this.textoBusqueda && !(this.textoBusqueda.match(/^[0-9][0-9 ]*$/)!=null) ){
      this.toastr.warning('Ingrese correlativo numérico', 'Acción Inválida', {closeButton: true});
      this.Limpiar();
      return;
    }
    this.filitroIni(); */
    this.paginacion.pagina = 1;
    this.filtro = new FiltroDocumento();
    /* DERIVAR TEXTO DE BÚSQUEDA A SU CORRECTO ATRIBUTO */
    switch (this.opcionesBusqueda.parametro) {
      case 'correlativo':
        this.filtro.correlativo = this.textoBusqueda;
        break;
      case 'tipoDocumento':
        this.filtro.tipoDocumento = this.textoBusqueda;
        break;
      case 'dirigido':
        this.filtro.dirigido = this.textoBusqueda;
        break;
      case 'numeroDocumento':
        this.filtro.numeroDocumento = this.textoBusqueda;
        break;
      case 'asunto':
        this.filtro.asunto = this.textoBusqueda;
        break;
      case 'remitente':
        this.filtro.remitente = this.textoBusqueda;
        break;
      case 'referencia':
        this.filtro.referencia = this.textoBusqueda;
        break;
      case 'docEntrada':
        this.filtro.docEntrada = this.textoBusqueda;
        break;
    }

   /* if(this.textoBusqueda!=""){
      switch (this.parametroBusqueda) {
        case "correlativo":
              this.filtroAvanzado.correlativo = this.textoBusqueda;
              break;
        case "tipoDocumento":
              this.filtroAvanzado.tipoDocumento = this.textoBusqueda;
              break;
        case "dirigido":
              this.filtroAvanzado.dirigido = this.textoBusqueda;
              break;
        case "numeroDocumento":
              this.filtroAvanzado.numeroDocumento = this.textoBusqueda;
              break;
        case "asunto":
              this.filtroAvanzado.asunto = this.textoBusqueda;
              break;
        case "remitente":
              this.filtroAvanzado.remitente = this.textoBusqueda;
              break;
        case "referencia":
              this.filtroAvanzado.referencia = this.textoBusqueda;
              break;
        case "docEntrada":
              this.filtroAvanzado.docEntrada = this.textoBusqueda;
              break;
        case "prioridadAlta":
              this.filtroAvanzado.prioridad = "ALTA";
              break;
        case "prioridadUrgente":
              this.filtroAvanzado.prioridad = "URGENTE";
              break;
      }
    }*/
    /* AJUSTE DE VARIABLES */
    this.filtro.modalidad = (this.textoBusqueda !== '') ? ModalidadFiltro.TODOS : ModalidadFiltro.RECIENTES;
    this.textoInfoBusqueda = (this.textoBusqueda || this.filtro.prioridad) ? 'busqueda' : 'inicio';
    this.filtro.avanzado = false;
    this.paginacion.pagina = 1;
    this.loading = true;
    this.getDocumentos();
  }

  OnRefrescar() {
    this.loading = true;
    this.getDocumentos();
  }

  OnBusquedaAvanzada(event: FiltroDocumento) {
    this.paginacion.pagina = 1;
    if (event !== null) {
      if (event instanceof FiltroDocumento) {
        this.filtro = Object.assign(new FiltroDocumento(), event);
        this.filtro.avanzado = true;
        this.textoInfoBusqueda = 'busqueda-avanzada';
        this.getDocumentos();
      } else if (event === undefined) {
        this.filtro = this.buscarDocumentoComponent.filtrosBusqueda;
        this.filtro.avanzado = true;
        this.textoInfoBusqueda = 'busqueda-avanzada';
        this.getDocumentos();
      }
      this.filtroAvanzado = Object.assign(new FiltroDocumento(), this.filtro);
    }
  }

  /*OnBusquedaAvanzada() {
    this.loading=true;
    this.filtroAvanzado = this.busquedaAvanzada.filtrosBusqueda;
    this.filtroAvanzado.modalidad=ModalidadFiltro.TODOS;
    const parametros: {
      modalidad?: string,
      correlativo?: string,
      nano?: string,
      asunto?: string;
      origen?: string,
      tipoDocumento?: string;
      numeroDocumento?: string;
      remitente?: string;
      prioridad_alta?: string,
      estado?: string,
      fechaInicio?: Date,
      fechaFin?: Date,
      prioridad?: string,
      docEntrada?: string,
      dirigido?:string} = {};   
      parametros.correlativo=this.filtroAvanzado.correlativo;   
      parametros.modalidad=this.filtroAvanzado.modalidad.toString();
      parametros.estado=this.filtroAvanzado.estado;
      parametros.origen=this.filtroAvanzado.origen;
      parametros.prioridad=this.filtroAvanzado.prioridad;
      parametros.nano=this.filtroAvanzado.nano;
      parametros.asunto=this.filtroAvanzado.asunto;
      parametros.tipoDocumento=this.filtroAvanzado.tipoDocumento;
      parametros.numeroDocumento=this.filtroAvanzado.numeroDocumento;
      parametros.remitente=this.filtroAvanzado.remitente;
      parametros.prioridad=this.filtroAvanzado.prioridad;
      parametros.fechaInicio=this.filtroAvanzado.fechaInicio;
      parametros.fechaFin=this.filtroAvanzado.fechaFin;
      parametros.dirigido=this.filtroAvanzado.dirigido;
      
      if(parametros.estado=="TODOS")
        parametros.estado=this.filtroAvanzado.estado="0";
      console.log(parametros);
    this.bandejaService.buscarDocumentos(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.loading = false;
        this.paginacion = new Paginacion(response.paginacion);
        if(this.paginacion.totalRegistros>0) {
          this.switchBotones=1;
        } else {
          this.switchBotones=0;
        }
      },
      (response: Response) => this.controlarError(response),
    );
  }*/

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
    if ( this.loading ) this.loading = false;
  }

  Limpiar(){
    this.textoBusqueda = "";

    this.filtroAvanzado = new FiltroDocumento();
    this.paginacion = new Paginacion({registros: 10});
    this.filtroAvanzado.modalidad=ModalidadFiltro.RECIENTES;
    this.filtroAvanzado.asunto=null;
    this.filtroAvanzado.correlativo=null;
    this.filtroAvanzado.estado="0";
    this.filtroAvanzado.fechaFin = null;
    this.filtroAvanzado.fechaInicio = null;
    this.filtroAvanzado.nano=(new Date()).toISOString().substr(0,4);
    this.filtroAvanzado.tipoDocumento=null;
    this.filtroAvanzado.numeroDocumento = null
    this.filtroAvanzado.origen="0";
    this.filtroAvanzado.dirigido=null;
    this.filtroAvanzado.prioridad="0"
    this.filtroAvanzado.remitente=null;
    this.filtroAvanzado.docEntrada = null;
  }
}
