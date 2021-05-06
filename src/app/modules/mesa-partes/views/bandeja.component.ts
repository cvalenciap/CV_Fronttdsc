import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
//import {MesaPartesMockService as MesaPartesService} from '../../../services';
import {FileServerService, MesaPartesService} from '../../../services';
import {Response, Documento, Paginacion, OpcionBusqueda, FiltroDocumento, TipoDocumento} from '../../../models';
import {NivelError, ModalidadFiltro, OrigenDocumento, PrioridadDocumento, TipoArchivo} from '../../../models/enums';
import {BuscarDocumentoComponent} from '../../dialogs/buscar-documento/buscar-documento.component';
import { SessionService } from 'src/app/auth/session.service';
import * as moment from 'moment';
import { debug } from 'util';
/*MODIFICACION 23/07/2019 INICIO*/
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
/*MODIFICACION 23/07/2019 FIN*/
declare var jQuery: any;

@Component({
  selector: 'bandeja-mesa-partes',
  templateUrl: 'bandeja.template.html',
  styleUrls: ['bandeja.component.scss']
})
export class BandejaMesaPartesComponent implements OnInit {

  private SESSION_KEY_FILTRO = 'mesa-partes.filtro';
  private SESSION_KEY_PAGINACION = 'mesa-partes.paginacion';

  items: Documento[];
  selectedRow: number;
  filtro: FiltroDocumento;
  filtroAvanzado: FiltroDocumento;
  configuracionesBusqueda: OpcionBusqueda[];
  opcionesBusqueda: OpcionBusqueda;
  loading: boolean;
  paginacion: Paginacion;
  textoBusqueda: string;
  /*MODIFICACION 23/07/2019 INICIO*/
  fechaInicial: Date;
  fechaFinal: Date;  
  /*MODIFICACION 23/07/2019 FIN*/

  urlPDF: string;
  desactivaExportar: boolean;
  textoInfoBusqueda: string;
  @ViewChild(BuscarDocumentoComponent) busquedaAvanzada;
  @ViewChild('buscar') buscar: ElementRef;


  public urlReportePdf: string;
  @ViewChild('reportePdfSwal') private reportePdfSwal: SwalComponent;

  /* Variable componentes */
  @ViewChild(BuscarDocumentoComponent) private buscarDocumentoComponent;

  constructor(private localeService: BsLocaleService,
              private modalService: BsModalService,
              private router: Router,
              private toastr: ToastrService,
              private bandejaService: MesaPartesService,
              public session: SessionService,
              private fileService: FileServerService) {
  }

  ngOnInit() {
    this.desactivaExportar = true;
    /*MODIFICACION 24/07/2019 INICIO  */
    this.SetearMes();
    /*MODIFICACION 24/07/2019 FIN */
    // this.textoInfoBusqueda = 'inicio';
    this.configuracionesBusqueda = [
      {parametro: 'correlativo', longitud: 10, descripcion: 'Número de registro', validar: 'digit'},
      {parametro: 'tipoDocumento', longitud: 100, descripcion: 'Tipo de Documento', validar: 'word'},
      {parametro: 'numeroDocumento', longitud: 100, descripcion: 'Número de documento'},
      {parametro: 'asunto', longitud: 1000, descripcion: 'Asunto'},
      {parametro: 'prioridadUrgente', descripcion: 'Prioridad URGENTE', deshabilitar: true},
      {parametro: 'prioridadAlta', descripcion: 'Prioridad ALTA', deshabilitar: true}
    ];
    if (this.session.read(this.SESSION_KEY_FILTRO)) {
      this.filtro = Object.assign(new FiltroDocumento(), <FiltroDocumento>this.session.read(this.SESSION_KEY_FILTRO));
      this.validarFiltrosIniciales();
    } else {
      this.filtro = new FiltroDocumento();
      this.filtro.origen = '2';
      this.filtro.modalidad = ModalidadFiltro.RECIENTES;

      /** TRES LINEAS LARP */
      this.textoBusqueda = '';
      this.opcionesBusqueda = this.configuracionesBusqueda[0];
      this.textoInfoBusqueda = 'inicio';
      
    }
    if (this.session.read(this.SESSION_KEY_PAGINACION)) {
      this.paginacion = Object.assign(new Paginacion(), <Paginacion>this.session.read(this.SESSION_KEY_PAGINACION));
    } else {
      this.paginacion = new Paginacion({registros: 10});
    }
    this.items = [];
    this.selectedRow = -1;
    // this.textoBusqueda = '';
    // this.opcionesBusqueda = this.configuracionesBusqueda[0];
    this.getDocumentos();
  }

  /** LARP */
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
      } else if (this.filtro.asunto !== undefined) {
        busqueda = true;
        this.textoBusqueda = this.filtro.asunto;
        this.opcionesBusqueda = this.configuracionesBusqueda[3];
      } else if (this.filtro.prioridad !== undefined) {
        busqueda = true;
        if (this.filtro.prioridad === 'URGENTE') {
          this.opcionesBusqueda = this.configuracionesBusqueda[4];
        } else {
          this.opcionesBusqueda = this.configuracionesBusqueda[5];
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
    this.filtro.modalidad = ModalidadFiltro.TODOS;
    this.filtro.origen = '2';
    this.buscar.nativeElement.focus();
  }

  getDocumentos(): void {
    this.loading = true;
    this.bandejaService.buscarDocumentos(this.filtro.values, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.loading = false;
        this.paginacion = new Paginacion(response.paginacion);
        this.desactivaExportar = this.paginacion.totalRegistros === 0;
        // guardar filtro de búsqueda y paginación para recordar
        this.session.save(this.SESSION_KEY_FILTRO, this.filtro);
        this.session.save(this.SESSION_KEY_PAGINACION, this.paginacion);
      },
      (error) => this.controlarError(error)
    );
  }

  OnExcel() {
    const toastr = this.toastr;
    const this_ = this;
    this.loading  =true;
    this.bandejaService.generarExcel(this.filtro.values).subscribe(
      (data)=> {
        toastr.info('Documento generado', 'Confirmación');
        const file = new Blob([data], {type: TipoArchivo.xlsx});
        this_.fileService.downloadFile(file, 'mesa-partes.xlsx');
        this.loading  =false;
    },
    (response: Response) => this.controlarError(response),
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
        toastr.info('Documento generado', 'Confirmación');
        this.loading = false;
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

  selectRow(index, item: Documento) {
    this.selectedRow = index;
    this.router.navigate([`mesa-partes/documento/${item.nano.toString()}/${item.correlativo.toString()}`]);
  }

  OnBuscar(): void {
    this.paginacion.pagina = 1;
    this.filtro = new FiltroDocumento();
    this.filtro.origen = '2';
    /* configurar búsqueda */
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
    /* mostrar texto según si se ingresó término */
    /*MODIFICACION 23/07/2019 INICIO */
    //this.textoInfoBusqueda = (this.textoBusqueda || this.filtro.prioridad) ? 'busqueda' : 'inicio';
    this.textoInfoBusqueda =  'busqueda';
    //this.filtro.modalidad = (this.textoBusqueda || this.filtro.prioridad) ? ModalidadFiltro.TODOS : ModalidadFiltro.RECIENTES;
    this.filtro.modalidad = ModalidadFiltro.TODOS;
    /*MODIFICACION 23/07/2019 FIN */
    this.filtro.avanzado = false;
    this.paginacion.pagina = 1;

    /*MODIFICACION 23/07/2019 INICIO */
    this.filtro.fechaInicio = this.fechaInicial;
    this.filtro.fechaFin = this.fechaFinal;
    if(this.ValidarFechas())this.getDocumentos();
    
    //this.getDocumentos();
    /*MODIFICACION 23/07/2019 INICIO */

  }

  OnRefrescar() {
    this.getDocumentos();
  }

  OnRestablecer() {
    this.filtro = new FiltroDocumento();
    this.filtro.origen = '2';
    this.filtro.modalidad = ModalidadFiltro.RECIENTES;
    this.filtro.avanzado = false;
    this.textoInfoBusqueda = 'inicio';
    this.getDocumentos();
    // this.OnBusquedaAvanzada(null);
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

  controlarError(response) {
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
