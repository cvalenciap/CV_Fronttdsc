import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Response, FiltroTrabajador, Trabajador} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {ITrabajadoresService} from '../interfaces/itrabajadores.service';
import * as data from './trabajadores.json';

@Injectable({
  providedIn: 'root',
})
export class TrabajadoresMockService implements ITrabajadoresService {

  listar(filtroTrabajador: FiltroTrabajador) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = 'Nada';
    return Observable.of(response);
  }

}
