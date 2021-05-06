import {Asunto} from '../../models';
import {Observable} from 'rxjs';

export interface IAsuntosService {

  crear(): Asunto;

  buscarPorParametros(parametros: {
    codigo?: string,
    descripcion?: string}, pagina: number, registros: number): Observable<any>;

  buscarPorCodigo(codigo: number): Observable<any>;

  guardar(asunto: Asunto): Observable<any>;

  eliminar(asunto: Asunto): Observable<any>;

}
