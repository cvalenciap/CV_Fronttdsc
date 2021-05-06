import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BusquedaInfoComponent} from './busqueda-info.component';
import {BusquedaAvanzadaInfoComponent} from './busqueda-avanzada-info.component';

@NgModule({
  declarations: [
    BusquedaInfoComponent,
    BusquedaAvanzadaInfoComponent
  ],
  exports     : [
    BusquedaInfoComponent,
    BusquedaAvanzadaInfoComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class BusquedaModule {}
