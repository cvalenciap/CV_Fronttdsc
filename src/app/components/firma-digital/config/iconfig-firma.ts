import {TipoFirma, PosicionFirma, EstiloFirma, UbicacionPagina, VerFirma} from './enums';

export interface IConfigFirma {
  /**
   * URL del servicio de Firma Digital
   */
  endpoint: string;
  /**
   * Indica el tipo de firma: Para PDF, XML o CMS
   */
  tipoFirma: TipoFirma;
  /**
   * Ruta del servidor de firma donde se encuentran los documentos por firmar
   */
  rutaOrigen: string;
  /**
   * Ruta del servidor de firma donde se almacenarán los documentos firmados
   */
  rutaDestino: string;
  /**
   * Lista de nombres de archivo a firmar. Los archivos deben encontrarse en rutaOrigen
   */
  archivos: string[];
  /**
   * Razón por la que realiza la firma
   */
  razon: string;
  /**
   * Texto del cargo de la persona que firma
   */
  cargo?: string;
  /**
   * Texto que se mostrará como comentario en la firma
   */
  comentario?: string;
  /**
   * Ruta del servidor de firma donde se encuentran las imágenes para utilizar de fondo
   */
  rutaImagenes: string;
  /**
   * Nombre del archivo de imagen a utilizar como fondo
   */
  nombreImagen?: string;
  /**
   * Indica si firma será visible (1) o invisible (0)
   */
  invisible: boolean;
  /**
   * Indica el estilo de sello a aplicar en la página, la posición del texto e imagen
   */
  estiloFirma: EstiloFirma;
  /**
   * Indica la posición de la firma en la página
   */
  posicionFirma: PosicionFirma;
  /**
   * Indica en cuáles páginas se colocará la firma
   */
  ubicacionPagina: UbicacionPagina;
  /**
   * Indica el tamño de la fuente a utilizar en el texto de la firma. Utilizar si estiloFirma incluye Descripcion
   */
  tamanoFuente?: number;
  /**
   * Indica el alto de la imagen de firma. Utilizar si estiloFirma incluye Imagen
   */
  altoRubrica?: number;
  /**
   * Indica el ancho de la imagen de firma. Utilizar si estiloFirma incluye Imagen
   */
  anchoRubrica?: number;
  /**
   * Indica el número de la página donde se colocará la firma. Utilizar si ubicacionPagina es NumeroPagina
   */
  numeroPagina?: number;
  /**
   * Identificador de la persona que firmará el documento. Permite filtrar los certificados cliente.
   * Debe coincidir con el valor SERIALNUMBER del certificado
   */
  alias: string;
}
