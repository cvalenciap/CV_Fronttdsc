import {Trabajador, FiltroTrabajador} from '../../models';
import {Observable} from 'rxjs';


export interface ITrabajadoresService {
  listar(filtroTrabajador: FiltroTrabajador): Observable<any>;
}
