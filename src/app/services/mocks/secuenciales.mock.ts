import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Response, Secuencial} from '../../models';
import {Estado} from '../../models/enums';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {ISecuencialesService} from '../interfaces/isecuenciales.service';
import * as data from './secuenciales.json';

@Injectable({
  providedIn: 'root',
})
export class SecuencialesMockService implements ISecuencialesService {

  crear(): Secuencial {
    const secuencial = new Secuencial();
    secuencial.estado = Estado.ACTIVO;
    return secuencial;
  }

  buscarPorParametros(parametros: {codigo?: string, fecha?: string, descripcion?: string}, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaSecuenciales;
    return Observable.of(response);
  }

  buscarPorCodigo(codigo: string) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).secuencial;
    //
    //response.resultado = (<any>data).listaSecuenciales[codigo];
    // - 1
    console.log(codigo);
    return Observable.of(response);
  }

  guardar(secuencial: Secuencial) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaSecuenciales[0];
    return Observable.of(response);
  }

  eliminar(secuencial: Secuencial) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

}
