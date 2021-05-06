import {NivelError} from './enums/nivel-error';
type Estados = 'OK'|'ERROR';

export class Error {
  codigo: string;
  nivel: NivelError;
  mensaje: string;
  mensajeInterno: string;
}

export class Response {
  estado: Estados;
  paginacion: any;
  acciones?: string[];
  error?: Error;
  resultado?: any;
}
