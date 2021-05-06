import { DefaultConfigFirma } from './default';
import { PosicionFirma, UbicacionPagina, EstiloFirma } from './enums';

export class VisarConfig extends DefaultConfigFirma {
  constructor() {
    super();
    this.razon = 'V°B°';
    this.comentario = '';
    this.tamanoFuente = 8;
    this.estiloFirma = EstiloFirma.ImagenDescripcion;
    this.posicionFirma = PosicionFirma.MedioDerecha;
    this.ubicacionPagina = UbicacionPagina.PrimeraPagina;
  }
}
