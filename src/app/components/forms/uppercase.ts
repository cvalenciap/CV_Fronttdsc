import {NgModule, ElementRef, Directive, HostListener} from '@angular/core';
import {NgModel} from '@angular/forms';

@Directive({
  selector: '[ngModel][uppercase]',
  providers: [NgModel],
  /*host: {'(ngModelChange)' : 'onInputChange($event)'}*/
})
export class UppercaseDirective{
  private start: number;
  private end: number;
  constructor(private model: NgModel, private el: ElementRef){}

  @HostListener('keypress', ['$event'])
  onKeyPress(event){
    /*this.start = this.el.nativeElement.selectionStart + 1;
    this.end = this.el.nativeElement.selectionEnd + 1;
    console.log(event);*/
    const charInput = event.keyCode;
    if ((charInput >= 97) && (charInput <= 122)) { // lowercase
      if (!event.ctrlKey && !event.metaKey && !event.altKey) { // no modifier key
        const newChar = charInput - 32;
        this.start = event.target.selectionStart;
        this.end = event.target.selectionEnd;
        //event.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
        //e.target.setSelectionRange(start+1, start+1);
        //e.preventDefault();
      }
    }
  }

  @HostListener('ngModelChange', ['$event'])
  onInputChange(event){
    const newValue = event.toUpperCase();
    this.model.valueAccessor.writeValue(newValue);
    /*const start = this.el.nativeElement.selectionStart;
    const end = this.el.nativeElement.selectionEnd;
    console.log(start, end);
    this.el.nativeElement.setSelectionRange(start, end);*/
    this.el.nativeElement.setSelectionRange(this.start+1, this.end+1);
  }
}

@NgModule({
  declarations: [
    UppercaseDirective
  ],
  exports: [
    UppercaseDirective
  ],
  imports: []
})
export class UppercaseModule { }
