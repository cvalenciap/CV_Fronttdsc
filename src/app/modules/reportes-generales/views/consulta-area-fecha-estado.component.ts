import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import  {ParametroReporte,Area,Documento,Response,TipoDocumento, ReporteAreaFechaEstado,Paginacion} from '../../../models';
import {
  AreasMockService as AreasService,
  TiposDocumentoMockService as TiposDocumentoService,
  ReportesGeneralesService,
  FileServerService
} from '../../../services';
import {EstadoDocumento, TipoArchivo, NivelError} from '../../../models/enums';
@Component({
  selector: 'consulta-area-fecha-estado',
  templateUrl: 'consulta-area-fecha-estado.template.html'
})
export class ConsultaAreaFechaEstadoComponent implements OnInit {

  loading: boolean;
  areas: Area[];
  items: ReporteAreaFechaEstado[];
  tipodocumento: TipoDocumento[];
  paginacion: Paginacion;
  parametros: ParametroReporte;
  reporteAreaFechaEstado : ReporteAreaFechaEstado;
  estado : EstadoDocumento;
  fechaInicial: Date;
  fechaFinal: Date;
  area: Area;
  ficha: number;
  buttonDisabled : boolean = true;

  itemsEstado: String[] = [EstadoDocumento.INGRESADO,EstadoDocumento.PENDIENTE,
    EstadoDocumento.ATENDIDO,EstadoDocumento.DERIVADO,EstadoDocumento.ELIMINADO];
  parametrosBusqueda: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string}
                          = {area: null, fechaInicial: null, fechaFinal:null, estado:null};

  constructor(private localeService: BsLocaleService,
              private areasService: AreasService,
              private toastr: ToastrService,
              private tipodocumentoService: TiposDocumentoService,
              private reportesService: ReportesGeneralesService,
              private fileService: FileServerService) {
    this.loading = false;
    this.parametros = new ParametroReporte();
    this.items = new Array<ReporteAreaFechaEstado>();
    this.area = new Area();
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
    
    this.parametrosBusqueda.area = this.area.codigo;
    this.parametrosBusqueda.descripcion = this.area.descripcion;
    this.parametrosBusqueda.estado = this.estado;
    if(!this.ValidarFechas())
      return;
    this.parametrosBusqueda.fechaFinal= this.fechaFinal;
    this.parametrosBusqueda.fechaInicial = this.fechaInicial;
    if(!this.parametrosBusqueda.area){
      this.toastr.info('Area vacia','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.fechaInicial){
      this.toastr.info('Fecha inicial ingresada no valida','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.fechaFinal){
      this.toastr.info('Fecha final ingresada no valida','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.estado){
      this.toastr.info('Seleccione estado del documento','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    console.log(this.parametrosBusqueda);
    this.loading = true;
    this.reportesService.consultarPorAreaFechaEstado(this.parametrosBusqueda,this.paginacion.pagina,this.paginacion.registros).subscribe(
      (response: Response) => {
        console.log(response);
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
        if(this.items && this.items.length>0)
          this.buttonDisabled = false;
      },
      (response: Response) => this.controlarError(response)
    );
  }
  OnExportar(){
    
    this.parametrosBusqueda.area = this.area.codigo;
    this.parametrosBusqueda.descripcion = this.area.descripcion;
    this.parametrosBusqueda.estado = this.estado;
    if(!this.ValidarFechas())
      return;
    this.parametrosBusqueda.fechaFinal= this.fechaFinal;
    this.parametrosBusqueda.fechaInicial = this.fechaInicial;
    if(!this.parametrosBusqueda.area){
      this.toastr.info('Area vacia','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.fechaInicial){
      this.toastr.info('Fecha inicial ingresada no valida','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.fechaFinal){
      this.toastr.info('Fecha final ingresada no valida','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if (!this.parametrosBusqueda.estado){
      this.toastr.info('Seleccione estado del documento','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    console.log(this.parametrosBusqueda);
    this.loading = true;

    this.reportesService.exportarPorAreaFechaEstado(this.parametrosBusqueda,this.paginacion.pagina,this.paginacion.registros).subscribe(
      (xData: ArrayBuffer) => {
        this.toastr.info('Documento generado', 'Confirmación', {closeButton: true});
        this.loading = false;
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        const newBlob = new Blob([xData], {type: TipoArchivo.xlsx});
        this.fileService.downloadFile(newBlob, 'consulta-area-fecha.xlsx');
      },
      (response: Response) => this.controlarError(response)
    );

  }
  ValidarFechas():Boolean{
    if(!(this.fechaInicial<=this.fechaFinal)){
      this.toastr.warning('Fechas invalidas', 'Accion Invalida', {closeButton: true});
      return false;
    }
    return true;
  }
  ChangeParameters(){
    this.buttonDisabled = true;
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

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
    if( this.loading ) this.loading = false;
  }
  DetectChangeFin(){
    this.buttonDisabled = true;
    if(this.fechaFinal.toString()=='Invalid Date' || this.fechaFinal.toString()==''){
      this.fechaFinal = new Date();
      this.toastr.warning('Fecha ingresada no valida','Advertencia',{closeButton:true});
      return;
    }
  }
  DetectChangeIni(){
    this.buttonDisabled = true;
    if(this.fechaInicial.toString()=='Invalid Date' || this.fechaInicial.toString()==''){
      this.fechaInicial = new Date();
      this.toastr.warning('Fecha ingresada no valida','Advertencia',{closeButton:true});
      return;
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
