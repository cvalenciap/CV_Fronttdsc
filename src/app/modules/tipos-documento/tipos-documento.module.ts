/**
 * @package       TiposDocumentoModule
 * @class         TiposDocumentoModule
 * @description   modulo tipo documento
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {IcheckModule} from './../../components/forms/iCheck';
import {SpinKitModule} from './../../components/common/spinkit/spinkit.module';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';
import {TiposDocumentoRoutes} from './tipos-documento.routes';

// views
import {TiposDocumentoListaComponent} from './views/lista.component';
import {TiposDocumentoEditarComponent} from './views/editar.component';
import {ValidatorsModule} from '../../components/forms/validators';

// modules/components


@NgModule({
  declarations: [
    TiposDocumentoListaComponent,
    TiposDocumentoEditarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BsDropdownModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule,
    IcheckModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    PaginacionModule,
    ValidatorsModule
  ]
})
export class TiposDocumentoModule { }
