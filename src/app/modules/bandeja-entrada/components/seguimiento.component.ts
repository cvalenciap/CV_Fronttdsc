import {Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import {Trabajador, Area, DocumentoSeguimiento, Paginacion, Response} from '../../../models';
import {SeguimientoRequest} from '../../../models';
import {EstadoDocumento, AccionDocumento, AccionesDocumento, NivelError, TipoArchivo} from '../../../models/enums';
import {BandejaEntradaRecibidosService as BandejaEntradaRecibidosService, FileServerService} from '../../../services';
import { ToastrService } from 'ngx-toastr';
import {SessionService} from './../../../auth/session.service';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'bandeja-entrada-seguimiento',
  templateUrl: 'seguimiento.template.html'
})
export class SeguimientoComponent implements OnInit, OnChanges {
  @Input()
  listaSeguimiento: DocumentoSeguimiento[] = [];  
  @Input()
  paginacion_seg: Paginacion = new Paginacion();
  @Output()
  buscar = new EventEmitter<{parametro: string, valor: string}>();
  @Output()
  eliminar = new EventEmitter<DocumentoSeguimiento>();
  @Output()
  enviar = new EventEmitter<DocumentoSeguimiento>();
  @Output()
  responder = new EventEmitter<DocumentoSeguimiento>();
  @Output()
  atender = new EventEmitter<DocumentoSeguimiento>();
  @ViewChild('adjuntoPdfSwal') private adjuntoPdfswal: SwalComponent;

  acciones: Map<AccionDocumento, string> = new Map<AccionDocumento, string>();
  filtro: {parametro: string, valor: string};
  habilitarAtendido: boolean;
  selectedRow: number;
  loading: boolean;
  seguimiento: DocumentoSeguimiento;
  seguimientoRequest: SeguimientoRequest;
  nano: number;
  correlativo: number;
  parametroBusqueda: string;
  textoBusqueda: string;
  constructor(
    private router: Router,
    private session: SessionService,
    private bandejaService: BandejaEntradaRecibidosService,
    private toastr: ToastrService,
    private fileServerService: FileServerService) {
  }

  ngOnChanges(changes: any) {
    if (this.listaSeguimiento && this.listaSeguimiento.length>0) {
      this.seguimiento = this.listaSeguimiento[0];
      this.selectedRow=0;
      this.nano = this.seguimiento.nano;
      this.correlativo = this.seguimiento.correlativo;
    } else {
      this.listaSeguimiento = new Array<DocumentoSeguimiento>();
    }
  }

  ngOnInit() {
    this.textoBusqueda = '';
    this.parametroBusqueda = 'ncodseg';
    this.acciones = AccionesDocumento;
    this.habilitarAtendido = true;
    this.filtro = {parametro: 'numero', valor: ''};
    this.loading = false;
    this.seguimiento = new DocumentoSeguimiento();
    this.seguimiento.areaRemitente = new Area();
    this.seguimiento.trabajadorRemitente = new Trabajador();
    this.seguimiento.areaDestino = new Area();
    this.seguimiento.trabajadorDestino = new Trabajador();
    this.seguimiento.acciones = new Array<AccionDocumento>();
    this.seguimientoRequest = new SeguimientoRequest();
  }

  selectRow(index, item: DocumentoSeguimiento) {  
    this.selectedRow = index;
    this.seguimiento = item;
    if(this.seguimiento.estado==EstadoDocumento.PENDIENTE){
      this.habilitarAtendido = true;
    } else {
      this.habilitarAtendido = false;
    }
  }

  OnBuscar() {
    this.buscar.emit(this.filtro);
  }

  OnEliminar() {
    this.bandejaService.eliminarSeguimiento(this.seguimiento.nano, this.seguimiento.correlativo, this.seguimiento.codmov).subscribe(
      (response: Response) => {
        this.listaSeguimiento.splice(this.selectedRow,1);
        this.seguimiento = null;
        this.habilitarAtendido=false;
        this.OnBuscarSeguimientos();
        this.toastr.info('El seguimiento se eliminó correctamente', 'Acción completada!', {closeButton: true});
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnResponder() {
    this.responder.emit(this.seguimiento);
  }

  OnEnviar() {
    this.enviar.emit(this.seguimiento);
    this.router.navigate([`bandeja-entrada/documento/${this.nano.toString()}/${this.correlativo.toString()}`]);
  }

  OnAtender() {
    this.bandejaService.actualizarAtendido(this.seguimiento.nano, this.seguimiento.correlativo, this.seguimiento.codmov).subscribe(
      (response: Response) => {
        this.listaSeguimiento[this.selectedRow].estado = EstadoDocumento.ATENDIDO;
        this.seguimiento.estado = EstadoDocumento.ATENDIDO;
        this.habilitarAtendido=false;
        this.toastr.info('El documento se atendió correctamente', 'Acción completada!', {closeButton: true});
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnRecepcionFisica() {
    this.bandejaService.recepcionFisica(this.seguimiento).subscribe(
      (response: any) => {
        if(response==0) {
          this.toastr.info('El Documento se recibió satisfactoriamente', 'Acción completada!', {closeButton: true});
          this.seguimiento.indRecFis=1;
          this.seguimiento.fechaRecFis=new Date();
        } else {
          this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
          this.seguimiento.indRecFis=0;
        }
      },
      (response: Response) => this.controlarError(response),
    );
  }

  Limpiar(){
    this.textoBusqueda = "";
  }

  OnBuscarSeguimientos() {
    const parametros: {
      ncodseg?: string,
      remitente?: string,
      comentario?: string} = {};

    this.paginacion_seg = new Paginacion({pagina:1, registros: 10})

    if (this.parametroBusqueda == 'ncodseg' && this.textoBusqueda && !(this.textoBusqueda.match(/^[0-9][0-9 ]*$/)!=null) ){
      this.toastr.warning('Ingrese código de seguimiento numérico', 'Acción Inválida', {closeButton: true});
      this.Limpiar();
      return;
    }

    switch (this.parametroBusqueda) {
      case "ncodseg":
            parametros.ncodseg = this.textoBusqueda;
            break;
      case "remitente":
            parametros.remitente = this.textoBusqueda;
            break;
      case "comentario":
            parametros.comentario = this.textoBusqueda;
            break;
    }    
    this.bandejaService.obtenerSeguimiento(parametros, this.nano, this.correlativo, this.paginacion_seg.pagina, this.paginacion_seg.registros).subscribe(
      (response: Response) => {
        this.listaSeguimiento = response.resultado;
        this.paginacion_seg = response.paginacion;
        if(this.listaSeguimiento.length>0) {
          this.seguimiento = this.listaSeguimiento[0];
        } else {
          this.seguimiento = new DocumentoSeguimiento();
          this.seguimiento.acciones = new Array<AccionDocumento>();
          this.seguimiento.areaRemitente = new Area();
          this.seguimiento.trabajadorRemitente = new Trabajador();
          this.seguimiento.areaDestino = new Area();
          this.seguimiento.trabajadorDestino = new Trabajador();
        }
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnPageChanged(event): void {
    this.paginacion_seg.pagina = event.page;
  }

  OnPageOptionChanged(event): void {
    this.paginacion_seg.registros = event.rows;
    this.paginacion_seg.pagina = 1;
  }

  OnVerAdjunto(): void {
    let longitud = this.listaSeguimiento[this.selectedRow].urlDocumento.length;
    if(this.listaSeguimiento[this.selectedRow].urlDocumento.substring(longitud-3,longitud)=='pdf'){
      this.adjuntoPdfswal.show();
    } else{
      this.fileServerService.downloadFileByURL(this.listaSeguimiento[this.selectedRow].urlDocumento,
      'extension.pdf');
    }
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }
}
