import {Documento} from '../../models';
import {Observable} from 'rxjs';

export interface IBandejaEntradaPlazoService {
  buscarDocumentos(parametros: any, pagina: number, registros: number): Observable<any>;
}
