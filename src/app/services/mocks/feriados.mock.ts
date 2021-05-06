import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Response, Feriado} from '../../models';
import {Estado} from '../../models/enums';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IFeriadosService} from '../interfaces/iferiados.service';
import * as data from './feriados.json';

@Injectable({
  providedIn: 'root',
})
export class FeriadosMockService implements IFeriadosService {

  crear(): Feriado {
    const feriado = new Feriado();
    feriado.estado = Estado.ACTIVO;
    return feriado;
  }

  obtenerTipos() {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaTipos;
    return Observable.of(response);
  }

  buscarPorParametros(parametros: {codigo?: string, fecha?: string, descripcion?: string}, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaFeriados;
    return Observable.of(response);
  }

  buscarPorCodigo(codigo: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaFeriados[codigo - 1];
    return Observable.of(response);
  }

  guardar(feriado: Feriado) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaFeriados[0];
    return Observable.of(response);
  }

  eliminar(feriado: Feriado) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

}
