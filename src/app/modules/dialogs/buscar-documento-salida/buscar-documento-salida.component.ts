import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsDatepickerDirective, BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import {FiltroDocumento, Response} from '../../../models';
import {ParametrosService} from '../../../services';
import {ModalidadFiltro } from '../../../models/enums';
import {SessionService} from '../../../auth/session.service';
import * as moment from 'moment';

@Component({
  selector: 'buscar-documento-salida',
  templateUrl: 'buscar-documento-salida.template.html',
  styleUrls: ['buscar-documento-salida.component.scss']
})
export class BuscarDocumentoSalidaComponent implements OnInit {

  // filtrosBusqueda: FiltroDocumento = new FiltroDocumento;
  listaNano: number[];
  minFecha: Date;
  maxFecha: Date;
  datePipe = new DatePipe('en-US');
  // @Input('bandeja')
  // bandeja :string;
  estadoDocumento: String[];

  /** VARIABLES GENERALES */
  @ViewChild('dpInicio') public dpInicio: BsDatepickerDirective;
  @ViewChild('dpFin') public dpFin: BsDatepickerDirective;
  private SESSION_KEY_PERIODOS = 'parametros.periodos';
  public origen: {codigo: string, valor: string}[];
  public prioridades: string[];
  public estados: string[];
  public anios: string[];

  /** VARIABLES PARA EL MANEJO DE FILTROS */
  @Output('filtroChange') filtrosBusquedaChange: EventEmitter<FiltroDocumento> = new EventEmitter<FiltroDocumento>();
  @Input('filtro') public filtrosBusqueda: FiltroDocumento;

  /** VARIABLES PARA EL MANEJO DE TIPO DE BANDEJA */
  @Input() bandeja: 'bandeja-pendiente'|'bandeja-visados'|'bandeja-firmados';

  constructor(private localeService: BsLocaleService, private toastr: ToastrService, private parametrosService: ParametrosService,
              private session: SessionService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.inicializarVariables();
    this.configuracionPorBandeja();
    this.obtenerPeriodos();
    this.OnNano();
  }

  private inicializarVariables(): void {
    this.prioridades = new Array<string>();
    this.estados = new Array<string>();
    this.anios = new Array<string>();
    this.origen = [];

    this.origen.push({codigo: '1', valor: 'INTERNO'});
    this.origen.push({codigo: '2', valor: 'EXTERNO'});
    this.prioridades.push('URGENTE');
    this.prioridades.push('ALTA');
    this.prioridades.push('MEDIA');
    this.prioridades.push('BAJA');
  }

  private configuracionPorBandeja(): void {
    if (this.bandeja === 'bandeja-pendiente') {
      this.estados.push('BORRADOR');
      this.estados.push('OBSERVADO');
    } else if (this.bandeja === 'bandeja-visados') {
      this.estados.push('POR VISAR');
      this.estados.push('VISADO');
      this.estados.push('OBSERVADO');
    } else if (this.bandeja === 'bandeja-firmados') {
      this.estados.push('POR FIRMAR');
      this.estados.push('FIRMADO');
      this.estados.push('OBSERVADO');
    }
  }

  private obtenerPeriodos(): void {
    if (this.session.read(this.SESSION_KEY_PERIODOS)) {
      this.anios = this.session.read(this.SESSION_KEY_PERIODOS);
    } else {
      this.parametrosService.buscarPeriodos().subscribe((responseSearch: Response) => {
          this.anios = responseSearch.resultado;
          this.session.save(this.SESSION_KEY_PERIODOS, this.anios);
        },
        (response: Response) => {
          let nano: number;
          nano = + ((new Date()).toISOString().substr(0, 4));
          for (let i = 0; i <= 4; i++) {
            this.anios.push((nano - i).toString());
          }
        }
      );
    }

    if (! this.filtrosBusqueda || ! this.filtrosBusqueda.avanzado) {
      this.filtrosBusqueda = new FiltroDocumento();
      this.filtrosBusqueda.nano = '';
      this.filtrosBusqueda.origen = '0';
      this.filtrosBusqueda.prioridad = '0';
      this.filtrosBusqueda.estado = '0';
    } else if (!this.filtrosBusqueda.prioridad) {
      this.filtrosBusqueda.nano = '';
      this.filtrosBusqueda.prioridad = '0';
      this.filtrosBusqueda.estado = '0';
    }
    this.filtrosBusqueda.modalidad = ModalidadFiltro.TODOS;
  }

  /*initValues() {
    var nano = this.listaNano[this.listaNano.length-1];
    /* = new Array<string>();
    var nano: number;    
    nano=+((new Date()).toISOString().substr(0,4));
    for(let i=0;i<=4;i++) {
      this.listaNano.push((nano-i).toString());
    }
    //this.filtrosBusqueda = new FiltroDocumento();
    this.filtrosBusqueda.origen="0";
    this.filtrosBusqueda.prioridad='0';
    this.filtrosBusqueda.estado='TODOS';
    this.filtrosBusqueda.modalidad=ModalidadFiltro.TODOS;
    this.filtrosBusqueda.asunto=null;
    this.filtrosBusqueda.correlativo=null;
    this.filtrosBusqueda.fechaFin = null;
    this.filtrosBusqueda.fechaInicio = null;
    this.filtrosBusqueda.nano=nano.toString();
    this.filtrosBusqueda.tipoDocumento=null;
    this.filtrosBusqueda.numeroDocumento = null
    this.filtrosBusqueda.remitente=null;
    this.filtrosBusqueda.dirigido=null;
    this.minFecha=new Date();
    this.maxFecha=new Date();
    this.minFecha.setDate(1);
    this.minFecha.setMonth(0);
    this.minFecha.setFullYear(nano);
    this.maxFecha.setDate(31);
    this.maxFecha.setMonth(11);
    this.maxFecha.setFullYear(nano);
  }*/

  /*OnCambiaFechaInicio() {
    if(this.filtrosBusqueda.fechaInicio!=null) {
      if(this.filtrosBusqueda.fechaInicio.toString()=='Invalid Date') {
        this.filtrosBusqueda.fechaInicio=null;
        this.filtrosBusqueda.fechaFin=null;
      } else {
        if(this.filtrosBusqueda.fechaInicio>this.maxFecha) {
          let fecha = this.filtrosBusqueda.fechaInicio;
          this.filtrosBusqueda.fechaInicio=this.maxFecha;
        } else {
          if(this.filtrosBusqueda.fechaFin!=null) {
            if(this.filtrosBusqueda.fechaFin<this.filtrosBusqueda.fechaInicio) {
              this.filtrosBusqueda.fechaFin=this.filtrosBusqueda.fechaInicio;
            }
          }
        }
      }
    } else {
      this.filtrosBusqueda.fechaFin=null;
    }
  }

  OnCambiaFechaFin() {
    if (this.filtrosBusqueda.fechaFin!=null) {
      if(this.filtrosBusqueda.fechaFin.toString()=='Invalid Date') {
        if(this.filtrosBusqueda.fechaInicio==null) {
          this.filtrosBusqueda.fechaFin=null;
        } else {
          this.filtrosBusqueda.fechaFin = this.filtrosBusqueda.fechaInicio;
        }
      } else {
        if(this.filtrosBusqueda.fechaInicio>this.filtrosBusqueda.fechaFin) {
          let fecha=new Date();
          fecha.setDate(this.filtrosBusqueda.fechaInicio.getDate());
          fecha.setMonth(this.filtrosBusqueda.fechaInicio.getMonth());
          fecha.setFullYear(this.filtrosBusqueda.fechaInicio.getFullYear());
          this.filtrosBusqueda.fechaFin = fecha;
        }
        if(this.filtrosBusqueda.fechaFin>this.maxFecha) {
          this.filtrosBusqueda.fechaFin=this.maxFecha;
        }
      }
    }
  }*/

  OnCambiarFechaInicio() {
    if (moment(this.filtrosBusqueda.fechaInicio).isValid()) {
      this.dpFin.minDate = this.filtrosBusqueda.fechaInicio;
      if (moment(this.filtrosBusqueda.fechaFin).isValid() && this.filtrosBusqueda.fechaFin < this.filtrosBusqueda.fechaInicio) {
        this.filtrosBusqueda.fechaFin = this.filtrosBusqueda.fechaInicio;
      }
    } else {
      this.filtrosBusqueda.fechaInicio = null;
      this.filtrosBusqueda.fechaFin = null;
    }
  }

  OnCambiarFechaFin() {
    if (moment(this.filtrosBusqueda.fechaFin).isValid()) {
      this.dpInicio.maxDate = this.filtrosBusqueda.fechaFin;
      if (moment(this.filtrosBusqueda.fechaInicio).isValid() && this.filtrosBusqueda.fechaInicio > this.filtrosBusqueda.fechaFin) {
        this.filtrosBusqueda.fechaInicio = this.filtrosBusqueda.fechaFin;
      }
    } else {
      this.filtrosBusqueda.fechaInicio = null;
      this.filtrosBusqueda.fechaFin = null;
    }
  }

  OnBuscar() {
    if (this.filtrosBusqueda.correlativo && !(this.filtrosBusqueda.correlativo.match(/^[0-9][0-9 ]*$/) != null)) {
      this.toastr.warning('Ingrese correlativo numérico', 'Acción Inválida', {closeButton: true});
      this.filtrosBusqueda.correlativo = null;
      return;
    }
    console.log(this.filtrosBusqueda);
  }

  OnSelect() {
    switch (this.filtrosBusqueda.estado) {
      case 'POR VISAR':
        this.filtrosBusqueda.estado = 'PENDIENTE';
        break;
      case 'VISADO':
        this.filtrosBusqueda.estado = 'ATENDIDO';
        break;
      case 'OBSERVADO':
        this.filtrosBusqueda.estado = 'OBSERVADO';
        break;
      case 'POR FIRMAR':
        this.filtrosBusqueda.estado = 'PENDIENTE';
        break;
      case 'FIRMADO':
        this.filtrosBusqueda.estado = 'ATENDIDO';
        break;
      case 'BORRADOR':
        this.filtrosBusqueda.estado = 'BORRADOR';
        break;
      default:
        this.filtrosBusqueda.estado = 'TODOS';
    }
  }

  /*OnCambiaAnio() {
    let fecha= new Date();
    fecha.setDate(fecha.getDate());
    fecha.setMonth(fecha.getMonth());
    fecha.setFullYear(+this.filtrosBusqueda.nano);
    this.minFecha.setDate(1);
    this.minFecha.setMonth(0);
    this.minFecha.setFullYear(+this.filtrosBusqueda.nano);
    this.maxFecha.setDate(31);
    this.maxFecha.setMonth(11);
    this.maxFecha.setFullYear(+this.filtrosBusqueda.nano);    
    if(this.filtrosBusqueda.fechaInicio!=null) {
      this.filtrosBusqueda.fechaInicio=fecha;
      this.filtrosBusqueda.fechaFin=fecha;
    }
  }*/

  OnNano() {
    let fechaMinima: string;
    let fechaMaxima: string;
    if (this.filtrosBusqueda.nano !== null && this.filtrosBusqueda.nano !== '') {
      fechaMinima = this.filtrosBusqueda.nano + '-01-01';
      fechaMaxima = this.filtrosBusqueda.nano + '-12-31';
    } else {
      const years: string [] = JSON.parse(sessionStorage.getItem('parametros.periodos'));
      fechaMinima = (years[years.length - 1]) + '-01-01';
      fechaMinima = moment(fechaMinima).subtract(1, 'y').toISOString();
      fechaMaxima = moment().toISOString();
    }

    /** VALIDACIÓN PARA LA FECHA INICIAL */
    // this.dpInicio.bsValue = moment(fechaMinima).toDate();
    this.dpInicio.maxDate = moment(fechaMaxima, 'YYYY-MM-DD').toDate();
    this.dpInicio.minDate = moment(fechaMinima, 'YYYY-MM-DD').toDate();

    /** VALIDACIÓN PARA LA FECHA FINAL */
    // this.dpFin.bsValue = moment(fechaMaxima).toDate();
    this.dpFin.maxDate = moment(fechaMaxima + '-12-31', 'YYYY-MM-DD').toDate();
    this.dpFin.minDate = moment(fechaMinima + '-12-31', 'YYYY-MM-DD').toDate();
  }

}
