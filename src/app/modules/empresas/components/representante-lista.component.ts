import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Representante } from '../../../models/representante';

@Component({
  selector: 'representantes-lista',
  templateUrl: 'representante-lista.template.html',
  styleUrls: ['representante-lista.component.scss']
})
export class RepresentantesListaComponent {


  @Input('items')
  items: Representante[];
  //selectedRow: number;
  loading: boolean;
  selectedObject: Representante;
  @Output() itemSend = new EventEmitter<any>();
  @Output() itemIndex = new EventEmitter<any>();
  
  @Input('selectedRow')
  selectedRow: number;

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
    this.selectedObject.indexRow = index; 
    this.itemSend.emit(this.selectedObject);
    this.itemIndex.emit(index);
  }
  constructor() {
    this.loading = false;
  }
}
