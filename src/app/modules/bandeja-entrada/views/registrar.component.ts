import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from "rxjs/Subscription";
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import {environment} from '../../../../environments/environment';
import {FiltroTrabajador, DocumentoDirigido, TipoDocumento, UploadResponse, Asunto, Empresa, Area, Trabajador, Documento, Representante, Response, DocumentoAdjunto} from '../../../models';
import {OrigenDocumento, TipoArchivo,AccionDocumento, AccionesDocumento, EstadoDocumento, PrioridadDocumento, NivelError} from '../../../models/enums';
import {ParametrosService,TiposDocumentoService, TrabajadoresService, FileServerService, EmpresasService, AreasService, BandejaEntradaRecibidosService} from '../../../services';
import { IfStmt } from '@angular/compiler';
import { AuthService } from 'src/app/auth/auth.service';
import { SessionService } from 'src/app/auth/session.service';
import * as moment from 'moment';

@Component({
  selector: 'bandeja-entrada-registrar',
  templateUrl: 'registrar.template.html',
  styleUrls: ['registrar.component.scss']
})
export class RegistrarDocumentoComponent implements OnInit {
  filtroTrabajador: FiltroTrabajador = new FiltroTrabajador();
  tiposDocumento: TipoDocumento[];
  trabajadores: Trabajador[];
  trabajadoresDirigidos: Trabajador[];
  remitentes: Empresa[];
  representantes: Representante[];
  destinos: Area[];
  remitente: Empresa = new Empresa();
  dirigido: Area = new Area();
  copia: Area = new Area();
  documento: Documento;
  itemsOrigen: OrigenDocumento[];
  itemPrioridad: PrioridadDocumento[];
  subscription: Subscription;
  dialogItemAsunto: Asunto;
  acciones: Map<AccionDocumento, string> = new Map<AccionDocumento, string>();
  seleccionados: AccionDocumento[];
  cadenaAcciones: string ='';
  documentoAdjunto: DocumentoAdjunto;
  nano: number;
  correlativo: number;
  private sub: any;
  dirigidos_to: DocumentoDirigido[];
  dirigidos_cc: DocumentoDirigido[];
  adjuntos: DocumentoAdjunto[];
  adjunto: DocumentoAdjunto;
  totalDocumentos: number;
  documentoDirigido: DocumentoDirigido;
  areaAux : Area[];
  trabajadorAux: Trabajador[];
  trabajador_to: Trabajador;
  cambiofecharecepcion: boolean;
  docAnterior: string='';
  areaPrincipal: Area;
  nanoPrincipal: number;
  cargaAdjunto: boolean = false;
  loading : boolean;
  archivoName: string;
  tipoAccion: string;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private areasService: AreasService,
              private trabajadoresService: TrabajadoresService,
              private empresasService: EmpresasService,
              private tiposDocumentoService: TiposDocumentoService,
              public session:SessionService,
              private bandejaService: BandejaEntradaRecibidosService,
              private bandejaFileServerService: FileServerService,
              private _location: Location,
              private bandejaTrabajadoresService: TrabajadoresService,
              private parametrosService: ParametrosService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.loading=true;
    this.documento = new Documento();
    this.areaPrincipal = new Area();
    this.areaPrincipal.codigo = this.session.User.codArea;
    this.areaPrincipal.descripcion = this.session.User.descArea;
    this.nanoPrincipal = (+((new Date()).toISOString().substr(0,4)));
    this.documento.accionesstr='';
    this.documento.acciones = new Array<AccionDocumento>();
    this.documento.numero = '';
    this.documento.asunto = '';
    this.documento.fechaDocumento = new Date();
    this.documento.fechaRecepcion = new Date();
    this.documento.fechaPlazo = new Date();
    this.itemsOrigen = new Array<OrigenDocumento>();
    this.itemsOrigen.push(OrigenDocumento.INTERNO);
    this.itemsOrigen.push(OrigenDocumento.EXTERNO);
    this.documento.origen=OrigenDocumento.INTERNO;
    this.documento.prioridad=PrioridadDocumento.MEDIA;
    this.documento.remitente = new Empresa();
    this.documento.plazo=1;
    this.documento.folios=0;
    this.documento.urlDocumento=null;
    this.documento.representante = new Representante();
    this.documento.estado = EstadoDocumento.PENDIENTE;
    this.documento.opcion='11';
    this.documento.observaciones="";
    this.documento.referencia="";
    this.documento.asunto="";
    this.cambiofecharecepcion=true;
    this.documento.tipoDocumento = new TipoDocumento();
    this.documento.areaOrigen = null;
    this.documento.dirigidos = new Array<DocumentoDirigido>();
    this.documento.dirigidos_to = new Array<DocumentoDirigido>();
    this.documento.dirigidos_cc = new Array<DocumentoDirigido>();
    this.documentoAdjunto = new DocumentoAdjunto();
    this.documentoAdjunto.nombreReal='';
    this.acciones = AccionesDocumento;
    this.seleccionados = new Array<AccionDocumento>();
    this.dirigido = new Area();
    this.copia = new Area();
    this.docAnterior=null;
    this.seleccionados.push(AccionDocumento.ACCION_NECESARIA);
    this.cambiofecharecepcion=true;
    this.sub = this.route.params.subscribe(params => {
      this.nano = + params['nano'];
      this.correlativo = + params['correlativo'];
      console.log(this.nano);
      console.log(this.correlativo);
      this.NgOnInitFirstPhase();
    });
  }
  NgOnInitFirstPhase()
  {
    this.bandejaService.obtenerParametros(null).subscribe(
      (response: Response) => {
        this.tiposDocumento = response.resultado.listaTipoDocumento;
        this.destinos = response.resultado.listaArea;
        this.NgOnInitSecondPhase();
      },
      (response: Response) => this.controlarError(response),
    );
  }
  NgOnInitSecondPhase(){
    
    this.filtroTrabajador.area=this.areaPrincipal.codigo;
    this.filtroTrabajador.ficha=0;
    let codigo = this.areaPrincipal.codigo;
    this.parametrosService.buscarTrabajadores({codigo}).subscribe(
    //this.bandejaTrabajadoresService.listar(this.filtroTrabajador).subscribe(
      (response:Response) => {
        this.trabajadoresDirigidos = response.resultado;
        if (!this.nano && !this.correlativo)
          this.OnSeleccionarJefe();
        this.NgOnInitThirdPhase();
      },
      (response: Response) => this.controlarError(response),
    );
  }
  NgOnInitThirdPhase(){
    let bool = false;
    
    if (this.nano && this.correlativo) {
      this.bandejaService.buscarDocumento(this.nano, this.correlativo).subscribe(
        (response: Response) => {
          this.loading=false;
          this.documento = Object.assign(new Documento(), response.resultado);
          // fix: cuando es fecha actual datepicker muestra 'Invalid Date'
          this.documento.fechaDocumento = moment(this.documento.fechaDocumento).toDate();
          this.documento.fechaRecepcion = moment(this.documento.fechaRecepcion).toDate();
          this.nanoPrincipal = this.documento.nano;
          this.areaPrincipal = this.documento.areaPrincipal;
          if(this.documento.origen==OrigenDocumento.INTERNO){
            this.documento.areaOrigen = this.documento.remitente;
          }
          this.documento.opcion = '3';
          this.docAnterior = this.documento.urlDocumento;
          this.seleccionados = this.documento.acciones;
          this.dirigidos_to = this.documento.dirigidos_to;
          this.dirigidos_cc = this.documento.dirigidos_cc;
          if (this.dirigidos_cc!=null) {
            this.areaAux = new Array<Area>();
            this.documento.dirigidos_cc.forEach((e) => {
              e.area.jefe = e.trabajador;
              e.trabajador.area = null;
              this.areaAux.push(e.area);  
            });
          }
          if (this.documento.dirigidos_to!=null) {            
            this.trabajador_to = new Trabajador();
            this.trabajador_to.area = this.documento.dirigidos_to[0].area;
            this.trabajador_to.ficha = this.documento.dirigidos_to[0].trabajador.ficha;
            this.trabajador_to.nombreCompleto = this.documento.dirigidos_to[0].trabajador.nombreCompleto;
            for(let i=0;i<this.trabajadoresDirigidos.length;i++){
              if(this.trabajadoresDirigidos[i].ficha == this.trabajador_to.ficha){
                bool= true;
                break;
              }
            }
            if(!bool){
              this.trabajadoresDirigidos=[...this.trabajadoresDirigidos, Object.assign(this.trabajador_to)];  
            }
          }          
        },
        (response: Response) => this.controlarError(response),
      );
      if(this.documento.areaOrigen!=null) {
        this.OnCambiarAreaRemitente();
      }
    }else{
      this.loading=false;
    }
  }
  DetectChange(){
    if(!this.documento.fechaDocumento){
        this.documento.fechaDocumento = new Date();
        this.toastr.warning('Se debe ingresar una fecha valida','Advertencia',{closeButton:true});
        return;
    }else{
      if(this.documento.fechaDocumento.toString()=='Invalid Date' || this.documento.fechaDocumento.toString()==''){
        this.documento.fechaDocumento = new Date();
        this.toastr.warning('Fecha ingresada no valida','Advertencia',{closeButton:true});
        return;
      } 
    }
  }
  OnFechaRecepcion() {
    if(this.documento.fechaRecepcion==null) {
      this.documento.fechaRecepcion= new Date();
    } else {
      if(this.documento.fechaRecepcion.toString()=='Invalid Date') {
        this.documento.fechaRecepcion= new Date();
      }
    }
    if(this.cambiofecharecepcion==false) {
      this.OnCambiarPlazo();
    }
    this.cambiofecharecepcion=false;
  }

  OnFolios() {
    console.log(this.documento.folios);
    if(this.documento.folios.toString().length==0) {
      this.documento.folios=0;
    } else {
      if(this.documento.folios<0) {
        this.documento.folios=0;
      }
    }
  } 

  /* buscar áreas por descripción o abreviatura en ng-select */
  OnBuscarAreas(term: string, item: Area) {
    if (!item || !term) { return false; }
    term = term.toLocaleLowerCase();
    if (item.abreviatura) {
      return item.descripcion.toLowerCase().indexOf(term) > -1 || item.abreviatura.toLowerCase() === term;
    } else {
      return item.descripcion.toLowerCase().indexOf(term);
    }
  }

  OnBuscarAreasRemitente(term: string, item: Area) {
    if (!item || !term) { return false; }
    term = term.toLocaleLowerCase();
    if (item.abreviatura) {
      return item.descripcion.toLowerCase().indexOf(term) > -1 || item.abreviatura.toLowerCase() === term;
    } else {
      return item.descripcion.toLowerCase().indexOf(term);
    }
  }


  OnAgregar_CC() {
    var dd: DocumentoDirigido;
    this.documento.dirigidos_cc = new Array<DocumentoDirigido>();
    this.areaAux.forEach((e)=>{
      dd = new DocumentoDirigido();
      dd.area=e;
      dd.trabajador=e.jefe;
      dd.tipo='CC';
      this.documento.dirigidos_cc.push(dd);
    });
  }

  OnAgregar_TO() {
    var dd: DocumentoDirigido;
    this.documento.dirigidos_to = new Array<DocumentoDirigido>();
    dd = new DocumentoDirigido();
    dd.trabajador=this.trabajador_to;
    dd.area=this.trabajador_to.area;
    dd.tipo='AA';
    //console.log(this.documento.dirigidos_to);
    this.documento.dirigidos_to.push(dd);
  }

  OnCambiarRemitente(searchValue : string) {
    let descripcion = searchValue;
    if (descripcion != null && descripcion.length>=3) {
      if(this.subscription) {
        this.subscription.unsubscribe;
      }
      this.parametrosService.buscarEmpresa({descripcion}).subscribe(
      //this.subscription = this.bandejaService.cambiarRemitente({descripcion}, 1, 100).subscribe(
        (response: Response) => {
          this.remitentes = response.resultado;

        },
        (response: Response) => this.controlarError(response),
      );
    }
  }

  OnCambiarRepresentantes(valor: any) {
    if(this.documento.remitente){
      let codigo = valor.codigo;
      this.parametrosService.buscarRepresentante({codigo}).subscribe(
      //this.bandejaService.cambiarRepresentantes(valor.codigo).subscribe(
        (response: Response) => {
          this.representantes = response.resultado;
          if(this.representantes.length>0)
            this.documento.representante = this.representantes[0];
          else
            this.toastr.warning('La empresa seleccionada no posee representantes', 'Acción Invalida', {closeButton: true});
        },
        (response: Response) => this.controlarError(response),
      );
    }else{
      this.representantes = new Array<Representante>();
      this.documento.representante = new Representante();
    }
  }

  OnGuardar(tipoAccion) {
    if (tipoAccion) {
      //this.tipoAccion = tipoAccion;
      this.tipoAccion = "actualizó";
    }else{
      this.tipoAccion = "guardó";
    }    
    if(this.OnValidarCampos()==false) {
      return;
    } else {
      this.documento.nano = this.nano;
      this.documento.correlativo = this.correlativo;
      if(this.documento.urlDocumento=='' || this.documento.urlDocumento==null) {
        this.documento.urlDocumento = 'VACIO';
      }
      this.OnCadenaAcciones();
      this.documento.accionesstr = this.OnCadenaAcciones();
      this.guardarCabecera();
    }
  }

  guardarCabecera() {
    if(this.documento.dirigidos_to.length==0)
      this.OnAgregar_TO();
    else{
      this.documento.dirigidos_to=new Array<DocumentoDirigido>();
      this.OnAgregar_TO();
    }

    if(this.documento.origen==OrigenDocumento.INTERNO){
      this.documento.remitente==null;
      this.documento.representante = null;
    }
    if(this.documento.asunto && this.documento.asunto.trim()!="")
      this.documento.asunto = this.documento.asunto.trim().toUpperCase();
    if(this.documento.observaciones && this.documento.observaciones.trim()!="")
      this.documento.observaciones = this.documento.observaciones.trim().toUpperCase();
    if(this.documento.referencia && this.documento.referencia.trim()!="")
      this.documento.referencia = this.documento.referencia.trim().toUpperCase();
    if(this.documento.numero && this.documento.numero.trim()!="")
      this.documento.numero = this.documento.numero.trim().toUpperCase();

    this.bandejaService.guardarDocumento(this.documento).subscribe(
      (response: Response) => {        
        this.documento = response.resultado;
        if(this.documento.urlDocumento!=null && this.documento.urlDocumento!=this.docAnterior) {
          this.bandejaService.actualizarArchivo(this.documento, this.documento.nano, this.documento.correlativo).subscribe(
            (data: any) => {
              console.log("Archivo Actualizado");
             
            },
            (response: Response) => this.controlarError(response),
          );
        }
        //this.toastr.success('El documento se guardó correctamente', 'Acción completada!', {closeButton: true});
        this.toastr.success('El documento se ' + this.tipoAccion + ' correctamente', 'Acción completada!', {closeButton: true});
        //this._location.back();
        this.router.navigate([`bandeja-entrada/recibidos`]);
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnAdjuntar(file: HTMLInputElement) {
    var lista: Array<string> = new Array<string>();
    if(!this.bandejaFileServerService.validateFile(file,[TipoArchivo.pdf])){
      this.toastr.warning('Debe seleccionar un archivo PDF', 'Archivo Inválido');
      return;
    }
    //Cancelar carga de archivo anterior
    if(this.subscription){
      this.subscription.unsubscribe;
    }
      
    if(this.documento.urlDocumento!=null && this.documento.urlDocumento!=this.docAnterior) {
      lista.push(this.documento.urlDocumento.replace(environment.serviceFileServerEndPoint+"/",""));
      this.bandejaFileServerService.deleteFiles(lista).subscribe(
        (response: Response) => {
          console.log(response.resultado);
          this.OnSubirArchivo(file);
        },
        (response: Response) => this.controlarError(response),
        );
    }else{
      this.OnSubirArchivo(file);
    }
  }
  OnSubirArchivo(file: HTMLInputElement){
    console.log(file.files[0].name);
    this.archivoName = file.files[0].name;
  this.bandejaFileServerService.uploadFile(file, environment.pathMesaPartes).subscribe(
      (response: UploadResponse) => {
        this.cargaAdjunto = false;
        this.documento.urlDocumento = response.url;
        this.toastr.info('El archivo se cargó correctamente.', 'Carga completa', {closeButton: true});
        console.log(this.documentoAdjunto.nombre);
        console.log(this.documento.urlDocumento);
      },
      (error) => {
        console.log(error);
        this.toastr.error('Se presentó un problema al cargar el archivo: ', 'Error', {closeButton: true});
      }
    );
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }

  OnCambiarPlazo() {
      if (this.documento.plazo.toString() == "" || this.documento.plazo<1) {
        this.documento.plazo = 1;
      }
      if (this.documento.plazo>environment.max_valor_plazo) {
        this.documento.plazo = environment.max_valor_plazo;
      }
      if (this.documento.fechaRecepcion) {
        this.bandejaService.calcularFechaPlazo(this.documento.fechaRecepcion, this.documento.plazo).subscribe(
          (response:Response) => {
            this.documento.fechaPlazo = response.resultado;
            
          },
          (response: Response) => this.controlarError(response)
        );
      }
  }

  OnSeleccionarAsunto() {
    if (this.dialogItemAsunto != null) {
      this.documento.asunto = this.dialogItemAsunto.descripcion;
    }
  }

  OnCambiarAreaRemitente() {
    //this.filtroTrabajador= new FiltroTrabajador();
    //this.filtroTrabajador.area = this.documento.areaOrigen.codigo;
    let codigo = this.documento.areaOrigen.codigo;
    this.parametrosService.buscarTrabajadores({codigo}).subscribe(
    //this.bandejaTrabajadoresService.listar(this.filtroTrabajador).subscribe(
      (response:Response) => {
        this.trabajadores = response.resultado;
        this.documento.trabajadorOrigen = this.trabajadores[0];
        this.trabajadores.forEach((e) => {
          if(e.jefe==1 && this.documento.opcion=='1') {
            this.documento.trabajadorOrigen = e;
          }  
        });
        
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnChecked(accion: AccionDocumento) {
    let i = this.seleccionados.indexOf(accion);
    if(i>-1) {
      this.seleccionados.splice(i,1);
    } else {
      this.seleccionados.push(accion);
    }
  }

  OnValidarCampos() {
    //if(this.documento.urlDocumento=='' || this.documento.urlDocumento==null) {
      //this.toastr.warning('Debe adjuntar el archivo asociado al documento', 'Acción inválida', {closeButton: true});
      //return false;
    //}

    if(!this.documento.tipoDocumento.codigo) {
      this.toastr.warning('No se ha seleccionado un Tipo de Documento', 'Acción inválida', {closeButton: true});
      return false;
    }

    if(this.documento.numero==null || this.documento.numero.length==0) {
      this.toastr.warning('No se ha ingresado el Número de Documento', 'Acción inválida', {closeButton: true});
      return false;
    }


   if(this.documento.origen==OrigenDocumento.EXTERNO && (!this.documento.remitente || this.documento.remitente.codigo==null)) {
      this.toastr.warning('No se ha especificado el Remitente', 'Acción inválida', {closeButton: true});
      return false;
    }

    if(this.documento.origen==OrigenDocumento.EXTERNO && (!this.documento.representante || this.documento.representante.codigo==0)) {
      this.toastr.warning('No se ha especificado el Representante', 'Acción inválida', {closeButton: true});
      return false;
    }

    if(this.documento.origen==OrigenDocumento.INTERNO && this.documento.areaOrigen==null) {
      this.toastr.warning('No se ha especificado el Area Remitente', 'Acción inválida', {closeButton: true});
      return false;
    }

    if(this.documento.origen==OrigenDocumento.INTERNO && this.documento.trabajadorOrigen==null) {
      this.toastr.warning('No se ha especificado el Trabajador Remitente', 'Acción inválida', {closeButton: true});
      return false;
    }

    if((!this.documento.dirigidos_to)) {
      this.toastr.warning('No se la seleccionado el Trabajador de Destino', 'Acción inválida', {closeButton: true});
      return false;
    }

    if((this.documento.asunto==null) || this.documento.asunto.trim().length==0) {
      this.toastr.warning('No se ha especificado el Asunto del documento', 'Acción inválida', {closeButton: true});
      return false;
    }

    if(this.seleccionados.length==0) {
      this.toastr.warning('Debe seleccionar por lo menos una acción', 'Acción inválida', {closeButton: true});
      return false;
    }
    return true;
  }

  OnCadenaAcciones() {
    this.cadenaAcciones='';
    this.seleccionados.forEach((e)=>{
      this.cadenaAcciones = this.cadenaAcciones + e.toString();
    });
    return this.cadenaAcciones;
  }

  OnDescartar() {
    var lista: Array<string>;
    lista = new Array<string>();
    if(this.documento.urlDocumento!=null && this.documento.urlDocumento!=this.docAnterior) {
      lista.push(this.documento.urlDocumento.replace(environment.serviceFileServerEndPoint+"/",""));
      this.bandejaFileServerService.deleteFiles(lista).subscribe(
        (response: Response) => {
          console.log(response.resultado);
        },
        (response: Response) => this.controlarError(response),
        );
    }
    this._location.back();
  }

  OnSeleccionarJefe() {
    this.trabajadoresDirigidos.forEach((e) => {
      if(e.jefe==1) {
        this.trabajador_to = e;
      }
    });
  }
}