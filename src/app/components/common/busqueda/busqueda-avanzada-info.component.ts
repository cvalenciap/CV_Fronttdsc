import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import {FiltroDocumento} from '../../../models';

@Component({
  selector: 'advanced-search-info',
  template: `
    <div class="alert alert-info alert-small">
      <div class="search-info">
        <div class="row">
          <div class="col-sm-2">
            <i class="fa fa-search fa-2x"></i>
            <h4>{{BUSQUEDA_TITLE}}</h4>
            <span>
              <a (click)="resetClick()">{{BUSQUEDA_RESET}}</a>&nbsp;
              <a (click)="removeClick()">{{BUSQUEDA_REMOVE}}</a>
            </span>
          </div>
          <div class="col-sm-10">
              <dl>
                <ng-container *ngFor="let item of filtroItems">
                  <dt>{{item.label}}</dt>
                  <dd>{{item.value}}</dd>
                </ng-container>
              </dl>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BusquedaAvanzadaInfoComponent implements OnInit, OnChanges {

  public BUSQUEDA_TITLE  = `Búsqueda Avanzada`;
  public BUSQUEDA_RESET  = `Cambiar`;
  public BUSQUEDA_REMOVE = `Limpiar`;

  public filtroItems: {label: string, value: string}[];

  public _filtro: FiltroDocumento;
  get filtro() {
    return this._filtro;
  }
  @Input('filtro')
  set filtro(filtro: FiltroDocumento) {
    this._filtro = filtro;
  }
  @Output() reset = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  ngOnInit() {
    this.render();
  }

  ngOnChanges() {
    this.render();
  }

  resetClick() {
    this.reset.emit();
  }

  removeClick() {
    this.remove.emit();
  }

  private render() {
    console.log('render', this._filtro);
    this.filtroItems = this._filtro.labelValues;
  }

  constructor() {}
}
