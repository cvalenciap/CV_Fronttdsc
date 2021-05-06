import {Injectable} from '@angular/core';
import {EstadoDocumento} from '../../models/enums';
import {Response, Documento} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IBandejaEntradaPlazoService} from '../interfaces/ibandeja-entrada-plazo.service';
import * as data from './documentos.json';

@Injectable({
  providedIn: 'root',
})
export class BandejaEntradaPlazoMockService implements IBandejaEntradaPlazoService {

  buscarDocumentos(parametros: any, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaBandejaEntradaPlazo;
    return Observable.of(response);
  }
}
