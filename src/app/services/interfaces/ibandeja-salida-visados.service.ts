import {Documento} from '../../models';
import {Observable} from 'rxjs';

export interface IBandejaSalidaVisadosService {
  buscarDocumentos(parametros: any, pagina: number, registros: number): Observable<any>;
}