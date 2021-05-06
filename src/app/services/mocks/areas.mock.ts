import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Response, Area, Trabajador} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IAreasService} from '../interfaces/iareas.service';
import * as data from './areas.json';

@Injectable({
  providedIn: 'root',
})

export class AreasMockService implements IAreasService {

  buscar(parametros: {codigo?: string, descripcion?: string}) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaAreas;
    return Observable.of(response);
  }

  buscarPorParametros(parametros: {codigo?: string, descripcion?: string}) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaAreas;
    return Observable.of(response);
  }

  buscarPorCodigo(codigo: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaAreas[codigo - 1];
    return Observable.of(response);
  }

  obtenerJefe(codigo: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).jefe;
    return Observable.of(response);
  }

  validarJefe(codigoArea: number, numeroFicha: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = 1;
    return Observable.of(response);
  }

  actualizarJefe(codigoArea: number, jefe: Trabajador) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

}
