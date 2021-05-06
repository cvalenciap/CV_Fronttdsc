import {Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {DatePipe} from '@angular/common';
import {NgModel} from '@angular/forms';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService, BsDatepickerDirective} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import {Response, FiltroDocumento} from '../../../models';
import { ModalidadFiltro } from '../../../models/enums';
import {ParametrosService} from '../../../services';
import { SessionService } from 'src/app/auth/session.service';
import * as moment from 'moment';

@Component({
  selector: 'buscar-documento',
  templateUrl: 'buscar-documento.template.html',
  styleUrls: ['buscar-documento.component.scss']
})
export class BuscarDocumentoComponent implements OnInit {

  private SESSION_KEY_PERIODOS = 'parametros.periodos';

  @Input('filtro') public filtrosBusqueda: FiltroDocumento;
  @Output('filtroChange') filtrosBusquedaChange: EventEmitter<FiltroDocumento> = new EventEmitter<FiltroDocumento>();

  @Input()
  bandeja: 'mesa-partes'|'recibidos'|'con-plazo';
  // listas
  listaNano: string[];
  listaOrigen: {codigo: string, valor: string}[];
  listaEstado: string[];
  listaPrioridad: string[];
  // control fecha
  minFecha: Date;
  maxFecha: Date;
  datePipe = new DatePipe('en-US');
  @ViewChild('dpInicio') dpInicio: BsDatepickerDirective;
  @ViewChild('dpFin') dpFin: BsDatepickerDirective;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private session: SessionService,
              private parametros: ParametrosService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.listaNano = [];
    this.listaOrigen = [];
    if (this.bandeja !== 'mesa-partes') { this.listaOrigen.push({codigo: '1', valor: 'INTERNO'}); }
    this.listaOrigen.push({codigo: '2', valor: 'EXTERNO'});
    this.listaEstado = [];
    if (this.bandeja === 'mesa-partes') { this.listaEstado.push('INGRESADO'); }
    this.listaEstado.push('PENDIENTE');
    this.listaEstado.push('ATENDIDO');
    this.listaPrioridad = [];
    this.listaPrioridad.push('URGENTE');
    this.listaPrioridad.push('ALTA');
    this.listaPrioridad.push('MEDIA');
    this.listaPrioridad.push('BAJA');
    /** utilizar api parámetros para obtener periodos */
    if (this.session.read(this.SESSION_KEY_PERIODOS)) {
      this.listaNano = this.session.read(this.SESSION_KEY_PERIODOS);
    } else {
      this.parametros.buscarPeriodos().subscribe(
        (response: Response) => {
          this.listaNano = response.resultado;
          this.session.save(this.SESSION_KEY_PERIODOS, this.listaNano);
        },
        (response: Response) => {
          var nano: number;
          nano=+((new Date()).toISOString().substr(0,4));
          for(let i=0;i<=4;i++) {
            this.listaNano.push((nano-i).toString());
          }
        }
      );
    }
    /** */
    if (! this.filtrosBusqueda || ! this.filtrosBusqueda.avanzado) {
      this.filtrosBusqueda = new FiltroDocumento();
      this.filtrosBusqueda.nano = '';
      this.filtrosBusqueda.origen = (this.bandeja === 'mesa-partes') ? '2' : '0';
      this.filtrosBusqueda.prioridad = '0';
      this.filtrosBusqueda.estado = '0';
    } else if (!this.filtrosBusqueda.prioridad) {
      this.filtrosBusqueda.nano = '';
      this.filtrosBusqueda.prioridad = '0';
      this.filtrosBusqueda.estado = '0';
    }
    this.filtrosBusqueda.modalidad = ModalidadFiltro.TODOS;
    this.OnNano();
  }

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

  OnCambiarCorrelativo() {
    if (this.filtrosBusqueda.correlativo) {
      if (this.filtrosBusqueda.correlativoFin) {
        if (parseInt(this.filtrosBusqueda.correlativoFin) < parseInt(this.filtrosBusqueda.correlativo)) {
          this.filtrosBusqueda.correlativoFin = this.filtrosBusqueda.correlativo;
        }
      } else {
        this.filtrosBusqueda.correlativoFin = this.filtrosBusqueda.correlativo;
      }
    } else {
      this.filtrosBusqueda.correlativoFin = null;
    }
  }

  OnNano() {
    let fechaMinima: string;
    let fechaMaxima: string;
    console.log('Año seleccionado: ', this.filtrosBusqueda.nano);
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
