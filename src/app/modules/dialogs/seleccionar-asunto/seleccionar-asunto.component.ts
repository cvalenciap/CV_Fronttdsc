import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Asunto, Response, Paginacion} from '../../../models';
import {ParametrosService} from '../../../services';

@Component({
  selector: 'seleccionar-asunto',
  templateUrl: 'seleccionar-asunto.template.html'
})
export class SeleccionarAsuntoComponent implements OnInit {

  /* data */
  items: Asunto[];
  /* registro seleccionado */
  selectedRow: number;
  selectedItem: Asunto;
  /* filtros */
  filtroDescripcion: string;
  /* paginación */
  paginacion: Paginacion;
  /* indicador de carga */
  loading: boolean;
  /* evento */
  @Output() select: EventEmitter<Asunto> = new EventEmitter();

  constructor(public service: ParametrosService) {}

  ngOnInit() {
    this.loading = false;
    this.paginacion = new Paginacion({registros: 10});
    this.selectedItem = null;
    this.getLista();
  }

  getLista(): void {
    this.loading = true;
    this.service.buscarAsuntos({descripcion: this.filtroDescripcion}, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = response.paginacion;
        this.loading = false;
      }
    );
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getLista();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getLista();
  }

  OnItemSelected(index, obj): void {
    this.selectedRow = index;
    this.selectedItem = obj;
    this.select.emit(this.selectedItem);
  }

  OnBuscar(): void {
    this.getLista();
  }
}
