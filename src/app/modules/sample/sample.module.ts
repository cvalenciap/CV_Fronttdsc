import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {ROUTES} from './sample.routes';

// views
import {SampleComponent} from './views/sample.component';

// modules/components


@NgModule({
  declarations: [
    SampleComponent
  ],
  imports: [
    RouterModule.forRoot(ROUTES)
  ]
})
export class SampleModule { }
