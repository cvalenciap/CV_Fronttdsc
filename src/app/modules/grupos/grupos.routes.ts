import {GruposListaComponent} from './views/lista.component';
import {GruposEditarComponent} from './views/editar.component';

export const GruposRoutes = [
  // Module routes
  {path: '', component: GruposListaComponent},
  {path: 'registrar', component: GruposEditarComponent},
  {path: 'editar/:codigo', component: GruposEditarComponent}
];
