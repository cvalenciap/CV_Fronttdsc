import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Response, Grupo} from '../../models';
import {Estado} from '../../models/enums';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IGruposService} from '../interfaces/igrupos.service';
import * as data from './grupos.json';

@Injectable({
  providedIn: 'root',
})
export class GruposMockService implements IGruposService {

  crear(): Grupo {
    const grupo = new Grupo();
    grupo.estado = Estado.ACTIVO;
    return grupo;
  }

  buscarPorParametros(parametros: {codigo?: string, fecha?: string, descripcion?: string}, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaGrupos;
    return Observable.of(response);
  }

  buscarPorCodigo(codigo: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).grupo;
    //response.resultado = (<any>data).listaGrupos[codigo - 1];
    return Observable.of(response);
  }

  guardar(grupo: Grupo) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaGrupos[0];
    return Observable.of(response);
  }

  eliminar(grupo: Grupo) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

}
