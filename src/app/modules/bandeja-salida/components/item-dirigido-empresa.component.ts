import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {Empresa, Representante} from '../../../models'

@Component({
  selector: 'item-dirigido-empresa',
  template: `
    <div class="row m-b-sm">
      <label class="col-sm-1 control-label">Empresa :</label>
      <div class="col-sm-5"><input type="text" class="form-control" value=" " disabled="disabled" name="area" [ngModel]="itemEmpresa.descripcion"></div>
      <div class="col-sm-5"><input type="text" class="form-control" value=" " disabled="disabled" name="trabajador" [ngModel]="representante.nombre"></div>
      <div class="col-sm-1"><button class="btn btn-warning" (click)="OnEliminar()" [disabled]="loading"><i class="fa fa-minus"></i></button></div>
    </div>
    
  `
})

export class ItemDirigidoEmpresaComponent implements OnInit{
  @Input('itemEmpresa')
  itemEmpresa: Empresa;
  @Input('indexEmpresa')
  indexEmpresa: number;
  @Input('loading')
  loading: boolean;
  @Output() itemSendRepresentante = new EventEmitter<any>();
  
  representante: Representante = new Representante();
  ngOnInit(){
    if(this.itemEmpresa.representantes)
      this.representante = this.itemEmpresa.representantes[0];
  }
  OnEliminar(){
    this.representante = new Representante();
    this.itemSendRepresentante.emit(this.indexEmpresa);
  }
}
