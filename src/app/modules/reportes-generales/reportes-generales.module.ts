import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SpinKitModule} from './../../components/common/spinkit/spinkit.module';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {ReportesGeneralesRoutes} from './reportes-generales.routes';
import {NgSelectModule, NG_SELECT_DEFAULT_CONFIG} from '@ng-select/ng-select';
import {ModalModule, BsModalService} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import { NgxSummernoteModule } from 'ngx-summernote';
import {DialogsModule} from '../dialogs/dialogs.module';
import {LayoutsModule} from '../../components/common/layouts/layouts.module';
// views
import {AtencionDocumentosComponent} from './views/atencion-documentos.component';
import {ConsultaAreaFechaEstadoComponent} from './views/consulta-area-fecha-estado.component';
import {ConsultaSeguimiento} from './views/consulta-seguimiento.component';
import {ConsultaRegistroEntrada} from './views/consulta-registro-entrada.component';
import {DocumentoEntrada} from './views/documento-entrada.component';
import {ConsultaDocumentoAsignadoComponent} from './views/consulta-documento-asignado.component';

// modules/components


@NgModule({
  declarations: [
    AtencionDocumentosComponent,ConsultaAreaFechaEstadoComponent,ConsultaSeguimiento,ConsultaRegistroEntrada,DocumentoEntrada,ConsultaDocumentoAsignadoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule,
    PaginacionModule,
    PaginationModule.forRoot(),
    BsDatepickerModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    NgSelectModule,
    FormsModule,
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    NgxSummernoteModule,
    DialogsModule,
    LayoutsModule
  ]
})
export class ReportesGeneralesModule { }
