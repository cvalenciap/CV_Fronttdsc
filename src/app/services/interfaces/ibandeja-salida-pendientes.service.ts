import {Documento} from '../../models';
import {Observable} from 'rxjs';

export interface IBandejaSalidaPendientesService {
  crearDocumento(): Documento;
  buscarDocumentos(parametros: any, pagina: number, registros: number): Observable<any>;
}
