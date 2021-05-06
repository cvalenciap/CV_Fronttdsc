import {ModalidadFiltro} from './enums';
import * as moment from 'moment';
export class FiltroDocumento {
  private _valid: boolean;
  private _labels: {[key: string]: string} = {};
  avanzado: boolean = false; // para indicar si se utilizó el cuadro de búsqueda avanzada
  nano: string;
  origen?: string;
  correlativo?: string;
  correlativoFin?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  estado?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  asunto?: string;
  prioridad?: string;
  remitente?: string;
  dirigido?: string;
  docEntrada?: string;
  referencia?: string;
  modalidad?: ModalidadFiltro;

  constructor() {
    this._labels['nano'] = 'Año';
    this._labels['origen'] = 'Origen';
    this._labels['correlativo'] = 'Correlativo';
    this._labels['tipoDocumento'] = 'Tipo de Documento';
    this._labels['numeroDocumento'] = 'Número';
    this._labels['estado'] = 'Estado';
    this._labels['fechaInicio'] = 'Fecha de Documento';
    this._labels['asunto'] = 'Asunto';
    this._labels['prioridad'] = 'Prioridad';
    this._labels['remitente'] = 'Remitente';
    this._labels['dirigido'] = 'Derivado';
    this._labels['docEntrada'] = 'Documento de Entrada';
    this._labels['referencia'] = 'Referencia';
  }

  get values(): any {
    const result = {};
    Object.keys(this).forEach(key => {
      if (key[0] !== '_' && this[key] !== null && this[key] !== undefined && this[key] !== '') {
        result[key] = this[key];
      }
    });
    return result;
  }

  get keyValues(): {key: string, value: string}[] {
    const result = [];
    Object.keys(this).forEach(key => {
      if (key[0] !== '_' && this[key] !== null && this[key] !== undefined && this[key] !== '') {
        result.push({'key': key, 'value': this[key]});
      }
    });
    return result;
  }

  get labelValues(): {label: string, value: string}[] {
    const result = [];
    Object.keys(this._labels).forEach(key => {
      if (this[key] !== null && this[key] !== undefined && this[key] !== '') {
        const label = this._labels[key];
        const value = this[key];
        switch (key) {
          case 'correlativo':
            if (this.correlativoFin) {
              result.push({'label': label, 'value': value + ' - ' + this.correlativoFin});
            } else {
              result.push({'label': label, 'value': value});
            }
            break;
          case 'origen':
            if (this[key] !== '0')  {
              result.push({'label': label, 'value': value === '2' ? 'EXTERNO' : 'INTERNO'});
            }
            break;
          case 'fechaInicio':
            result.push({'label': label, 'value': moment(this.fechaInicio).format('DD/MM/YYYY') + ' - ' + moment(this.fechaFin).format('DD/MM/YYYY')});
            break;
          case 'estado':
            if (this[key] !== '0')  {
              result.push({'label': label, 'value': value});
            }
            break;
          case 'prioridad':
            if (this[key] !== '0')  {
              result.push({'label': label, 'value': value});
            }
            break;
          case 'asunto':
          case 'numeroDocumento':
          case 'remitente':
          case 'dirigido':
            result.push({'label': label, 'value': (<String>value).toUpperCase()});
            break;
          default:
            result.push({'label': label, 'value': value});
        }
      }
    });
    return result;
  }
}
