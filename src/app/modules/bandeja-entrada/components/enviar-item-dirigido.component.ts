import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {Trabajador, Area} from '../../../models';

@Component({
  selector: 'enviar-item-dirigido',
  template: `
    <div class="row m-b-sm">
      <div class="col-sm-offset-2 col-sm-4"><input type="text" class="form-control" value=" " disabled="disabled" name="area" [ngModel]="item.area.descripcion"></div>
      <div class="col-sm-offset-1 col-sm-4"><input type="text" class="form-control" value=" " disabled="disabled" name="trabajador" [ngModel]="item.trabajador.nombreCompleto"></div>
      <div class="col-sm-1"><a class="btn btn-danger" (click)="OnEliminar()"><i class="fa fa-minus"></i></a></div>
    </div>
  `
})

export class EnviarItemDirigidoComponent implements OnInit {
  @Input('item')
  item: {trabajador: Trabajador, area: Area};
  @Input('index')
  index: number;
  @Output() eliminar = new EventEmitter<any>();

  ngOnInit() {
  }

  OnEliminar() {
    console.log(this.index);
    this.eliminar.emit(this.index);
  }
}
