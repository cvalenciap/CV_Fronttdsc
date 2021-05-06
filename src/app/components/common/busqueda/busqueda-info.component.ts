import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'search-info',
  template: `
      <div *ngIf="!dissmised && message != ''" class="alert alert-small alert-info alert-dismissable">
          <button aria-hidden="true" (click)="dissmised=true" data-dismiss="alert" class="close" type="button">×</button>
          <small [innerHtml]="message"></small>
      </div>
  `
})
export class BusquedaInfoComponent {

  BUSQUEDA_INICIAL  = `Se están mostrando todos los documentos ingresados en los últimos 30 días.`;
  BUSQUEDA_RAPIDA   = `Esta consulta se realiza sobre los documentos ingresados en los últimos <strong>30 días</strong>.`;
  BUSQUEDA_AVANZADA = `Esta consulta se realiza sobre <strong>todos</strong> los documentos recibidos.`;

  dissmised: boolean = false;
  message: String = '';
  @Input("texto-inicio") textoInicial;
  @Input("texto-busqueda") textoBusqueda;
  @Input("texto-busqueda-avanzada") textoBusquedaAvanzada;

  public _mostrarTexto: 'inicio'|'busqueda'|'busqueda-avanzada';
  @Input('mostrar')
  set mostrar(mostrar: 'inicio'|'busqueda'|'busqueda-avanzada') {
    if (!mostrar) { return; }
    this._mostrarTexto = mostrar;
    switch (this._mostrarTexto) {
      case 'inicio':
        this.message = this.textoInicial || this.BUSQUEDA_INICIAL;
        break;
      case 'busqueda':
        this.message = this.textoBusqueda || this.BUSQUEDA_RAPIDA;
        break;
      case 'busqueda-avanzada':
        this.message = this.textoBusquedaAvanzada || this.BUSQUEDA_AVANZADA;
        break;
      default:
        throw new Error('BusquedaInfoComponent: Opción inválida');
    }
  }

  constructor(private el: ElementRef) {}
}
