/**
 * @package       AsuntosModule
 * @class         AsuntosListaComponent
 * @description   lista asuntos
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {Response, Paginacion, Asunto, OpcionBusqueda} from '../../../models';
import { ToastrService } from 'ngx-toastr';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {AsuntosService as AsuntosService} from '../../../services';

@Component({
  selector: 'asuntos-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [AsuntosService]
})
export class AsuntosListaComponent implements OnInit {

  items: Asunto[];
  item: Asunto;

  textoBusqueda: string;
  parametroBusqueda: string;
  paginacion: Paginacion;
  selectedRow: number;
  selectedObject: Asunto;
  loading: boolean;
  @ViewChild('buscar') buscar: ElementRef;
  public opcionesBusqueda: OpcionBusqueda;
  public configuracionesBusqueda: OpcionBusqueda[];

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService, private router: Router, private service: AsuntosService) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.parametroBusqueda = 'codigo';
    this.paginacion = new Paginacion({registros: 10});
  }

  ngOnInit() {
    this.configuracionesBusqueda = [
      {parametro: 'codigo', longitud: 5, descripcion: 'Código', validar: 'digit'},
      {parametro: 'descripcion', longitud: 100, descripcion: 'Descripción', validar: 'word'}
    ];
    this.opcionesBusqueda = this.configuracionesBusqueda[0];
    this.OnConfigurarBusqueda(this.configuracionesBusqueda[0]);
    this.getAsuntos();
  }

  OnConfigurarBusqueda(opciones: OpcionBusqueda) {
    this.opcionesBusqueda = opciones;
    this.parametroBusqueda = opciones.parametro;
    this.textoBusqueda = '';
    this.buscar.nativeElement.focus();
  }

  /*OnConfigurarBusqueda() {
    switch(this.parametroBusqueda) {
      case "codigo": {
        this.buscar.nativeElement.maxLength=5;
        this.buscar.nativeElement.placeholder="Código";
        this.buscar.nativeElement.onkeypress = (e) => e.charCode >= 48 && e.charCode <= 57;
        break;
      }
      case "descripcion": {
        this.buscar.nativeElement.maxLength=100;
        this.buscar.nativeElement.placeholder="Descripción";
        this.buscar.nativeElement.onkeypress = (e) => ( e.charCode == 32 ) || ( e.charCode >= 65 && e.charCode <= 90 ) || ( e.charCode >= 97 && e.charCode <= 122 );
        break;
      }
    }
    this.textoBusqueda=null
  }*/

  getAsuntos(): void {
    this.loading = true;
    let parametros: {codigo?: string, descripcion?: string} = {codigo: null, descripcion: null};

    switch (this.parametroBusqueda) {
      case 'codigo':
        parametros.codigo = this.textoBusqueda;
        break;
      case 'descripcion':
      default:
        parametros.descripcion = this.textoBusqueda;
    }
    this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
      (error) => this.controlarError(error)
    );
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getAsuntos();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getAsuntos();
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  selectRow(index): void {
    this.selectedRow = index;
  }

  OnBuscar(): void {
    if (this.parametroBusqueda == 'codigo' && this.textoBusqueda && !(this.textoBusqueda.match(/^[0-9][0-9 ]*$/)!=null) ){
      this.toastr.warning('Ingrese código numérico', 'Acción Inválida', {closeButton: true});
      return;
    }

    this.paginacion.pagina = 1;
    this.getAsuntos();
}

  OnEliminar():void {
    this.service.eliminar(this.selectedObject.codigo).subscribe(
      (response: Response) => {
        this.toastr.success('Registro eliminado', 'Acción completada!');
        this.router.navigate([`mantenimiento/asuntos`]);
        this.getAsuntos();
        this.loading = false;
      },
      (response: Response) => this.controlarError(response)
    );
  }

  OnModificar(): void {
    this.router.navigate([`mantenimiento/asuntos/editar/${this.selectedObject.codigo}`]);
  }

  controlarError(response) {
    if (response instanceof Response) {
      this.loading = false;
    }
  }


}

