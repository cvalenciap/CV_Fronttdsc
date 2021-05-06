import {Injectable} from '@angular/core';
import {EstadoDocumento} from '../../models/enums';
import {Response, Documento} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IBandejaSalidaService} from '../interfaces/ibandeja-salida.service';
import * as data from './documentos.json';

@Injectable({
  providedIn: 'root',
})
export class BandejaSalidaVisadosMockService {
//export class BandejaSalidaVisadosMockService implements IBandejaSalidaVisadosService {

  buscarDocumentos(parametros: any, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaBandejaSalidaVisados;
    return Observable.of(response);
  }
}
