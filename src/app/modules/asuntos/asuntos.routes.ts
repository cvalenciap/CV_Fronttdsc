/**
 * @const         AsuntosRoutes
 * @description   rutas asuntos
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import {AsuntosListaComponent} from './views/lista.component';
import {AsuntosEditarComponent} from './views/editar.component';

export const AsuntosRoutes = [
  {path: '', component: AsuntosListaComponent},
  {path: 'registrar', component: AsuntosEditarComponent},
  {path:'editar/:codigo', component:AsuntosEditarComponent}
];
