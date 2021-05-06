import {Area, Trabajador} from '../../models';
import {Observable} from 'rxjs';

export interface IAreasService {

  buscarPorParametros(parametros: { codigo?: string, descripcion?: string}): Observable<any>;

  buscarPorCodigo(codigo: number): Observable<any>;

  obtenerJefe(codigo: number): Observable<any>;

  validarJefe(codigo: number, numeroFicha: number): Observable<any>;

  actualizarJefe(idArea: number, jefe: Trabajador): Observable<any>;

}
