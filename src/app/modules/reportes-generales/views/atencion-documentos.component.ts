import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import {ParametroReporte, Area,Documento,Response,TipoDocumento, ParametrosMesaPartes, ReporteAtencionDocumento, Paginacion} from '../../../models';
import  {AreasService,TiposDocumentoMockService as TiposDocumentoService, ReportesGeneralesService, FileServerService} from '../../../services';
import { EstadoDocumento, TipoArchivo, NivelError } from '../../../models/enums';


@Component({
  selector: 'atencion-documentos',
  templateUrl: 'atencion-documentos.template.html',
  styleUrls: ['atencion-documentos.component.scss']
})
export class AtencionDocumentosComponent implements OnInit {
  buttonDisabled : boolean = true;
  loading: boolean;
  areas: Area[];
  tipodocumento: TipoDocumento[];
  items: ReporteAtencionDocumento[];

  fechaInicial: Date;
  fechaFinal: Date;
  estado : EstadoDocumento;
  area: Area;
  ficha: number;
  /*paginacion*/
  paginacion: Paginacion;
  correlativo: number;
  tipo: string;
  parametros: ParametroReporte;
  //itemsEstado: String[] = ['INGRESADO','PENDIENTE','ATENDIDO','DERIVADO','ELIMINADO'];
  itemsEstado: String[] = [EstadoDocumento.INGRESADO,EstadoDocumento.PENDIENTE,
                          EstadoDocumento.ATENDIDO,EstadoDocumento.DERIVADO,EstadoDocumento.ELIMINADO];
  parametrosBusqueda: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string, ficha:number }
                          = {area: null, fechaInicial: null, fechaFinal:null, estado:null, ficha:null};
  reporteAtencionDocumento : ReporteAtencionDocumento;



  /*Params*/

  private sub: any;
  constructor(private localeService: BsLocaleService,
              private areasService: AreasService,
              private tipodocumentoService: TiposDocumentoService,
              private router: Router,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private reportesService: ReportesGeneralesService,
              private fileService: FileServerService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.loading = false;
    this.parametros = new ParametroReporte();
    this.reporteAtencionDocumento = new ReporteAtencionDocumento();
    this.items = new Array<ReporteAtencionDocumento>();
    this.area = new Area();
    this.paginacion = new Paginacion({registros: 10});
  }

  ngOnInit() {

    this.reportesService.obtenerParametros().subscribe(
      (response: Response) => {
        this.parametros = response.resultado;
      },
      (response: Response) => this.controlarError(response)
     );
    // this.reportesService.consultarAtencionDocumentos({}).subscribe(
    // (response: Response) => this.items = response.resultado);
  }
  /*
  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
*/
  OnImprimir(){
   

    this.parametrosBusqueda.area = this.area.codigo;
    this.parametrosBusqueda.descripcion = this.area.descripcion;
    this.parametrosBusqueda.estado = this.estado;
    this.parametrosBusqueda.fechaFinal= this.fechaFinal;
    this.parametrosBusqueda.fechaInicial = this.fechaInicial;
    if(!this.ValidarFechas())
      return;
    this.parametrosBusqueda.ficha = this.ficha;
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
    if(!this.parametrosBusqueda.ficha){
      this.toastr.info('Ficha ingresada vacia','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    console.log(this.parametrosBusqueda);
    this.loading = true;
    this.reportesService.imprimirAtencionDocumentos(this.parametrosBusqueda,this.paginacion.pagina,this.paginacion.registros).subscribe(
      (xData : ArrayBuffer)=> {
        this.toastr.info('Documento generado', 'Confirmación', {closeButton: true});
        this.loading = false;
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        const newBlob = new Blob([xData], { type: 'application/pdf' });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob, 'AtencionDocumentos.pdf');
            return;
        }

        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = 'AtencionDocumentos.pdf';
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        /*setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
        }, 100);*/
      },
      (response: Response) => this.controlarError(response)
    );
  }
  OnExportar(){
    

    this.parametrosBusqueda.area = this.area.codigo;
    this.parametrosBusqueda.descripcion = this.area.descripcion;
    //this.parametrosBusqueda.estado = this.estado;
    if(!this.ValidarFechas())
      return;
    this.parametrosBusqueda.fechaFinal= this.fechaFinal;
    this.parametrosBusqueda.fechaInicial = this.fechaInicial;
    this.parametrosBusqueda.ficha = this.ficha;
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
    if(!this.parametrosBusqueda.ficha){
      this.toastr.info('Ficha ingresada vacia','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    this.loading = true;
    console.log(this.parametrosBusqueda);
    this.reportesService.exportarAtencionDocumentos(this.parametrosBusqueda,this.paginacion.pagina,this.paginacion.registros).subscribe(
      (xData : ArrayBuffer) => {
        this.toastr.info('Documento generado', 'Confirmación', {closeButton: true});
        this.loading = false;
        const newBlob = new Blob([xData], {type: TipoArchivo.xlsx});
        this.fileService.downloadFile(newBlob, 'atencion-documentos.xlsx');
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
  OnBuscar(){
    this.parametrosBusqueda.area = this.area.codigo;
    this.parametrosBusqueda.descripcion = this.area.descripcion;
    this.parametrosBusqueda.estado = this.estado;
    this.parametrosBusqueda.ficha = this.ficha;
    if(!this.ValidarFechas())
      return;
    this.parametrosBusqueda.fechaFinal= this.fechaFinal;
    this.parametrosBusqueda.fechaInicial = this.fechaInicial;
    if(!this.parametrosBusqueda.area){
      this.toastr.info('Area vacia','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.fechaFinal){
      this.toastr.info('Fecha final ingresada no valida','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.fechaInicial){
      this.toastr.info('Fecha inicial ingresada no valida','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.estado){
      this.toastr.info('Seleccione estado del documento','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.ficha){
      this.toastr.info('Ficha ingresada vacia','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    this.loading = true;
    this.reportesService.consultarAtencionDocumentos(this.parametrosBusqueda,this.paginacion.pagina,this.paginacion.registros).subscribe(
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
  OnBuscarAreas(term: string, item: Area) {
    if (!item || !term) { return false; }
    term = term.toLocaleLowerCase();
    if (item.abreviatura) {
      return item.descripcion.toLowerCase().indexOf(term) > -1 || item.abreviatura.toLowerCase() === term;
    } else {
      return item.descripcion.toLowerCase().indexOf(term);
    }
  }
  ValidarFechas():Boolean{
    if(!(this.fechaInicial<=this.fechaFinal)){
      this.toastr.warning('Fechas invalidas', 'Accion Invalida');
      return false;
    }
    return true;
  }
  ChangeParameters(){
    this.buttonDisabled = true;
  }
  DetectChangeIni(){
    if(this.fechaInicial.toString()=='Invalid Date' || this.fechaInicial.toString()==''){
      this.fechaInicial = new Date();
      this.toastr.warning('Fecha ingresada no valida','Advertencia');
      return;
    }
  }
  DetectChangeFin(){
    if(this.fechaFinal.toString()=='Invalid Date' || this.fechaFinal.toString()==''){
      this.fechaFinal = new Date();
      this.toastr.warning('Fecha ingresada no valida','Advertencia');
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
