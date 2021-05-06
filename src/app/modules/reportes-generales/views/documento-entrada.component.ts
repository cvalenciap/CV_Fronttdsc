import { Component, OnInit } from '@angular/core';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import  {Response,Documento, ReporteDocumentoEntrada,Paginacion, ParametroReporte, ReporteDocumentoEntradaDet} from '../../../models';
import {AreasMockService as AreasService, FileServerService, ReportesGeneralesService} from '../../../services';
import {TipoArchivo, NivelError} from '../../../models/enums';


@Component({
  selector: 'documento-entrada',
  templateUrl: 'documento-entrada.template.html',
  styleUrls: ['documento-entrada.component.scss']
})
export class DocumentoEntrada implements OnInit {

  buttonDisabled : boolean = true;
  loading: boolean;
  listaAnno: string[];
  paginacion: Paginacion;
  parametros: ParametroReporte;
  reporteDocumentoEntrada : ReporteDocumentoEntrada;
  items: ReporteDocumentoEntradaDet[];
  parametrosBusqueda: {nano?: number, registro?:number}
  = {nano: null, registro: null};

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private reportesService: ReportesGeneralesService,
              private fileService: FileServerService) {

    this.loading = false;
    this.parametros = new ParametroReporte();
    this.paginacion = new Paginacion({registros: 10});
    this.reporteDocumentoEntrada = new ReporteDocumentoEntrada();
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }
  ngOnInit() {
    this.reportesService.obtenerParametros().subscribe(
      (response: Response) => {
        this.parametros = response.resultado;
        // console.log(this.parametros.listaAreas);
      },
      (response: Response) => this.controlarError(response)
     );
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

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
    if( this.loading ) this.loading = false;
  }

  OnBuscar(){
    this.loading = true;
    if(!this.parametrosBusqueda.nano){
      this.toastr.info('Area vacia','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.registro){
      this.toastr.info('Numero de registro no valido','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    console.log(this.parametrosBusqueda);
    this.reportesService.consultarDocumentosEntrada(this.parametrosBusqueda,this.paginacion.pagina,this.paginacion.registros).subscribe(
      (response: Response) => {
        console.log(response);
        this.reporteDocumentoEntrada = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
        if(this.reporteDocumentoEntrada.detalle && this.reporteDocumentoEntrada.detalle.length>0)
          this.buttonDisabled = false;
      },
      (response: Response) => this.controlarError(response)
    );
  }
  ChangeParameters(){
    this.buttonDisabled = true;
  }
  OnExportar(){
    this.loading = true;
    if(!this.parametrosBusqueda.nano){
      this.toastr.info('Area vacia','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    if(!this.parametrosBusqueda.registro){
      this.toastr.info('Numero de registro no valido','Informacion',{closeButton:true});
      this.loading = false;
      return;
    }
    console.log(this.parametrosBusqueda);
    this.reportesService.exportarDocumentosEntrada(this.parametrosBusqueda,this.paginacion.pagina,this.paginacion.registros).subscribe(
      (xData: ArrayBuffer) => {
        this.toastr.info('Documento generado', 'Confirmación', {closeButton: true});
        this.loading = false;
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        const newBlob = new Blob([xData], {type: TipoArchivo.xlsx});
        this.fileService.downloadFile(newBlob, 'documento-entrada.xlsx');
      },
      (response: Response) => this.controlarError(response)
    );

  }
}

