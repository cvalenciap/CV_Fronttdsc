import {EmpresasListaComponent} from './views/empresa-lista.component';
import {EmpresasEditarComponent} from './views/empresa-editar.component';

export const EmpresasRoutes = [
  // Module routes
  {path: '', component: EmpresasListaComponent},
  {path: 'nuevo', component: EmpresasEditarComponent},
  {path: 'editar/:codigo', component: EmpresasEditarComponent}
];
