import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {IcheckModule} from './../../components/forms/iCheck';
import {SpinKitModule} from './../../components/common/spinkit/spinkit.module';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';
import {ValidatorsModule} from './../../components/forms/validators';
import {NgSelectModule, NG_SELECT_DEFAULT_CONFIG} from '@ng-select/ng-select';

// views
import {BuscarDocumentoComponent} from './buscar-documento/buscar-documento.component';
import {BuscarDocumentoSalidaComponent} from './buscar-documento-salida/buscar-documento-salida.component';
import {SeleccionarAsuntoComponent} from './seleccionar-asunto/seleccionar-asunto.component';
import {VisorPdfComponent} from './visor-pdf/visor-pdf.component';
// modules/components


@NgModule({
  declarations: [
    SeleccionarAsuntoComponent,
    VisorPdfComponent,
    BuscarDocumentoComponent,
    BuscarDocumentoSalidaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
    BsDatepickerModule,
    IcheckModule,
    ToastrModule,
    SweetAlert2Module,
    PdfJsViewerModule,
    SpinKitModule,
    PaginacionModule,
    ValidatorsModule,
    NgSelectModule
  ],
  exports: [
    SeleccionarAsuntoComponent,
    VisorPdfComponent,
    BuscarDocumentoComponent,
    BuscarDocumentoSalidaComponent
  ]
})
export class DialogsModule { }
