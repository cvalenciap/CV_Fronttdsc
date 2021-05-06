import {TipoDocumento} from '../models';
export class UploadResponse {
  mensaje?: string;
  ubicacion?: string;
  nombre?: string;
  nombreReal?:string;
  url?:string;
  extension?: string;
  anterior?: number;
  nano?: number;
  correlativo?: number;
  origen?: number;
  tipoDoc?: TipoDocumento;
  estado?: string;
  usuario?: string;
}
