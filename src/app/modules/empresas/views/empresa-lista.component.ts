import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
//import { MOCK_EMPRESAS } from '../../../mocks/mock-empresas';
import { Response, Paginacion, Empresa, OpcionBusqueda } from '../../../models';
import { NivelError } from '../../../models/enums';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {EmpresasService} from '../../../services';

@Component({
  selector: 'empresas-lista',
  templateUrl: 'empresa-lista.template.html',
  styleUrls: ['empresa-lista.component.scss'],
  providers: [EmpresasService]
})
export class EmpresasListaComponent implements OnInit {

  /*datos*/
  items: Empresa[];
  /*Filtros*/
  parametroBusqueda: string;
  textoBusqueda: string;
  configuracionesBusqueda: OpcionBusqueda[];
  opcionesBusqueda: OpcionBusqueda;
  /*paginacion*/
  paginacion: Paginacion;
  /*registro seleccionado*/
  selectedRow: number;
  selectedObject: Empresa;
  /*indicador de carga*/
  loading: boolean;
  /*indicadore de respuesta*/
  textoRespuesta: string;
  @ViewChild('buscar') buscar : ElementRef;
  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService, private router: Router, private empresaService: EmpresasService ) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.parametroBusqueda = '';
    this.paginacion = new Paginacion({registros: 10});
  }

  ngOnInit() {
    this.configuracionesBusqueda = [
      {parametro: 'codigo', longitud: 8, descripcion: 'Código', validar: 'digit'},
      {parametro: 'descripcion', longitud: 1000, descripcion: 'Descripción', validar: 'word'}
    ];
    this.opcionesBusqueda = this.configuracionesBusqueda[0];
    this.OnConfigurarBusqueda(this.configuracionesBusqueda[0]);
    this.getEmpresas();
  }

  OnConfigurarBusqueda(opciones: OpcionBusqueda) {
    this.opcionesBusqueda = opciones;
    this.parametroBusqueda = opciones.parametro;
    this.textoBusqueda = '';
    this.buscar.nativeElement.focus();
  }

  getEmpresas(): void {
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
    this.empresaService.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
      (response: Response) => this.controlarError(response)
    );
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getEmpresas();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getEmpresas();
  }
  selectRow(index): void {
    this.selectedRow = index;
  }
  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnBuscar(): void {
    this.paginacion.pagina = 1;
    this.getEmpresas();
  }

  OnModificar(): void {
    this.router.navigate([`mantenimiento/empresas/editar/${this.selectedObject.codigo}`]);
  }
  search(): void {
    this.loading = true;
  }
  showError() {
    this.toastr.info('Registro eliminado', 'Acción completada!', {closeButton: true});
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.loading = false;
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }

  OnEliminar():void{
    this.loading = true;
    this.empresaService.eliminar(this.selectedObject).subscribe(
      (response: Response) => {
        this.textoRespuesta = response.estado;
        if(this.textoRespuesta == "OK"){
          this.toastr.info('El registro se eliminó correctamente', 'Acción completada!');
        }else{
          this.toastr.error('Se presentó un error inesperado en la última acción Error: ' + this.textoRespuesta, 'Error')
        }
        this.getEmpresas();
        this.loading = false;
      },
      (response: Response) => this.controlarError(response)
    );
  }
}
