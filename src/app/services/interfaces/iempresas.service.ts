import {Empresa} from '../../models';
import {Observable} from 'rxjs';

export interface IEmpresasService {

  crear(): Empresa;

  buscarPorParametros(parametros: {codigo?: string, descripcion?: string}, pagina: number, registros: number): Observable<any>;

  buscarPorCodigo(codigo: number): Observable<any>;

  obtenerTipos(): Observable<any>;

  guardar(empresa: Empresa): Observable<any>;

  eliminar(empresa: Empresa): Observable<any>;

}
