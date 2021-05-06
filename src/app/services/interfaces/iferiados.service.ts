import {Feriado} from '../../models';
import {Observable} from 'rxjs';

export interface IFeriadosService {

  crear(): Feriado;
  obtenerTipos():Observable<any>;
  buscarPorParametros(parametros: {
    codigo?: string,
    fecha?: string,
    descripcion?: string}, pagina: number, registros: number): Observable<any>;

  buscarPorCodigo(codigo: number): Observable<any>;

  guardar(feriado: Feriado): Observable<any>;

  eliminar(feriado: Feriado): Observable<any>;

}
