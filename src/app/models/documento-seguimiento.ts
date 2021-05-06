import {Area, Trabajador, TipoDocumento, DocumentoDirigido} from '../models';
import {OrigenDocumento, AccionDocumento , EstadoDocumento} from '../models/enums';

export class DocumentoSeguimiento {
  nano: number;
  correlativo: number;
  codmov: number;
  codmovant: number;
  codseg : number;
  tipoDocumento : TipoDocumento;
  areaRemitente : Area;
  trabajadorRemitente : Trabajador;
  areaDestino : Area;
  trabajadorDestino : Trabajador;
  acciones : AccionDocumento[];
  fechaDerivacion : Date;
  fechaRecepcion : Date;
  observaciones : string;
  plazo : number;
  fechaPlazo: Date;
  estado : EstadoDocumento;
  urlDocumento : string;
  origen: OrigenDocumento;
  usuario : string;
  indRecFis : number;
  fechaRecFis : Date;
  dirigidos: DocumentoDirigido[];
  accionesstr: string;
}
