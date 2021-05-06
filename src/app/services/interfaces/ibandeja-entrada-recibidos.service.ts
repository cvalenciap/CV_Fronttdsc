import {Documento} from '../../models';
import {Observable} from 'rxjs';

export interface IBandejaEntradaRecibidosService {
  crear(): Documento;
  buscarDocumentos(parametros: any, pagina: number, registros: number): Observable<any>;
  buscarDocumento(nano: number, correlativo: number): Observable<any>;
  obtenerSeguimiento(parametros: any, nano: number, correlativo: number, pagina: number, registros: number): Observable<any>;
  actualizarAtendido(nano: number, correlativo: number, codmov: number): Observable<any>;
  obtenerParametros(ncodarea: number): Observable<any>;
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
}
