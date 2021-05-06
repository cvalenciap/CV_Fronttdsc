import {Routes} from '@angular/router';
import {AuthGuard} from './auth/auth.guard';

import {StarterViewComponent} from './views/appviews/starterview.component';
import {LoginComponent} from './views/appviews/login.component';
import {ResetComponent} from "./views/appviews/reset.component";

import {BlankLayoutComponent} from './components/common/layouts/blankLayout.component';
import {BasicLayoutComponent} from './components/common/layouts/basicLayout.component';


import {EmpresasRoutes} from './modules/empresas/empresas.routes';
import {AsuntosRoutes} from './modules/asuntos/asuntos.routes';
import {MesaPartesRoutes} from './modules/mesa-partes/mesa-partes.routes';
import {TiposDocumentoRoutes} from './modules/tipos-documento/tipos-documento.routes';
import {FeriadosRoutes} from './modules/feriados/feriados.routes';
import {GruposRoutes} from './modules/grupos/grupos.routes';
import {JefeEquipoRoutes} from './modules/jefe-equipo/jefe-equipo.routes';
import {SecuencialesRoutes} from './modules/secuenciales/secuenciales.routes';
import {BandejaEntradaRoutes} from './modules/bandeja-entrada/bandeja-entrada.routes';
import {BandejaSalidaRoutes} from './modules/bandeja-salida/bandeja-salida.routes';
import {ReportesGeneralesRoutes} from './modules/reportes-generales/reportes-generales.routes';

export const ROUTES: Routes = [
  // Main redirect
  {path: '', redirectTo: 'inicio', pathMatch: 'full'},

  // App views
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: 'inicio', component: StarterViewComponent}
    ]
  },
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'login/reset', component: ResetComponent }
    ]
  },
  {
    path: 'mantenimiento', component: BasicLayoutComponent,
    children: [
      {
        path: 'empresas', component: BlankLayoutComponent,
        children: EmpresasRoutes
      },
      {
        path: 'tipos-documento', component: BlankLayoutComponent,
        children: TiposDocumentoRoutes
      },
      {
        path: 'feriados', component: BlankLayoutComponent,
        children: FeriadosRoutes
      },
      {
        path: 'asuntos', component: BlankLayoutComponent,
        children: AsuntosRoutes
      }
    ],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'despacho', component: BasicLayoutComponent,
    children: [
      {
        path: 'grupos', component: BlankLayoutComponent,
        children: GruposRoutes
      },
      {
        path: 'jefe-equipo', component: BlankLayoutComponent,
        children: JefeEquipoRoutes
      },
      {
        path: 'secuenciales', component: BlankLayoutComponent,
        children: SecuencialesRoutes
      }
    ],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'mesa-partes', component: BasicLayoutComponent,
    children: MesaPartesRoutes,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
    /* runGuardsAndResolvers: 'always', */
  },
  {
    path: 'bandeja-entrada', component: BasicLayoutComponent,
    children: BandejaEntradaRoutes,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'bandeja-salida', component: BasicLayoutComponent,
    children: BandejaSalidaRoutes,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'reportes-generales', component: BasicLayoutComponent,
    children: ReportesGeneralesRoutes,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  // Handle all other routes
  {path: '**',  redirectTo: 'inicio'}
];
