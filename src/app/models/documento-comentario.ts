import {Trabajador, Movimiento} from '../models';
import {EstadoDocumento} from '../models/enums';

export class DocumentoComentario {
  codigo: number;
  descripcion: string;
  fechaComentario: Date;
  estadoComentario: EstadoDocumento;
  indicador: number;
  usuarioRegistro: string;
  fechaRegistro: Date;
  avnomprg: string;
  movimiento: Movimiento;
  trabajador: Trabajador;
}
