/**
 * @const         TiposDocumentoRoutes
 * @description   rutas tipo documento
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import {TiposDocumentoListaComponent} from './views/lista.component';
import {TiposDocumentoEditarComponent} from './views/editar.component';

export const TiposDocumentoRoutes = [
  // Module routes
  {path: '', component: TiposDocumentoListaComponent},
  {path: 'nuevo', component: TiposDocumentoEditarComponent},
  {path: 'editar/:codigo', component: TiposDocumentoEditarComponent}
];
