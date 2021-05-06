import {Injectable} from '@angular/core';
import {EstadoDocumento, OrigenDocumento} from '../../models/enums';
import {Response, Documento} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IBandejaSalidaPendientesService} from '../interfaces/ibandeja-salida-pendientes.service';
import * as data from './documentos.json';

@Injectable({
  providedIn: 'root',
})
export class BandejaSalidaPendientesMockService implements IBandejaSalidaPendientesService {
  crearDocumento() {
    const documento = new Documento();
    documento.origen = OrigenDocumento.INTERNO;
    return documento;
  }

  buscarDocumentos(parametros: any, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaBandejaSalidaPendientes;
    return Observable.of(response);
  }
}
