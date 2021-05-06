
import { NgModule, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[allowIf]'
})
export class AllowIfDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

    private _assigned: string[];
    @Input() set allowIf(value: string[]) {
      this._assigned = value;
      if (!this._assigned) { return; }
      if (this._assigned.includes(this._check)) {
        // Si se cumple la condición añadimos el elemento al DOM
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        // En caso contrario, eliminamos el contenido del DOM
        this.viewContainer.clear();
      }
    }

    private _check: string;
    @Input() set allowIfHas(value: string) {
      this._check = value;
    }
}

@NgModule({
  declarations: [
    AllowIfDirective
  ],
  exports: [
    AllowIfDirective
  ],
  imports: []
})
export class AuthDirectivesModule {}
