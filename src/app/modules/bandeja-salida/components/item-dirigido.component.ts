import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {Trabajador, Area} from '../../../models'

@Component({
  selector: 'item-dirigido',
  template: `
    <div class="row m-b-sm">
      <div class="col-sm-1"></div>
      <div class="col-sm-5"><input type="text" class="form-control" value=" " disabled="disabled" name="area" [ngModel]="item.area.descripcion"></div>
      <div class="col-sm-5"><input type="text" class="form-control" value=" " disabled="disabled" name="trabajador" [ngModel]="item.nombreCompleto"></div>
      <div class="col-sm-1"><button class="btn btn-warning" (click)="OnEliminar()" [disabled]="loading"><i class="fa fa-minus"></i></button></div>
    </div>
    
  `
})

export class ItemDirigidoComponent implements OnInit{
  @Input('item')
  item: Trabajador;
  @Input('index')
  index: number;
  @Input('loading')
  loading: boolean;
  @Output() itemSend = new EventEmitter<any>();
  ngOnInit(){

  }
  OnEliminar(){
    this.itemSend.emit(this.index);
  }
}
