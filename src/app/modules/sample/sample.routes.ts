import {Routes} from '@angular/router';

import {SampleComponent} from './views/sample.component';

import {BlankLayoutComponent} from './../../components/common/layouts/blankLayout.component';
import {BasicLayoutComponent} from './../../components/common/layouts/basicLayout.component';

export const ROUTES:Routes = [

  // Module views
  {
    path: 'sample', component: BasicLayoutComponent,
    children: [
      {path: 'sample-path', component: SampleComponent }
    ]
  }
];
