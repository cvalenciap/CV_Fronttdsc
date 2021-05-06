import {TipoDocumento} from '../../models';
import {Observable} from 'rxjs';

export interface ITiposDocumentoService {

  crear(): TipoDocumento;

  buscarPorParametros(parametros: {codigo?: string, descripcion?: string}, pagina?: number, registros?: number): Observable<any>;

  buscarPorCodigo(codigo?: string): Observable<any>;

  guardar(tipoDocumento?: TipoDocumento): Observable<any>;

  eliminar(tipoDocumento?: TipoDocumento): Observable<any>;

}
