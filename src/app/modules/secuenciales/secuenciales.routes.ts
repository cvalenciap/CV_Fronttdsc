/**
 * @const         SecuencialesRoutes
 * @description   rutas secuenciales
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import {SecuencialesListaComponent} from './views/lista.component';
import {SecuencialesEditarComponent} from './views/editar.component';

export const SecuencialesRoutes = [
  // Module routes
  {path: '', component: SecuencialesListaComponent},
  {path: 'editar/:codTipDoc', component: SecuencialesEditarComponent}
];
