/**
 * @const         FeriadosRoutes
 * @description   rutas feriados
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import {FeriadosListaComponent} from './views/lista.component';
import {FeriadosEditarComponent} from './views/editar.component';

export const FeriadosRoutes = [
  // Module routes
  {path: '', component: FeriadosListaComponent},
  {path: 'registrar', component: FeriadosEditarComponent},
  {path: 'editar/:codigo', component: FeriadosEditarComponent}
];
