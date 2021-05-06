import {BandejaMesaPartesComponent} from './views/bandeja.component';
import {EditarDocumentoComponent} from './views/editar.component';
import {RegistrarDocumentoComponent} from './views/registrar.component';

export const MesaPartesRoutes = [
  // Module routes
  {path: '', component: BandejaMesaPartesComponent},
  {path: 'registrar', component: RegistrarDocumentoComponent},
  {path: 'editar/:nano/:correlativo', component: RegistrarDocumentoComponent},
  {path: 'documento/:nano/:correlativo', component: EditarDocumentoComponent}
];
