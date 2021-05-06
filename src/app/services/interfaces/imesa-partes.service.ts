import {Documento} from '../../models';
import {Observable} from 'rxjs';

export interface IMesaPartesService {

  //crear(): Documento;

  buscarDocumentos(parametros: {
    modalidad?: string,
    correlativo?: string,
    nano?: string,
    asunto?: string;
    origen?: string,
    tipoDocumento?: string;
    numeroDocumento?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    remitente?: string;
    estado?: string,
    prioridad?: string}, 
    pagina: number, 
    registros: number): Observable<any>;

  cargarParametros(): Observable<any>;

  calcularFechaPlazo(fechaRegistro: Date, plazo: number): Observable<any>;

  cambiarRemitente(parametros: {descripcion: string}, pagina: number, registros: number): Observable<any>;

  cambiarRepresentantes(codigo: number): Observable<any>;

  crearDocumento(): Documento;

  guardarDocumento(documento: Documento): Observable<any>;

  obtenerDocumento(nano: number, correlativo: number): Observable<any>;

  eliminarDocumento(nano: number, correlativo: number): Observable<any>;

  actualizarArchivo(documento: Documento, nano: number, correlativo: number): Observable<any>;

  generarExcel(parametros: {
    modalidad?: string,
    correlativo?: string,
    nano?: string,
    asunto?: string;
    origen?: string,
    tipoDocumento?: string;
    numeroDocumento?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    remitente?: string;
    estado?: string,
    prioridad?: string}): Observable<any>;

  /*

  validarDocumento(documento: Documento): Observable<any>;

  eliminarDocumento(nano: number, correlativo: number): Observable<any>;

  actualizarDocumento(documento: Documento): Observable<any>;

  adjuntarArchivo(nano: number, codigo: number, url: string): Observable<any>;

  adjuntarAnexo(nano: number, codigo: number, url: string): Observable<any>;

  eliminarAnexo(documento: Documento): Observable<any>;
  */
}

