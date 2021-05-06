import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {IcheckModule} from './../../components/forms/iCheck';
import {SpinKitModule} from './../../components/common/spinkit/spinkit.module';
import {NgSelectModule, NG_SELECT_DEFAULT_CONFIG} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {FormsModule} from '@angular/forms';
import {ValidatorsModule} from '../../components/forms/validators';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';

import {EmpresasRoutes} from './empresas.routes';

// views
import {EmpresasListaComponent} from './views/empresa-lista.component';
import {EmpresasEditarComponent} from './views/empresa-editar.component';
import {RepresentantesListaComponent} from './components/representante-lista.component';
import {RepresentantesEditarComponent} from './components/representante-editar.component';

// modules/components
import {TooltipModule} from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    EmpresasListaComponent,
    EmpresasEditarComponent,
    RepresentantesListaComponent,
    RepresentantesEditarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
    BsDatepickerModule,
    IcheckModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    NgSelectModule,
    PaginacionModule,
    ValidatorsModule,
    TooltipModule.forRoot()
  ]
})
export class EmpresasModule { }
