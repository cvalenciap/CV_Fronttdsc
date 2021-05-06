import {BandejaPendientesComponent} from './views/bandeja-pendientes.component';
import {BandejaVisadosComponent} from './views/bandeja-visados.component';
import {BandejaFirmadosComponent} from './views/bandeja-firmados.component';
import {RegistrarDocumentoComponent} from './views/registrar.component';
import {EditarDocumentoComponent} from './views/editar.component';

export const BandejaSalidaRoutes = [
  // Module routes
  {path: 'pendientes', component: BandejaPendientesComponent},
  {path: 'visados', component: BandejaVisadosComponent},
  {path: 'firmados', component: BandejaFirmadosComponent},
  {path: 'registrar', component: RegistrarDocumentoComponent},
  {path: 'editar/:codigo', component: RegistrarDocumentoComponent},
  {path: 'editar/:codigo/:codMovimiento', component: RegistrarDocumentoComponent},
  {path: 'documento/:codDocumento/:codMovimiento', component: EditarDocumentoComponent}
];
