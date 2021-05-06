import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Response, Asunto} from '../../models';
import {Estado} from '../../models/enums';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IAsuntosService} from '../interfaces/iasuntos.service';
import * as data from './asuntos.json';

@Injectable({
  providedIn: 'root',
})
export class AsuntosMockService  {

  crear(): Asunto {
    const asunto = new Asunto();
    asunto.estado = Estado.ACTIVO;
    return asunto;
  }

  buscarPorParametros(parametros: {codigo?: string, fecha?: string, descripcion?: string}, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaAsuntos;
    return Observable.of(response);
  }

  buscarPorCodigo(codigo: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaAsuntos[codigo - 1];
    return Observable.of(response);
  }

  guardar(asunto: Asunto) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaAsuntos[0];
    return Observable.of(response);
  }

  eliminar(asunto: Asunto) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

}
