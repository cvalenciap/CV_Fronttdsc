import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ModalModule, BsModalService} from 'ngx-bootstrap/modal';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {NG_SELECT_DEFAULT_CONFIG, NgSelectModule} from '@ng-select/ng-select';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';
import {ToastrModule} from 'ngx-toastr';
import {AuthDirectivesModule} from './../../auth/auth.directives';
import {DialogsModule} from '../dialogs/dialogs.module';
import {PaginacionModule} from '../../components/common/paginacion/paginacion.module';
import {KeyValuesModule} from '../../components/map/keyvalues';
import {GitGraphModule} from '../../components/charts/gitgraph';

import {BandejaEntradaRoutes} from './bandeja-entrada.routes';

// views
import {BandejaRecibidosComponent} from './views/bandeja-recibidos.component';
import {BandejaPlazoComponent} from './views/bandeja-plazo.component';
import {RegistrarDocumentoComponent} from './views/registrar.component';
import {EditarDocumentoComponent} from './views/editar.component';
// modules/components
import {SeguimientoComponent} from './components/seguimiento.component';
import {EnviarDocumentoComponent} from './components/enviar-documento.component';
import {EnviarItemDirigidoComponent} from './components/enviar-item-dirigido.component';
import {ValidatorsModule} from '../../components/forms/validators';
import {BusquedaModule} from '../../components/common/busqueda/busqueda.module';

@NgModule({
  declarations: [
    BandejaRecibidosComponent,
    BandejaPlazoComponent,
    RegistrarDocumentoComponent,
    EditarDocumentoComponent,
    SeguimientoComponent,
    EnviarDocumentoComponent,
    EnviarItemDirigidoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonsModule.forRoot(),
    BsDropdownModule,
    PopoverModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule,
    NgSelectModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    DialogsModule,
    PaginacionModule,
    KeyValuesModule,
    GitGraphModule,
    AuthDirectivesModule,
    ValidatorsModule,
    BusquedaModule
  ],
  providers: [
    BsModalService,
    { // ngselect defaults
      provide: NG_SELECT_DEFAULT_CONFIG,
      useValue: {
        notFoundText: 'No se encontró el valor ingresado',
        clearAllText: 'Borrar seleccionados'
      }
    }
  ]
})
export class BandejaEntradaModule { }
