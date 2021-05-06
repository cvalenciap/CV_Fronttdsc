import {IsFormattedDate} from './class-validators';

import {NgModule} from '@angular/core';
import { ValidateKeyPressDirective } from './keypress-validator';

@NgModule({
  declarations: [
    ValidateKeyPressDirective
  ],
  exports: [
    ValidateKeyPressDirective
  ],
  imports: []
})
class ValidatorsModule { }

export {
  IsFormattedDate,
  ValidatorsModule
};
