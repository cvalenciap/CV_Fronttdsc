import {Injectable} from '@angular/core';
import {EstadoDocumento} from '../../models/enums';
import {Response, Documento, Empresa} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IMesaPartesService} from '../interfaces/imesa-partes.service';
import * as data from './documentos.json';

@Injectable({
  providedIn: 'root',
})
export class MesaPartesMockService implements IMesaPartesService {

  crear(): Documento {
    const documento = new Documento();
    documento.estado = EstadoDocumento.INGRESADO;
    return documento;
  }
//  buscarDocumentos(pagina: number, registros: number): Observable<any>;
/*
  buscarDocumentos(parametros: {codigo?: string, descripcion?: string}, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaMesaPartes;
    return Observable.of(response);
  }*/
  buscarDocumentos(FiltrosBandeja, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaMesaPartes;
    return Observable.of(response);
  }

  cargarParametros() {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }



  calcularFechaPlazo(fechaRegistro: Date, plazo: number) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

  cambiarRemitente(parametros: {descripcion: String}, pagina: number, registros: number) {
    const response = new Response();
    response.estado = "OK";
    return Observable.of(response);
  }

  cambiarRepresentantes(codigo: number) {
    const response = new Response();
    response.estado = "OK";
    return Observable.of(response);
  }

  crearDocumento(): Documento {
    const documento = new Documento();
    documento.remitente = new Empresa();
    return documento;
  }

  guardarDocumento(documento: Documento) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaMesaPartes[0];
    return Observable.of(response);
  }

  obtenerDocumento(nano: number, correlativo: number) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

  eliminarDocumento(nano: number, codigo: number) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

  actualizarArchivo(documento: Documento, nano: number, correlativo: number) {
    const response = new Response();
    response.estado="OK";
    return Observable.of(response);
  }

  generarExcel(parametros: {
    modalidad: string,
    correlativo?: string,
    tipoDocumento?: string,
    numeroDocumento?: string,
    asunto?: string,
    remitente?: string,
    prioridad?: string}): Observable<any> {
      const response = new Response();
      return Observable.of(response);
    }

  /*

  validarDocumento(documento: Documento) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

  buscarDocumento(nano: number, correlativo: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaMesaPartes[0];
    return Observable.of(response);
  }

  actualizarDocumento(documento: Documento) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaMesaPartes[0];
    return Observable.of(response);
  }

  adjuntarArchivo(nano: number, codigo: number, url: string) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

  adjuntarAnexo(nano: number, codigo: number, url: string) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

  eliminarAnexo(documento: Documento) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }
*/
}
