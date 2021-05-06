import {Area, Trabajador} from '../models';
import {EstadoDocumento} from '../models/enums';

export class Movimiento {
  codigo: number;
  areaOrigen: Area;
  trabajadorOrigen: Trabajador;
  fechaRegistro: Date;
  fechaPlazo: Date;
  estadoDocumento: EstadoDocumento;
  fechaComentario: Date;
  accionDocumento: string;
  constructor(){
    this.codigo=0;
    this.areaOrigen = new Area();
    this.trabajadorOrigen = new Trabajador();
    this.fechaRegistro = new Date();
    this.fechaPlazo = new Date();
    this.estadoDocumento = EstadoDocumento.PENDIENTE;
    this.fechaComentario = new Date();
  }
}
