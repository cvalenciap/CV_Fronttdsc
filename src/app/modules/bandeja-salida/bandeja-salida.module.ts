import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ModalModule, BsModalService} from 'ngx-bootstrap/modal';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {NgSelectModule, NG_SELECT_DEFAULT_CONFIG} from '@ng-select/ng-select';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';
import {ToastrModule} from 'ngx-toastr';
import { NgxSummernoteModule } from 'ngx-summernote';
import {DialogsModule} from '../dialogs/dialogs.module';
import {FirmaDigitalModule} from '../../components/firma-digital/firma-digital.module';
import {AuthDirectivesModule} from './../../auth/auth.directives';
import {LayoutsModule} from '../../components/common/layouts/layouts.module';
import {ItemDirigidoComponent} from './components/item-dirigido.component';
import {ItemDirigidoEmpresaComponent} from './components/item-dirigido-empresa.component';
import {ItemVisanteComponent} from './components/item-visante.component';
import {BandejaSalidaRoutes} from './bandeja-salida.routes';

// views
import {BandejaPendientesComponent} from './views/bandeja-pendientes.component';
import {BandejaVisadosComponent} from './views/bandeja-visados.component';
import {BandejaFirmadosComponent} from './views/bandeja-firmados.component';
import {RegistrarDocumentoComponent} from './views/registrar.component';
import {EditarDocumentoComponent} from './views/editar.component';
import {BusquedaModule} from '../../components/common/busqueda/busqueda.module';
import {ValidatorsModule} from '../../components/forms/validators';


// modules/components


@NgModule({
  declarations: [
    BandejaPendientesComponent,
    BandejaVisadosComponent,
    BandejaFirmadosComponent,
    RegistrarDocumentoComponent,
    EditarDocumentoComponent,
    ItemDirigidoComponent,
    ItemVisanteComponent,
    ItemDirigidoEmpresaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonsModule.forRoot(),
    BsDropdownModule,
    PaginacionModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsDatepickerModule,
    NgSelectModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    NgxSummernoteModule,
    DialogsModule,
    LayoutsModule,
    FirmaDigitalModule,
    AuthDirectivesModule,
    ValidatorsModule,
    BusquedaModule
  ]
})
export class BandejaSalidaModule { }
