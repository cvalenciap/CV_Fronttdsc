import { Component, OnInit, Inject,ViewChild,ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import {Response, Paginacion, Grupo, OpcionBusqueda} from '../../../models';
import {NivelError} from '../../../models/enums';
import { ToastrService } from 'ngx-toastr';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {GruposService} from '../../../services';
import {GruposEditarComponent} from '../views/editar.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'grupos-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [GruposService]
})
export class GruposListaComponent implements OnInit {

  /* datos */
  items : Grupo[];
  /* filtros */
  textoBusqueda: string;
  parametroBusqueda: string;
  /* paginación */
  /* registro seleccionado */
  selectedRow: number;
  selectedObject: Grupo;
  /* indicador de carga */
  loading: boolean;
  
  public paginacion: Paginacion = new Paginacion;

  @ViewChild('buscar') buscar: ElementRef;
  
  public configuracionesBusqueda: OpcionBusqueda[];
  public opcionesBusqueda: OpcionBusqueda;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private service: GruposService) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.parametroBusqueda = 'codigo';
    //this.paginacion = new Paginacion({registros: 10});
  }

  ngOnInit() {
    if (localStorage.getItem('origenPag') == 'grupos') {
      this.paginacion.pagina = +(localStorage.getItem('pagina'));
      this.paginacion.registros = +(localStorage.getItem('registros'));
      this.OnPageChanged({page: +(localStorage.getItem('pagina')), rows: +(localStorage.getItem('registros'))});
    } else {
      localStorage.setItem('origenPag', 'grupos');
      localStorage.setItem('pagina', '1');
      localStorage.setItem('registros', this.paginacion.registros.toString());
    }
    this.configuracionesBusqueda = [
      {parametro: 'codigo', longitud: 5, descripcion: 'Código', validar: 'digit'},
      {parametro: 'descripcion', longitud: 100, descripcion: 'Descripción', validar: 'word'}
    ];
    this.opcionesBusqueda = this.configuracionesBusqueda[0];
    this.OnConfigurarBusqueda(this.configuracionesBusqueda[0]);
    this.getLista();
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

  getLista(): void {
    this.loading = true;
    const parametros: {codigo?: string, descripcion?: string} = {codigo: null, descripcion: null};
    switch (this.parametroBusqueda) {
      case 'codigo':
        parametros.codigo = this.textoBusqueda;
        break;
      case 'descripcion':
        parametros.descripcion = this.textoBusqueda;
        break;
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
    localStorage.setItem('pagina', event.page);
    this.paginacion.pagina = event.page;

    this.getLista();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getLista();
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnBuscar(): void {
    if (this.parametroBusqueda == 'codigo' && this.textoBusqueda && !(this.textoBusqueda.match(/^[0-9][0-9 ]*$/)!=null) ){
      this.toastr.warning('Ingrese código numérico', 'Acción Inválida', {closeButton: true});
      return;
    }

    this.paginacion.pagina = 1;
    this.getLista();
  }

  OnModificar(): void {
    localStorage.setItem('pagina', this.paginacion.pagina.toString());
    localStorage.setItem('registros', this.paginacion.registros.toString());
    this.router.navigate([`despacho/grupos/editar/${this.selectedObject.codigo}`]);
  }

  OnEliminar(): void {
     this.service.eliminar(this.selectedObject).subscribe(
        (response: Response) => {
           this.toastr.success('Registro eliminado', 'Acción completada!', {closeButton: true});
           this.getLista();
           this.loading = false;
        },
        (error) => this.controlarError(error)
     );
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.loading = false;
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }
}
