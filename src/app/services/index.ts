import {environment} from '../../environments/environment';
/* Feriados */
import {FeriadosService} from './impl/feriados.service';
import {FeriadosMockService} from './mocks/feriados.mock';
/* Asuntos Estandarizados */
import {AsuntosService} from './impl/asuntos.service';
import {AsuntosMockService} from './mocks/asuntos.mock';
/* Tipos de Documentos */
import {TiposDocumentoService} from './impl/tipos-documento.service';
import {TiposDocumentoMockService} from './mocks/tipos-documento.mock';
/* Empresas */
import {EmpresasService} from './impl/empresas.service';
import {EmpresasMockService} from './mocks/empresas.mock';
/* Grupos */
import {GruposService} from './impl/grupos.service';
import {GruposMockService} from './mocks/grupos.mock';
/* Secuenciales */
import {SecuencialesService} from './impl/secuenciales.service';
import {SecuencialesMockService} from './mocks/secuenciales.mock';
/* Areas */
import {AreasMockService} from './mocks/areas.mock';
import {AreasService} from './impl/areas.service';
/* Trabajadores */
import {TrabajadoresMockService} from './mocks/trabajadores.mock';
import {TrabajadoresService} from './impl/trabajadores.service';
/* Bandeja de Entrada Recibidos*/
import {BandejaEntradaRecibidosService} from './impl/bandeja-entrada-recibidos.service';
/* Bandeja de Entrada Plazo*/
import {BandejaEntradaPlazoMockService} from './mocks/bandeja-entrada-plazo.mock';
/* Bandeja de Salida */
import {BandejaSalidaService} from './impl/bandeja-salida.service';
/* Reportes Generales */
import {ReportesGeneralesMockService} from './mocks/reportes-generales.mock';
/* Mesa de Partes */
import {MesaPartesService} from './impl/mesa-partes.service';
/* Bandeja de Salida Visados*/
import {BandejaSalidaVisadosService} from './impl/bandeja-salida-visados.service';
/* Bandeja de Salida Firmados*/
import {BandejaSalidaFirmadosService} from './impl/bandeja-salida-firmados.service';
import {BandejaEntradaPlazoService} from './impl/bandeja-entrada-plazo.service';
import {FileServerService} from './impl/file-server.service';
import {ReportesGeneralesService} from './impl/reportes-generales.service';
import {ParametrosService} from './impl/parametros.service';
/* Resumen */
import {StarterService} from './impl/starter.service';
export {
  FeriadosService,
  FeriadosMockService,
  AsuntosService,
  AsuntosMockService,
  TiposDocumentoService,
  TiposDocumentoMockService,
  EmpresasService,
  EmpresasMockService,
  GruposService,
  GruposMockService,
  SecuencialesService,
  SecuencialesMockService,
  AreasMockService,
  AreasService,
  BandejaEntradaRecibidosService,
  BandejaSalidaService,
  ReportesGeneralesMockService,
  MesaPartesService,
  FileServerService,
  TrabajadoresMockService,
  TrabajadoresService,
  ReportesGeneralesService,
  BandejaEntradaPlazoService,
  BandejaSalidaVisadosService,
  BandejaSalidaFirmadosService,
  ParametrosService,
  StarterService
};
