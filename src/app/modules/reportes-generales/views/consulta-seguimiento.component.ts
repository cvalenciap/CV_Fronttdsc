import { Component, OnInit } from '@angular/core';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import  {ParametroReporte,Area,Documento,Response,TipoDocumento, ReporteSeguimiento, Paginacion} from '../../../models';
import  {AreasService, TiposDocumentoService, ReportesGeneralesService} from '../../../services';
import { NivelError } from '../../../models/enums';

@Component({
  selector: 'consulta-seguimiento',
  templateUrl: 'consulta-seguimiento.template.html'
})
export class ConsultaSeguimiento implements OnInit {

  loading: boolean;
  items: ReporteSeguimiento[];
  tipodocumento: TipoDocumento[];
  areas: Area[];
  listaAnno: number[];
  parametros: ParametroReporte;
  parametrosBusqueda: {nano?: number, area?: number, numeroDocumento?: string, tipoDocumento: string}
    = {nano: null, area: null, numeroDocumento:null, tipoDocumento:null};
  paginacion: Paginacion;
  reporteSeguimiento : ReporteSeguimiento;

  constructor(private localeService: BsLocaleService,
              private areasService: AreasService,
              private tipodocumentoService: TiposDocumentoService,
              private reportesService: ReportesGeneralesService,
              private toastr: ToastrService) {
    this.loading = false;
    this.parametros = new ParametroReporte();
    this.paginacion = new Paginacion({registros: 10});
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.reportesService.obtenerParametros().subscribe(
      (response: Response) => {
        this.parametros = response.resultado;
      },
      (response: Response) => this.controlarError(response)
    );
  }


  OnBuscar(){
    this.loading = true;
    if(!this.parametrosBusqueda.nano){
      this.toastr.warning('Seleccione un año','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }

    if(!this.parametrosBusqueda.area){
      this.toastr.warning('Seleccione un área','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }

    if(!this.parametrosBusqueda.tipoDocumento){
      this.toastr.warning('Seleccione tipo de documento','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }

    this.reportesService.consultarPorSeguimiento(this.parametrosBusqueda, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        console.log(response);
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
      },
      (response: Response) => this.controlarError(response)
    );
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
    if( this.loading ) this.loading = false;
  }
  OnBuscarAreas(term: string, item: Area) {
    if (!item || !term) { return false; }
    term = term.toLocaleLowerCase();
    if (item.abreviatura) {
      return item.descripcion.toLowerCase().indexOf(term) > -1 || item.abreviatura.toLowerCase() === term;
    } else {
      return item.descripcion.toLowerCase().indexOf(term);
    }
  }
  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.OnBuscar();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.OnBuscar();
  }

}
