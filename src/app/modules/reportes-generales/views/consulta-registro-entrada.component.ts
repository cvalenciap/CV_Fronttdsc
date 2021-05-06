import { Component, OnInit } from '@angular/core';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import  {Documento,Response,TipoDocumento, ReporteDocumentoEntrada, Paginacion, ReporteRegistroEntrada, ParametroReporte} from '../../../models';
import {AreasMockService as AreasService, TiposDocumentoService, ReportesGeneralesService, FileServerService} from '../../../services';
import {TipoArchivo, NivelError} from '../../../models/enums';

@Component({
  selector: 'consulta-registro-entrada',
  templateUrl: 'consulta-registro-entrada.template.html'
})
export class ConsultaRegistroEntrada implements OnInit {

  loading: boolean;
  buttonDisabled : boolean = true;
  items: ReporteRegistroEntrada[];
  tipodocumento: TipoDocumento[];
  paginacion: Paginacion;
  listaAnno: string[];
  parametros : ParametroReporte;
  parametrosBusqueda: {nano?: number, numeroDocumento?:string, tipoDocumento?: string}
  = {nano: null, numeroDocumento:null, tipoDocumento:null};
  reporteRegistroEntrada : ReporteRegistroEntrada;

  constructor(private localeService: BsLocaleService,
              private reportesService: ReportesGeneralesService,
              private toastr: ToastrService,
              private tipodocumentoService: TiposDocumentoService,
              private fileService: FileServerService) {

    this.parametros = new ParametroReporte();
    this.paginacion = new Paginacion({registros: 10});
    this.reporteRegistroEntrada = new ReporteDocumentoEntrada();
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.reportesService.obtenerParametros().subscribe(
      (response: Response) => {
        this.parametros = response.resultado;
       //debugger;
        //console.log("listaTiposDocumento"+JSON.stringify(this.parametros.listaTiposDocumento));
        //console.log(this.parametros.listaAreas);
      },
      (response: Response) => this.controlarError(response)
     );
  }
  OnBuscar(){
    this.loading = true;
    if(!this.parametrosBusqueda.nano){
      this.toastr.warning('Campo de año vacio','Accion Invalida',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.numeroDocumento){
      this.toastr.warning('Campo de numero de documento vacio','Accion Invalida',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.tipoDocumento){
      this.toastr.warning('Campo de tipo de documento vacio','Accion Invalida',{closeButton:true});
      this.loading = false;
      return;
    }
    console.log(this.parametrosBusqueda);
    this.reportesService.consultarPorRegistroEntrada(this.parametrosBusqueda,this.paginacion.pagina,this.paginacion.registros).subscribe(
      (response: Response) => {
        this.reporteRegistroEntrada = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
        if(this.reporteRegistroEntrada.detalle && this.reporteRegistroEntrada.detalle.length>0)
        this.buttonDisabled = false;
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
  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.OnBuscar();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.OnBuscar();
  }
  OnExportar(){
    this.loading = true;
    if(!this.parametrosBusqueda.nano){
      this.toastr.info('Area vacia','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.numeroDocumento){
      this.toastr.info('Numero de registro no valido','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.tipoDocumento){
      this.toastr.info('Tipo de documento no valido','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    console.log(this.parametrosBusqueda);
    this.reportesService.exportarPorRegistroEntrada(this.parametrosBusqueda,this.paginacion.pagina,this.paginacion.registros).subscribe(
      (xData : ArrayBuffer) => {
        this.toastr.info('Documento generado', 'Confirmación', {closeButton: true});
        this.loading = false;
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        const newBlob = new Blob([xData], {type: TipoArchivo.xlsx});
        this.fileService.downloadFile(newBlob, 'consulta-registro-entrada.xlsx');
      },
      (response: Response) => this.controlarError(response)
    );

  }
  ChangeParameters(){
    this.buttonDisabled = true;
  }
}
