import {Injectable} from '@angular/core';
import {Estado} from '../../models/enums';
import {Response, TipoDocumento} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {ITiposDocumentoService} from '../interfaces/itipos-documento.service';
import * as data from './tipos-documento.json';

@Injectable({
  providedIn: 'root',
})
export class TiposDocumentoMockService implements ITiposDocumentoService {

  crear(): TipoDocumento {
    const tipoDocumento = new TipoDocumento();
    tipoDocumento.estado = Estado.ACTIVO;
    return tipoDocumento;
  }

  buscarPorParametros(parametros: {codigo?: string, fecha?: string, descripcion?: string}, pagina?: number, registros?: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaTiposDocumento;
    return Observable.of(response);
  }

  buscarPorCodigo(codigo?: string) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaTiposDocumento[0];
    return Observable.of(response);
  }

  guardar(tipoDocumento?: TipoDocumento) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaTiposDocumento[0];
    return Observable.of(response);
  }

  eliminar(tipoDocumento?: TipoDocumento) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }
}
