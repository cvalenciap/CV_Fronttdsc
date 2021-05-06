/**
 * @package       FeriadosModule
 * @class         FeriadosListaComponent
 * @description   lista feriados
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import { Component, OnInit, Inject,ViewChild ,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { Feriado } from '../../../models/feriado';
import { ToastrService } from 'ngx-toastr';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import { FeriadosService} from '../../../services';
import * as moment from 'moment';
import {OpcionBusqueda} from '../../../models';

@Component({
  selector: 'feriados-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [FeriadosService]
})
export class FeriadosListaComponent implements OnInit {

  /* datos */
  items: Feriado[];
  /* filtros */
  textoBusqueda: string;
  parametroBusqueda: string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  selectedObject: Feriado;
  /* indicador de carga */
  loading: boolean;
  @ViewChild('buscar') buscar: ElementRef;
  public configuracionesBusqueda: OpcionBusqueda[];
  public opcionesBusqueda: OpcionBusqueda;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private service: FeriadosService) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.parametroBusqueda = 'codigo';
    this.paginacion = new Paginacion({registros: 10});
  }
  ngOnInit() {
    this.configuracionesBusqueda = [
      {parametro: 'codigo', longitud: 5, descripcion: 'Código', validar: 'digit'},
      {parametro: 'fecha', longitud: 10, descripcion: 'Feriado', validar: 'date'},
      {parametro: 'descripcion', longitud: 1000, descripcion: 'Descripción', validar: 'word'}
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

  getLista(): void {
    this.loading = true;
    const parametros: {codigo?: string, fecha?: string, descripcion?: string} = {codigo: null, fecha: null, descripcion: null};
    switch (this.parametroBusqueda) {
      case 'codigo':
        parametros.codigo = this.textoBusqueda;
        break;
      case 'fecha':
        parametros.fecha = moment(this.textoBusqueda, 'DD/MM/YYYY').format('YYYY-MM-DD');
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

  /*OnConfigurarBusqueda() {
    switch(this.parametroBusqueda) {
      case "codigo": {
        this.buscar.nativeElement.maxLength=5;
        this.buscar.nativeElement.placeholder="Código";
        this.buscar.nativeElement.onkeypress = (e) => e.charCode >= 48 && e.charCode <= 57;
        break;
      }
      case "fecha": {
        this.buscar.nativeElement.maxLength=10;
        this.buscar.nativeElement.placeholder="Feriado";
        this.buscar.nativeElement.onkeypress= (e) => (e.charCode >= 48 && e.charCode <= 57) || e.charCode == 47;
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

  OnPageChanged(event): void {
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
    if (this.parametroBusqueda == 'fecha' && !this.textoBusqueda){
      this.toastr.warning('Ingrese feriado', 'Acción Inválida', {closeButton: true});
      return;
    }

    if (this.parametroBusqueda == 'codigo' && this.textoBusqueda && !(this.textoBusqueda.match(/^[0-9][0-9 ]*$/)!=null) ){
      this.toastr.warning('Ingrese código numérico', 'Acción Inválida', {closeButton: true});
      return;
    }
    if (this.parametroBusqueda == 'fecha' && this.textoBusqueda && !(this.textoBusqueda.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)!=null && moment(this.textoBusqueda, 'DD/MM/YYYY').isValid())) {
      this.toastr.warning('El valor de feriado debe estar en formato dd/mm/aaaa', 'Acción Inválida', {closeButton: true});
      return;
    }
    this.paginacion.pagina = 1;
    this.getLista();
  }

  OnModificar(): void {
    this.router.navigate([`mantenimiento/feriados/editar/${this.selectedObject.codigo}`]);
  }

  onEliminar():void{
    if(this.selectedObject.estado=="INACTIVO"){
      this.toastr.info('El registro se ya se encuentra eliminado', 'Informacion', {closeButton: true});
      return;
    }
    this.service.eliminar(this.selectedObject).subscribe(
      (response: Response) => {
        if(response.estado=="OK") {
          this.toastr.info('El registro se eliminó correctamente', 'Informacion', {closeButton: true});
        }
        this.getLista();
        this.loading = false;
      },
      (response: Response) => this.controlarError(response)
    );
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      this.loading = false;
    }
  }
}
