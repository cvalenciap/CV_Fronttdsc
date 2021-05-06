import {Injectable} from '@angular/core';
import {EstadoDocumento} from '../../models/enums';
import {Response, Documento} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IBandejaSalidaFirmadosService} from '../interfaces/ibandeja-salida-firmados.service';
import * as data from './documentos.json';

@Injectable({
  providedIn: 'root',
})
export class BandejaSalidaFirmadosMockService implements IBandejaSalidaFirmadosService {

  buscarDocumentos(parametros: any, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaBandejaSalidaFirmados;
    return Observable.of(response);
  }
}
