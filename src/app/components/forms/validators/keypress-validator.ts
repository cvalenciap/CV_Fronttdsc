import {NgModule, ElementRef, Directive, HostListener, Input} from '@angular/core';
import {NgModel} from '@angular/forms';

@Directive({
  selector: 'input[ngModel][validate-keys]',
  providers: [NgModel]
  /*host: {'(ngModelChange)' : 'onInputChange($event)'}*/
})
export class ValidateKeyPressDirective {
  private start: number;
  private end: number;
  constructor(private model: NgModel, private el: ElementRef){}

  private _pattern: string = '';
  @Input('validate-keys')
  set validateKeys(pattern: string) {
    this._pattern = pattern;
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event) {
    const charInput = event.keyCode;
    switch (this._pattern) {
      case '':
        return;
      case 'digit':
        if (event.charCode >= 48 && event.charCode <= 57) { return; }
        break;
      case 'date':
        if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode === 47) { return; }
        break;
      case 'alpha':
        if (event.key.match(/^[A-Za-zñÑáéíóúÁÉÍÓÚ]$/)) { return; }
        break;
      case 'alphanumeric':
        if (event.key.match(/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9]$/)) { return; }
        break;
      case 'word':
        if (event.key.match(/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9]|\s$/)) { return; }
        break;
      default:
        const reg = new RegExp(this._pattern, 'g');
        if (event.key.match(reg)) { return; }
    }
    event.preventDefault();
  }
}
