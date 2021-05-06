import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { TabsetComponent } from 'ngx-bootstrap';
import {Paginacion, Documento, Tipo, UploadResponse, TipoDocumento, Empresa, Representante, DocumentoAdjunto, Area, Derivado, Trabajador, DocumentoSeguimiento, Response, DocumentoDirigido} from '../../../models';
import {AccionDocumento, EstadoDocumento, NivelError} from '../../../models/enums';
import {BandejaEntradaRecibidosService as BandejaEntradaRecibidosService, FileServerService} from '../../../services';
import {environment} from '../../../../environments/environment';
import {SeguimientoComponent} from '../components/seguimiento.component';
import {SwalComponent} from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'bandeja-entrada-editar',
  templateUrl: 'editar.template.html',
  styleUrls: ['editar.component.scss']
})
export class EditarDocumentoComponent implements OnInit {
  @Output()
  cancelar = new EventEmitter();

  documento: Documento;
  adjuntos: DocumentoAdjunto[];
  adjunto: DocumentoAdjunto;
  acciones: AccionDocumento[] = new Array<AccionDocumento>();
  totalDocumentos: number;
  listaSeguimiento: DocumentoSeguimiento[];
  seguimiento: DocumentoSeguimiento;
  listaAreas: Area[];
  listaTrabajadores: Trabajador[];
  conPlazo: boolean;
  enviarDocumento: boolean;
  arrayDerivados: Derivado[];
  derivado: Derivado;
  nuevoSeguimiento: DocumentoSeguimiento;
  nano: number;
  docAnterior: string = null;
  correlativo: number;
  paginacion_seg : Paginacion;
  dirigidos: DocumentoDirigido[];
  private sub: any;
  boolurl: boolean = true;
  urlPDF: string;
  /* arbol de seguimiento */
  itemsArbol = [];
  loadingArbol: boolean = false;
  /* /arbol de seguimiento */
  @ViewChild('tabsDetalle') tabsDetalle: TabsetComponent;
  @ViewChild('tabSeguimiento') tabSeguimiento: SeguimientoComponent;

  public urlReportePdf: string;
  @ViewChild('reportePdfSwal') private reportePdfSwal: SwalComponent;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private bandejaFileServerService: FileServerService,
              private bandejaService: BandejaEntradaRecibidosService,
              private _location: Location
              ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.derivado = new Derivado();
    this.arrayDerivados = [];
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.nano = + params['nano'];
      this.correlativo = + params['correlativo'];
    });
    this.documento = new Documento();
    this.documento.tipoDocumento = new TipoDocumento();
    this.documento.areaOrigen = new Area();
    this.documento.areaDestino = new Area();
    this.documento.remitente = new Empresa();
    this.documento.representante = new Representante();
    this.documento.trabajadorOrigen = new Trabajador();
    this.documento.trabajadorDestino = new Trabajador();
    this.listaSeguimiento = new Array<DocumentoSeguimiento>();
    this.paginacion_seg = new Paginacion({pagina: 1, registros:10});
    this.dirigidos = new Array<DocumentoDirigido>();
    this.adjuntos = new Array<DocumentoAdjunto>();
    this.adjunto = new DocumentoAdjunto();
    if (this.nano && this.correlativo) {
      this.bandejaService.buscarDocumento(this.nano, this.correlativo).subscribe(
        (response: Response) => {
          this.documento = response.resultado;
          this.dirigidos = this.documento.dirigidos;
          this.adjuntos = this.documento.anexos;
          if(this.adjuntos!=null) {
            this.totalDocumentos=this.adjuntos.length
          } else {
            this.totalDocumentos=0};
            const parametros: {
              ncodseg?: string,
              remitente?: string,
              comentario?: string} = {};
          this.bandejaService.obtenerSeguimiento(parametros, this.nano, this.correlativo, this.paginacion_seg.pagina, this.paginacion_seg.registros).subscribe(
            (response: Response) => {
              this.listaSeguimiento = response.resultado;
              console.log(this.listaSeguimiento);
              this.paginacion_seg = new Paginacion(response.paginacion);
              this.seguimiento = this.listaSeguimiento[0];
            },
            (response: Response) => this.controlarError(response),
          );
        },
        (response: Response) => this.controlarError(response),
      );
    }
    this.enviarDocumento = false;
    this.conPlazo = false;
  }

  OnRegresar() {
    this._location.back();
  }

  OnActualizar() {
    this.router.navigate(['bandeja-entrada/editar/' + this.documento.nano + '/' +this.documento.correlativo]);
  }

  recibiendoDoc(event){
    this.paginacion_seg = new Paginacion({pagina: 1, registros:10});
    const parametros: {
      ncodseg?: string,
      remitente?: string,
      comentario?: string} = {}
    this.bandejaService.obtenerSeguimiento(parametros, this.nano, this.correlativo, this.paginacion_seg.pagina, this.paginacion_seg.registros).subscribe(
      (response: Response) => {
        this.listaSeguimiento = response.resultado;
        this.paginacion_seg = new Paginacion(response.paginacion);
        this.seguimiento = this.listaSeguimiento[0];
      },
      (response: Response) => this.controlarError(response),
    );
    this.tabsDetalle.tabs[1].active = true;
    this.enviarDocumento = false;
  }

  OnAdjuntar(file: HTMLInputElement) {
    var lista: Array<string>;
    lista = new Array<string>();
    if(this.documento.urlDocumento!=null) {
      lista.push(this.documento.urlDocumento.replace(environment.serviceFileServerEndPoint+"/",""));
      this.bandejaFileServerService.deleteFiles(lista).subscribe(
        (response: Response) => {
          console.log(response.resultado);
        },
        (response: Response) => this.controlarError(response),
        );
    }
    this.bandejaFileServerService.uploadFile(file, environment.pathMesaPartes).subscribe(
      (response : UploadResponse) => {
        this.documento.urlDocumento = response.url;
        this.bandejaService.actualizarArchivo(this.documento, this.documento.nano, this.documento.correlativo).subscribe(
          (data: any) => {
            console.log("Archivo Actualizado");
            if(this.documento.estado=="INGRESADO") {
              this.documento.estado=EstadoDocumento.PENDIENTE;
            }
            this.toastr.info('El archivo se cargó correctamente.', 'Carga completa', {closeButton: true});
          },
          (response: Response) => this.controlarError(response),
        );
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnBuscarSeguimiento(filtro: {parametro: string, valor: string}) {
    console.log(filtro);
  }

  OnHojaEnvio() {
    const toastr = this.toastr;
    const this_ = this;
    this.bandejaService.generarHojaEnvioPDF(this.documento.nano, this.documento.correlativo).subscribe(function (data) {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this_.urlReportePdf = fileURL;
      this_.reportePdfSwal.show();
      // window.open(fileURL); // Abrir nueva pestaña
      toastr.info('Documento generado', 'Confirmación');
    },
    (response: Response) => this.controlarError(response),
    );
  }

  OnReporteSeguimiento() {
    const toastr = this.toastr;
    const this_ = this;
    this.bandejaService.generarHojaSeguimientoPDF(this.documento.numero).subscribe(function (data) {
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this_.urlReportePdf = fileURL;
      this_.reportePdfSwal.show();
      // window.open(fileURL); // Abrir nueva pestaña
      toastr.info('Documento generado', 'Confirmación');
    },
    (response: Response) => this.controlarError(response),
    );
  }

  OnArbol() {
    if (this.itemsArbol && this.itemsArbol.length > 0) { return; }
    this.loadingArbol = true;
    this.bandejaService.obtenerArbolDocumento(this.documento.nano, this.documento.correlativo).subscribe(
      (response: Response) => {
          this.itemsArbol = response.resultado;
          this.loadingArbol = false;
        },
        (response: Response) => this.controlarError(response),
    );
  }

  OnEliminar() {
    this.bandejaService.eliminar(this.documento.nano, this.documento.correlativo).subscribe(
      (response: Response) => {
        this.toastr.info('El documento se eliminó correctamente', 'Acción completada!', {closeButton: true});
        this._location.back();
        //this.router.navigate(['bandeja-entrada/recibidos']);
      },
      (error) => this.controlarError(error)
    );
  }

  OnEliminarSeguimiento(seguimiento: DocumentoSeguimiento) {
    console.log(seguimiento);
    this.toastr.info('Seguimiento eliminado', 'Acción completada!', {closeButton: true});
  }

  OnResponderSeguimiento(seguimiento: DocumentoSeguimiento) {
    let remitente = 0;
    let representante = 0;
    if(this.documento.origen=="EXTERNO") {
      remitente = this.documento.remitente.codigo;
      representante = this.documento.representante.codigo;
    } else {
      remitente = this.documento.remitente.codigo;
      representante = this.documento.trabajadorOrigen.ficha;
    }

    this.router.navigate(['bandeja-salida/registrar'], {
      queryParams: {
        nano: seguimiento.nano.toString(),
        correlativo: seguimiento.correlativo.toString(),
        movimiento: seguimiento.codmov.toString(),
        origen: seguimiento.origen.toString(),
        remitente: remitente.toString(),
        representante: representante.toString()
      }
    });
  }

  OnAtenderSeguimiento(seguimiento: DocumentoSeguimiento) {
    this.toastr.success('El documento se estableció como atendido', 'Acción completada!', {closeButton: true});
  }

  OnEnviarSeguimiento(seguimiento: DocumentoSeguimiento) {
    this.enviarDocumento = true;
    this.nuevoSeguimiento = new DocumentoSeguimiento();
    this.nuevoSeguimiento = seguimiento;
  }

  OnNuevoSeguimientoReady() {
    this.tabsDetalle.tabs[3].active = true;
  }

  OnGuardarSeguimiento(seguimiento: DocumentoSeguimiento) {
    this.toastr.success('Seguimiento creado', 'Acción completada!', {closeButton: true});
  }

  OnCancelarSeguimiento() {
    this.enviarDocumento = false;
    this.tabsDetalle.tabs[1].active = true;
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }


  OnLeido() {
    if(this.documento.nindleido==0) {
      this.bandejaService.actualizarLeido(this.documento).subscribe(
        (response: Response) => {
          console.log("Se ha actualizado el registro a leído");
        },
        (response: Response) => this.controlarError(response),
      );
    }
  }

}
