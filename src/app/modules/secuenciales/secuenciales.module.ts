/**
 * @package       SecuencialesModule
 * @class         SecuencialesModule
 * @description   modulo secuenciales
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SpinKitModule} from './../../components/common/spinkit/spinkit.module';
//import {NgSelectModule} from '@ng-select/ng-select';
import {NgSelectModule, NG_SELECT_DEFAULT_CONFIG} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';

import {SecuencialesRoutes} from './secuenciales.routes';

// views
import {SecuencialesListaComponent} from './views/lista.component';
import {SecuencialesEditarComponent} from './views/editar.component';
import {ValidatorsModule} from '../../components/forms/validators';

// modules/components


@NgModule({
  declarations: [
    SecuencialesListaComponent,
    SecuencialesEditarComponent
  ],
  providers:[
    //BsModalService,
    { // ngselect defaults
      provide: NG_SELECT_DEFAULT_CONFIG,
      useValue: {
        notFoundText: 'No se encontró el valor ingresado',
        clearAllText: 'Borrar seleccionados'
      }
    }
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BsDropdownModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule,
    NgSelectModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    PaginacionModule,
    ValidatorsModule
  ]
})
export class SecuencialesModule { }
