import { Component, OnInit , ViewChild, Output, ElementRef} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import {BandejaEntradaPlazoService as BandejaEntradaPlazoService, FileServerService} from '../../../services';
import {Response, Documento, Paginacion, FiltroDocumento, OpcionBusqueda} from '../../../models';
import {BuscarDocumentoComponent} from '../../dialogs/buscar-documento/buscar-documento.component';
import { ToastrService } from 'ngx-toastr';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import {ModalidadFiltro, PrioridadDocumento, TipoArchivo, NivelError} from '../../../models/enums';
import {SessionService} from '../../../auth/session.service';
/*MODIFICACION 23/07/2019 INICIO*/
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
/*MODIFICACION 23/07/2019 FIN*/

@Component({
  selector: 'bandeja-plazo',
  templateUrl: 'bandeja-plazo.template.html',
  styleUrls: ['bandeja-plazo.component.scss']
})
export class BandejaPlazoComponent implements OnInit {
  static item;
  items: Documento[];
  selectedRow: number;
  filtroAvanzado: FiltroDocumento;
  paginacion: Paginacion;
  loading: boolean;
  textoBusqueda: string;
  parametroBusqueda: string;
  modalidad: string;
  switchBotones: number;
  /*MODIFICACION 23/07/2019 INICIO*/
  fechaInicial: Date;
  fechaFinal: Date;  
  /*MODIFICACION 23/07/2019 FIN*/
  @ViewChild(BuscarDocumentoComponent) busquedaAvanzada;
  @ViewChild('buscar') buscar: ElementRef;

  /* Variables para mostrar el archivo exportado */
  public urlReportePdf: string;
  @ViewChild('reportePdfSwal') private reportePdfSwal: SwalComponent;

  /* Variables para realizar la configuración de validaciones en filtros */
  public opcionesBusqueda: OpcionBusqueda;
  public configuracionesBusqueda: OpcionBusqueda[];

  /* Variables para el manejo de filtros */
  public filtro: FiltroDocumento;
  private SESSION_KEY_FILTRO = 'bandeja-plazo.filtro';
  private SESSION_KEY_PAGINACION = 'bandeja-plazo.paginacion';
  public textoInfoBusqueda: string;

  /* Variable componentes */
  @ViewChild(BuscarDocumentoComponent) private buscarDocumentoComponent;

  constructor(private localeService: BsLocaleService,
              private router: Router, 
              private toastr: ToastrService, 
              private bandejaService: BandejaEntradaPlazoService,
              private fileService: FileServerService, 
              private session: SessionService) {
  }

  ngOnInit() {
     /*MODIFICACION 24/07/2019 INICIO  */
     this.SetearMes();
     /*MODIFICACION 24/07/2019 FIN */
    this.inicializarVariables();
    this.getDocumentos();
    // this.OnConfigurarBusqueda();
  }

  private inicializarVariables(): void {
    this.items = [];
    this.switchBotones = 0;
    this.selectedRow = -1;
    this.loading = true;
    this.paginacion = new Paginacion({registros: 10});
    this.inicializarOpcionesConfiguraciones();
  }

  private inicializarOpcionesConfiguraciones(): void {
    this.configuracionesBusqueda = [
      {parametro: 'correlativo', longitud: 10, descripcion: 'Número de registro', validar: 'digit'},
      {parametro: 'tipoDocumento', longitud: 60, descripcion: 'Tipo de Documento', validar: 'word'},
      {parametro: 'numeroDocumento', longitud: 40, descripcion: 'Número de documento'},
      {parametro: 'dirigido', longitud: 1000, descripcion: 'Dirigido'},
      {parametro: 'asunto', longitud: 1000, descripcion: 'Asunto'},
      {parametro: 'remitente', longitud: 1000, descripcion: 'Remitente'},
      {parametro: 'prioridadUrgente', descripcion: 'Prioridad <strong>URGENTE</strong>', placeholder: 'Prioridad URGENTE',
        deshabilitar: true},
      {parametro: 'prioridadAlta', descripcion: 'Prioridad ALTA', deshabilitar: true}
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
        this.opcionesBusqueda = this.configuracionesBusqueda[2];
      } else if (this.filtro.asunto !== undefined) {
        busqueda = true;
        this.textoBusqueda = this.filtro.asunto;
        this.opcionesBusqueda = this.configuracionesBusqueda[3];
      } else if (this.filtro.remitente !== undefined) {
        busqueda = true;
        this.textoBusqueda = this.filtro.remitente;
        this.opcionesBusqueda = this.configuracionesBusqueda[4];
      } else if (this.filtro.prioridad !== undefined) {
        busqueda = true;
        if (this.filtro.prioridad === 'URGENTE') {
          this.opcionesBusqueda = this.configuracionesBusqueda[5];
        } else {
          this.opcionesBusqueda = this.configuracionesBusqueda[6];
        }
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

  getDocumentos(): void {
      this.loading = true;
      this.bandejaService.buscarDocumentos(this.filtro.values, this.paginacion.pagina, this.paginacion.registros).subscribe(
        (response: Response) => {
          this.items = response.resultado;
          if (this.items.length > 0) {
            this.bandejaService.actualizarRecibido(this.items).subscribe((responseUpdate: any) => {
                console.log('Registros Actualizados', responseUpdate);
              },
              (error) => this.controlarError(error)
            );
          }
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
        (error) => this.controlarError(error)
      );
  }

  OnPDF() {
      const toastr = this.toastr;
      const this_ = this;
      this.loading = true;
      this.bandejaService.generarPDF(this.filtro.values).subscribe(
        (data)=> {
          const file = new Blob([data], { type: TipoArchivo.pdf });
          const fileURL = URL.createObjectURL(file);
          this_.urlReportePdf = fileURL;
          this_.reportePdfSwal.show();
          // window.open(fileURL); // Abrir nueva pestaña
          toastr.info('Documento generado', 'Confirmación');
          this.loading = false;
      },
      (response: Response) => this.controlarError(response),
      );
  }

  OnExcel() {
      const this_ = this;
      this.loading = true;
      this.bandejaService.generarExcel(this.filtro.values).subscribe(
        (data)=> {
          const file = new Blob([data], {type: TipoArchivo.xlsx});
          this_.fileService.downloadFile(file, 'bandeja-plazo.xlsx');
          this.loading = false;
      },
      (response: Response) => this.controlarError(response),
    );
    this.toastr.info('Documento generado', 'Confirmación', {closeButton: true});
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

  selectRow(index, item: Documento) {
    this.selectedRow = index;
    this.router.navigate([`bandeja-entrada/documento/${item.nano.toString()}/${item.correlativo.toString()}`]);
  }

  OnBuscar(): void {

    this.paginacion.pagina = 1;
    /* DERIVAR TEXTO DE BÚSQUEDA A SU CORRECTO ATRIBUTO */
    switch (this.opcionesBusqueda.parametro) {
      case 'correlativo':
        this.filtro.correlativo = this.textoBusqueda;
        break;
      case 'tipoDocumento':
        this.filtro.tipoDocumento = this.textoBusqueda;
        break;
      case 'numeroDocumento':
        this.filtro.numeroDocumento = this.textoBusqueda;
        break;
      case 'dirigido':
        this.filtro.dirigido = this.textoBusqueda;
        break;
      case 'asunto':
        this.filtro.asunto = this.textoBusqueda;
        break;
      case 'remitente':
        this.filtro.remitente = this.textoBusqueda;
        break;
      case 'prioridadUrgente':
        this.filtro.prioridad = PrioridadDocumento.URGENTE;
        break;
      case 'prioridadAlta':
        this.filtro.prioridad = PrioridadDocumento.ALTA;
        break;
    }

    /* AJUSTE DE VARIABLES */
    
    /*MODIFICACION 23/07/2019 INICIO */
    //this.filtro.modalidad = (this.textoBusqueda !== '') ? ModalidadFiltro.TODOS : ModalidadFiltro.RECIENTES;
    this.filtro.modalidad = ModalidadFiltro.TODOS;
    //this.textoInfoBusqueda = (this.textoBusqueda || this.filtro.prioridad) ? 'busqueda' : 'inicio';
    this.textoInfoBusqueda =  'busqueda';
    
    /*MODIFICACION 23/07/2019 FIN */

    this.filtro.avanzado = false;
    this.paginacion.pagina = 1;
    this.loading = true;
    
    /*MODIFICACION 23/07/2019 INICIO */
    this.filtro.fechaInicio = this.fechaInicial;
    this.filtro.fechaFin = this.fechaFinal;
    if(this.ValidarFechas())this.getDocumentos();
    
    //this.getDocumentos();
    /*MODIFICACION 23/07/2019 INICIO */
  }

  OnRefrescar() {
    this.loading = true;
    // this.Limpiar();
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

  Limpiar() {
    this.textoBusqueda = '';
    this.filtroAvanzado = new FiltroDocumento();
    this.paginacion = new Paginacion({registros: 10});
    this.filtroAvanzado.modalidad = ModalidadFiltro.RECIENTES;
    this.filtroAvanzado.asunto = null;
    this.filtroAvanzado.correlativo = '0';
    this.filtroAvanzado.estado = '0';
    this.filtroAvanzado.fechaFin = null;
    this.filtroAvanzado.fechaInicio = null;
    this.filtroAvanzado.modalidad = ModalidadFiltro.RECIENTES;
    this.filtroAvanzado.nano = (new Date()).toISOString().substr(0, 4);
    this.filtroAvanzado.tipoDocumento = null;
    this.filtroAvanzado.numeroDocumento = null;
    this.filtroAvanzado.dirigido=null;
    this.filtroAvanzado.origen = '0';
    this.filtroAvanzado.prioridad = '0';
    this.filtroAvanzado.remitente = null;
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.loading = false;
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
    if(this.loading){
      this.loading= false;
    }
  }

  OnLeido(item: Documento) {
    if (item.nindleido === 0) {
      this.bandejaService.actualizarLeido(item).subscribe((responseUpdate: Response) => {
          console.log('Se han actualizado los registros a leido', responseUpdate);
        },
        (error) => this.controlarError(error)
      );
    }
  }
  /*MODIFICACION 23/07/2019 INICIO*/
ValidarFechas():Boolean{
  if(!(this.fechaInicial<=this.fechaFinal)){
    this.toastr.warning('Fecha Desde debe ser menor a Fecha Hasta', 'Accion Invalida');
    return false;
  }
  return true;
}
DetectChangeIni(){
  
  if(this.fechaInicial== null ||  this.fechaInicial.toString()=='Invalid Date' || this.fechaInicial.toString()==''){
    this.fechaInicial = new Date();
    this.toastr.warning('Fecha ingresada no valida','Advertencia');
    return;
  }
}
DetectChangeFin(){
  if(this.fechaFinal== null || this.fechaFinal.toString()=='Invalid Date' || this.fechaFinal.toString()==''){
    this.fechaFinal = new Date();
    this.toastr.warning('Fecha ingresada no valida','Advertencia');
    return;
  }
}

SetearMes():void{
 
  /* var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
  var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0); */
  this.fechaFinal = new Date();
  var date = new Date();
  date.setDate(date.getDate()-30);
  this.fechaInicial = date;
}
  /*MODIFICACION 23/07/2019 FIN*/

}
