import {AtencionDocumentosComponent} from './views/atencion-documentos.component';
import {ConsultaAreaFechaEstadoComponent} from './views/consulta-area-fecha-estado.component';
import {ConsultaSeguimiento} from './views/consulta-seguimiento.component';
import {ConsultaRegistroEntrada} from './views/consulta-registro-entrada.component';
import {DocumentoEntrada} from './views/documento-entrada.component';
import {ConsultaDocumentoAsignadoComponent} from './views/consulta-documento-asignado.component';

export const ReportesGeneralesRoutes = [
  // Module routes
  {path: 'atencion-documentos', component: AtencionDocumentosComponent},
  {path: 'consulta-area-fecha-estado', component: ConsultaAreaFechaEstadoComponent},
  {path: 'consulta-seguimiento', component: ConsultaSeguimiento},
  {path: 'consulta-registro-entrada', component: ConsultaRegistroEntrada},
  {path: 'documento-entrada', component: DocumentoEntrada},
  {path: 'consulta-documento-asignado', component: ConsultaDocumentoAsignadoComponent}
  ];
