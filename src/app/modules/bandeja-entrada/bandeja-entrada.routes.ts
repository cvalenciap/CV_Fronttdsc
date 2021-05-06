import {BandejaRecibidosComponent} from './views/bandeja-recibidos.component';
import {BandejaPlazoComponent} from './views/bandeja-plazo.component';
import {RegistrarDocumentoComponent} from './views/registrar.component';
import {EditarDocumentoComponent} from './views/editar.component';
import {Documento} from '../../models/documento';

export const BandejaEntradaRoutes = [
  // Module routes
  {path: 'recibidos', component: BandejaRecibidosComponent},
  {path: 'con-plazo', component: BandejaPlazoComponent}, // con-plazo
  {path: 'registrar', component: RegistrarDocumentoComponent},
  {path: 'editar/:nano/:correlativo', component: RegistrarDocumentoComponent},
  {path: 'documento/:nano/:correlativo', component: EditarDocumentoComponent}
  //{path: 'documento', component: EditarDocumentoComponent}
];


