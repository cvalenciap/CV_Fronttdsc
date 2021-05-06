import {Observable} from 'rxjs';
import {Paginacion} from '../../models';
export interface IReportesGeneralesService {
  consultarDocumentosEntrada(parametros: {nano: number, codigo: number}, pagina: number, registros:number): Observable<any>;
  exportarDocumentosEntrada(parametros: {nano?: number, registro?: number}, pagina: number, registros:number): Observable<any>;
  consultarAtencionDocumentos(parametros: {fechaInicial?: Date, fechaFinal?: Date, correlativo?: number, tipo?: string, ficha?: number}, pagina: number, registros:number): Observable<any>;
  imprimirAtencionDocumentos(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string, ficha:number }, pagina: number, registros:number ):Observable<any>;
  exportarAtencionDocumentos(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string, ficha:number }, pagina: number, registros:number ):Observable<any>;
  consultarPorSeguimiento(parametros: {nano?: number, area?: number, numeroDocumento?: string, tipoDocumento: string}, pagina: number, registros:number): Observable<any>;
  consultarPorAreaFechaEstado(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string}, pagina: number, registros:number ): Observable<any>;
  exportarPorAreaFechaEstado(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string}, pagina: number, registros:number ):Observable<any>;
  consultarDocumentosAsignados(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, ficha: number}, pagina: number, registros:number ): Observable<any>;
  imprimirDocumentosAsignados(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, ficha: number}, pagina: number, registros:number ):Observable<any>;
  exportarDocumentosAsignados(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, ficha: number}, pagina: number, registros:number ):Observable<any>;
  consultarPorRegistroEntrada(parametros: {numeroDocumento?: string, nano?: number, tipoDocumento?: string}, pagina: number, registros:number ): Observable<any>;
  exportarPorRegistroEntrada(parametros: {nano?: number,numeroDocumento?: string, tipoDocumento?: string}, pagina: number, registros:number ):Observable<any>;
  listarAnno():Observable<any>;
  obtenerParametros(): Observable<any>;
}
