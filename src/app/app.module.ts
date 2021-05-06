import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {RouterModule} from "@angular/router";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgxSummernoteModule } from 'ngx-summernote';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import {ROUTES} from "./app.routes";
import { AppComponent } from './app.component';
import {AuthService} from './auth/auth.service';
import {SessionService} from './auth/session.service';
import {AuthGuard} from './auth/auth.guard';
import {JwtInterceptor} from './auth/jwt.interceptor';
import {SystemService} from './services/system.service';
import {ErrorInterceptor} from './auth/error.interceptor';

// App views
//import {DashboardsModule} from "./views/dashboards/dashboards.module";
import {AppviewsModule} from "./views/appviews/appviews.module";

// App modules/components
import {SpinKitModule} from "./components/common/spinkit/spinkit.module";
import {LayoutsModule} from "./components/common/layouts/layouts.module";
import {PaginacionModule} from "./components/common/paginacion/paginacion.module";
import {SampleModule} from "./modules/sample/sample.module";
import {DialogsModule} from './modules/dialogs/dialogs.module';
import {EmpresasModule} from './modules/empresas/empresas.module';
import {TiposDocumentoModule} from './modules/tipos-documento/tipos-documento.module';
import {AsuntosModule} from './modules/asuntos/asuntos.module';
import {FeriadosModule} from './modules/feriados/feriados.module';
import {GruposModule} from './modules/grupos/grupos.module';
import {JefeEquipoModule} from './modules/jefe-equipo/jefe-equipo.module';
import {SecuencialesModule} from './modules/secuenciales/secuenciales.module';
import {MesaPartesModule} from './modules/mesa-partes/mesa-partes.module';
import {BandejaEntradaModule} from './modules/bandeja-entrada/bandeja-entrada.module';
import {BandejaSalidaModule} from './modules/bandeja-salida/bandeja-salida.module';
import {ReportesGeneralesModule} from './modules/reportes-generales/reportes-generales.module';

@NgModule({
  declarations: [    
    AppComponent,
    JwtInterceptor
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required for Toastr
    // 3rd party modules
   
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({closeButton: true}),
    SweetAlert2Module.forRoot(),
    SpinKitModule,
    NgxSummernoteModule,
    PdfJsViewerModule,
    // Routes
    RouterModule.forRoot(ROUTES),
    /* RouterModule.forRoot(ROUTES,{onSameUrlNavigation: "reload"}), */
    // App modules
    AppviewsModule,
   // DashboardsModule,
    LayoutsModule,
    PaginacionModule,
    SampleModule,
    DialogsModule,
    EmpresasModule,
    AsuntosModule,
    TiposDocumentoModule,
    FeriadosModule,
    GruposModule,
    JefeEquipoModule,
    SecuencialesModule,
    MesaPartesModule,
    BandejaEntradaModule,
    BandejaSalidaModule,
    ReportesGeneralesModule
  ],
  /* exports: [RouterModule], */
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, Title, AuthService, SessionService, SystemService, {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}, { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
