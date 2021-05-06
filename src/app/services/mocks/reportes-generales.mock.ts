import {Injectable} from '@angular/core';
import {Estado} from '../../models/enums';
import {Response, Documento} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {IReportesGeneralesService} from '../interfaces/ireportes-generales.service';
import * as data from './reportes-generales.json';

@Injectable({
  providedIn: 'root',
})

//export class ReportesGeneralesMockService implements IReportesGeneralesService {
export class ReportesGeneralesMockService {
  private apiEndpoint: string;
  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/reportes';
  }
  obtenerParametros(): Observable<any> {
    let url = `${this.apiEndpoint}/obtenerparametros`;
    console.log(url);
    return this.http.get(url);
  }
  consultarDocumentosEntrada(parametros: {nano?: number, codigo?: number}) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaDocumentosEntrada;
    return Observable.of(response);
  }
  exportarDocumentosEntrada() {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }
  consultarAtencionDocumentos(parametros: {fechaInicial?: Date, fechaFinal?: Date, correlativo?: number, tipo?: string, ficha?: number}) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaAtencionDocumentos;
    return Observable.of(response);
  }
  listarAnno() {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaAnno;
    return Observable.of(response);
  }
  imprimirAtencionDocumentos() {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }
  exportarAtencionDocumentos() {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }
  consultarPorAreaFechaEstado(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string}, pagina: number, registros:number ){
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaPorAreaFechaEstado;
    return Observable.of(response);
  }
  exportarPorAreaFechaEstado() {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }
  consultarDocumentosAsignados(parametros: {area?: number, ficha?: number, fechaInicial?: Date, fechaFinal?: Date}) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaDocumentosAsignados;
    return Observable.of(response);
  }
  imprimirDocumentosAsignados() {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }
  consultarPorSeguimiento(parametros: {numeroDocumento?: string, nano?: number, area?: number, tipoDocumento?: string}) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaPorSeguimiento;
    return Observable.of(response);
  }
  consultarPorRegistroEntrada(parametros: {numeroDocumento?: string, nano?: number, tipoDocumento?: string}) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaPorRegistroEntrada;
    return Observable.of(response);
  }
  exportarPorRegistroEntrada() {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }
}
