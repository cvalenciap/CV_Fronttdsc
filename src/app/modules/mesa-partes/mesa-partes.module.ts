import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ModalModule, BsModalService} from 'ngx-bootstrap/modal';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {NgSelectModule, NG_SELECT_DEFAULT_CONFIG} from '@ng-select/ng-select';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';
import {ToastrModule} from 'ngx-toastr';
import {DialogsModule} from '../dialogs/dialogs.module';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';
import {BusquedaModule} from './../../components/common/busqueda/busqueda.module';
import {GitGraphModule} from './../../components/charts/gitgraph';
import {ValidatorsModule} from '../../components/forms/validators';
import {AuthDirectivesModule} from './../../auth/auth.directives';
import {MesaPartesRoutes} from './mesa-partes.routes';

// views
import {BandejaMesaPartesComponent} from './views/bandeja.component';
import {RegistrarDocumentoComponent} from './views/registrar.component';
import {EditarDocumentoComponent} from './views/editar.component';

// modules/components


@NgModule({
  declarations: [
    BandejaMesaPartesComponent,
    EditarDocumentoComponent,
    RegistrarDocumentoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonsModule.forRoot(),
    BsDropdownModule,
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
    DialogsModule,
    BusquedaModule,
    PaginacionModule,
    GitGraphModule,
    AuthDirectivesModule,
    ValidatorsModule
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
export class MesaPartesModule { }
