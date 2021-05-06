import {Grupo} from '../../models';
import {Observable} from 'rxjs';

export interface IGruposService {

  crear(): Grupo;

  buscarPorParametros(parametros: {codigo?: string, descripcion?: string}, pagina: number, registros: number): Observable<any>;

  buscarPorCodigo(codigo: number): Observable<any>;

  guardar(grupo: Grupo): Observable<any>;

  eliminar(grupo: Grupo): Observable<any>;

}
