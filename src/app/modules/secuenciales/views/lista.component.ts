/**
 * @package       SecuencialesModule
 * @class         SecuencialesListaComponent
 * @description   lista secuenciales
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import { Component, OnInit, Inject, ElementRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {Response, Paginacion, Secuencial, OpcionBusqueda} from '../../../models';
import {NivelError} from '../../../models/enums';
import { ToastrService } from 'ngx-toastr';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {SecuencialesService} from '../../../services';

@Component({
  selector: 'secuenciales-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [SecuencialesService]
})
export class SecuencialesListaComponent implements OnInit {

  /* datos */
  items: Secuencial[];
  /* filtros */
  textoBusqueda: string;
  parametroBusqueda: string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  selectedObject: Secuencial;
  /* indicador de carga */
  loading: boolean;
  @ViewChild('buscar') buscar: ElementRef;
  public configuracionesBusqueda: OpcionBusqueda[];
  public opcionesBusqueda: OpcionBusqueda;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private service: SecuencialesService) {
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
            this.buscar.nativeElement.maxLength=8;
            this.buscar.nativeElement.placeholder="Código";
            this.buscar.nativeElement.onkeypress = (e) => e.charCode >= 48 && e.charCode <= 57 ||  ( e.charCode >= 65 && e.charCode <= 90 ) || ( e.charCode >= 97 && e.charCode <= 122 );
            break;
         }
         case "descripcion": {
            this.buscar.nativeElement.maxLength=100;
            this.buscar.nativeElement.placeholder="Descripción";
            this.buscar.nativeElement.onkeypress = (e) =>  ( e.charCode == 32 ) || ( e.charCode >= 65 && e.charCode <= 90 ) || ( e.charCode >= 97 && e.charCode <= 122 );
            break;
         }
      }
      this.textoBusqueda=null;
   }*/

  getLista(): void {
     this.loading = true;
     const parametros: {area?: number, codigo?: string, descripcion?: string} = {area:210, codigo:null, descripcion:null};
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
           this.loading = false;
        },
        (error) => this.controlarError(error)
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
     this.getLista();
  }

  OnRegistrar(): void {
     this.router.navigate([`despacho/secuenciales/registrar`]);
  }

  OnModificar(): void {
     this.router.navigate([`despacho/secuenciales/editar/${this.selectedObject.tipoDocumento.codigo}`]);
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
