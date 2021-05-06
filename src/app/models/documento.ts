import {OrigenDocumento, EstadoDocumento, PrioridadDocumento, AccionDocumento} from '../models/enums';
import {MinLength, MaxLength, ValidateNested} from 'class-validator';
import {TipoDocumento, Area, Trabajador, Representante, Empresa, DocumentoDirigido, DocumentoAdjunto, DocumentoFirmante, DocumentoSeguimiento, Movimiento} from '../models';

export class Documento {
  vbandeja?: string;
  nano?: number;
  origen?: OrigenDocumento;
  correlativo?: number;
  tipoDocumento?: TipoDocumento;
  numero?: string;
  estado?: EstadoDocumento;
  fechaDocumento?: Date;
  @MinLength(0, {message: 'Se requiere Observaciones'})
  @MaxLength(1000, {message: 'La longitud de Asunto es mayor a $constraint1 caracteres'})
  asunto?: string;
  prioridad?: PrioridadDocumento;
  urlDocumento?: string;
  @MinLength(0, {message: 'Se requiere Referencia'})
  @MaxLength(1000, {message: 'La longitud de Referencia es mayor a $constraint1 caracteres'})
  referencia?: string;
  anexos?: DocumentoAdjunto[];
  remitente?: Empresa;
  representante?: Representante;
  destinatarios?: Area[];
  dirigidos?: DocumentoDirigido[];
  dirigidos_to?: DocumentoDirigido[];
  dirigidos_cc?: DocumentoDirigido[];
  primeraArea?: Area;
  areaOrigen?: Area;
  trabajadorOrigen?: Trabajador;
  areaDestino?: Area;
  trabajadorDestino?: Trabajador;
  empresaDestino?: Empresa;
  representanteDestino?: Representante;
  firmantes?: string;
  fechaRecepcion?: Date;
  plazo?: number;
  fechaPlazo?: Date;
  acciones?: AccionDocumento[];
  @MinLength(0, {message: 'Se requiere Observaciones'})
  @MaxLength(1000, {message: 'La longitud de Observaciones es mayor a $constraint1 caracteres'})
  observaciones?: string;
  fechaRegistro?: Date;
  fechaModificacion?: Date;
  responsableCreacion?: string;
  responsableModificacion?: string;
  codigo?: number;
  contenido?: string;
  documentoEntrada?: string;
  nanoEntrada?: number;
  codEntrada?: number;
  correlativoEntrada?: string;
  listaSeguimiento?: DocumentoSeguimiento[];
  opcion?: string;
  selected: boolean;
  dirigidosTrabajador?: Trabajador[];
  dirigidosEmpresa?: Empresa[];
  dirigidosRepresentante?: Representante[];
  firmante? : Trabajador;
  visante?: Trabajador;
  firmanteArea?: DocumentoFirmante;
  visantes?: DocumentoFirmante[];
  folios?: number;
  accionesstr?: string;
  areaRemitente: Area;
  movimiento: Movimiento;
  vencimiento: string;
  vencimientodias: number;
  permisoEdicion: number;
  areaPrincipal?: Area;
  codmov?: number;
  nindleido?: number;
  nindrecib?: number;
  urlReferencia?: string;

  constructor(){
    this.asunto = "";
    this.observaciones = "";
    this.referencia = "";
    this.areaPrincipal = new Area();
    this.firmanteArea = new DocumentoFirmante();
    this.areaOrigen = new Area();
    this.areaDestino = new Area();
    this.trabajadorOrigen = new Trabajador();
    this.trabajadorDestino = new Trabajador();
    this.empresaDestino = new Empresa();
    this.dirigidos_cc = new Array<DocumentoDirigido>();
    this.vencimiento = '';
    this.vencimientodias=null;
    this.movimiento = new Movimiento();
    this.tipoDocumento = new TipoDocumento();
    this.areaRemitente = new Area();
  }
}
