import { DefaultConfigFirma } from './default';
import { PosicionFirma, UbicacionPagina, EstiloFirma } from './enums';

export class FirmarConfig extends DefaultConfigFirma {
  constructor() {
    super();
    this.razon = 'Firma';
    this.comentario = '';
    this.tamanoFuente = 8;
    this.estiloFirma = EstiloFirma.ImagenDescripcion;
    this.posicionFirma = PosicionFirma.SuperiorDerecha;
    this.ubicacionPagina = UbicacionPagina.PrimeraPagina;
  }
}
