/**
 * @package       TiposDocumentoModule
 * @class         TiposDocumentoListaComponent
 * @description   lista tipo documentos
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import { Component, OnInit, ElementRef,ViewChild } from '@angular/core';
import {Response, Paginacion, TipoDocumento, OpcionBusqueda} from '../../../models';
import {NivelError} from '../../../models/enums';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {TiposDocumentoService } from '../../../services';
@Component({
  selector: 'tipos-documento-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [TiposDocumentoService]
})
export class TiposDocumentoListaComponent implements OnInit {

  /*datos*/
  items: TipoDocumento[];
  /*Filtros*/
  parametroBusqueda: string;
  textoBusqueda: string;
  /*paginacion*/
  paginacion: Paginacion;
  /*registro seleccionado*/
  selectedRow: number;
  selectedObject: TipoDocumento;
  /*indicador de carga*/
  loading: boolean;
  @ViewChild('buscar') buscar: ElementRef;
  public opcionesBusqueda: OpcionBusqueda;
  public configuracionesBusqueda: OpcionBusqueda[];

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService, private router: Router, private tiposDocumentoService: TiposDocumentoService) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.parametroBusqueda = 'codigo';
    this.paginacion = new Paginacion({registros: 10});
  }
  ngOnInit() {
    this.configuracionesBusqueda = [
      {parametro: 'codigo', longitud: 8, descripcion: 'Código', validar: 'alphanumeric'},
      {parametro: 'descripcion', longitud: 100, descripcion: 'Descripción', validar: 'word'}
    ];
    this.opcionesBusqueda = this.configuracionesBusqueda[0];
    this.OnConfigurarBusqueda(this.configuracionesBusqueda[0]);
    this.getTipos();
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
        this.buscar.nativeElement.maxLength=8;
        this.buscar.nativeElement.placeholder="Código";
        this.buscar.nativeElement.onkeypress = (e) => e.charCode >= 48 && e.charCode <= 57 ||  ( e.charCode >= 65 && e.charCode <= 90 ) || ( e.charCode >= 97 && e.charCode <= 122 );
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
  getTipos(): void {
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
    this.tiposDocumentoService.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
      (error) => this.controlarError(error)
    );
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getTipos();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getTipos();
  }

  selectRow(index): void {
    this.selectedRow = index;
  }
  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnBuscar(): void {
    if (this.parametroBusqueda == 'codigo' && this.textoBusqueda && !(this.textoBusqueda.match(/^[A-Za-z0-9][A-Za-z0-9 ]*$/)!=null) ){
      this.toastr.warning('Ingrese un dato válido', 'Acción Inválida', {closeButton: true});
      return;
    }
    this.paginacion.pagina = 1;
    this.getTipos();
  }

  OnModificar(): void {
    this.router.navigate([`mantenimiento/tipos-documento/editar/${this.selectedObject.codigo}`]);
  }
  OnEliminar():void{
    this.tiposDocumentoService.eliminar(this.selectedObject).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        //this.paginacion = new Paginacion(response.paginacion);
        this.toastr.success('Registro eliminado', 'Acción completada!', {closeButton: true});
        this.loading = false;
        this.ngOnInit();
      },
      (error) => this.controlarError(error)
      );
  }
  search(): void {
    this.loading = true;
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
