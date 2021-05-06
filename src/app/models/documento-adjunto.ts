import {TipoDocumento} from '../models';
import {OrigenDocumento} from '../models/enums';

export class DocumentoAdjunto {
  codigo?: number;
  ubicacion?: string;
  extension?: string;
  nombre?: string;
  nombreReal?: string;
  anterior?: number;
  nano?: number;
  correlativo?: number;
  codmov?: number;
  estado?: string;
  usuario?: string;
}
