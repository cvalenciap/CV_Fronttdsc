import {IConfigFirma} from './iconfig-firma';
import {TipoFirma, EstiloFirma, PosicionFirma, UbicacionPagina} from './enums';
import {environment} from '../../../../environments/environment';

export class DefaultConfigFirma implements IConfigFirma {
  endpoint: string;
  tipoFirma: TipoFirma;
  rutaOrigen: string;
  rutaDestino: string;
  archivos: string[];
  razon: string;
  cargo?: string;
  comentario?: string;
  rutaImagenes: string;
  nombreImagen?: string;
  invisible: boolean;
  estiloFirma: EstiloFirma;
  posicionFirma: PosicionFirma;
  ubicacionPagina: UbicacionPagina;
  tamanoFuente?: number;
  altoRubrica?: number;
  anchoRubrica?: number;
  numeroPagina?: number;
  alias: string;

  constructor() {
    this.endpoint = environment.firmaEndpoint;
    this.rutaOrigen = environment.firmaRutaBase + environment.firmaRutaOrigen;
    this.rutaDestino = environment.firmaRutaBase + environment.firmaRutaDestino;
    this.rutaImagenes = environment.firmaRutaBase + environment.firmaRutaImagenes;
    this.tipoFirma = TipoFirma.PADES;
    this.invisible = false;
    this.archivos = [];
  }
}
