import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FirmaDigitalComponent} from './firma-digital.component';

@NgModule({
  declarations: [
    FirmaDigitalComponent
  ],
  exports: [
    FirmaDigitalComponent
  ],
  imports: [
    CommonModule
  ]
})

export class FirmaDigitalModule {}
