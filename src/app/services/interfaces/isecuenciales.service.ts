import {Secuencial} from '../../models';
import {Observable} from 'rxjs';

export interface ISecuencialesService {

  crear(): Secuencial;

  buscarPorParametros(parametros: {codigo?: string, fecha?: string, descripcion?: string}, pagina: number, registros: number): Observable<any>;

  buscarPorCodigo(codigo: string): Observable<any>;

  guardar(secuencial: Secuencial): Observable<any>;

  eliminar(secuencial: Secuencial): Observable<any>;


}
