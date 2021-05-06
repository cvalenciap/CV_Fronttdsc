import { Component, OnInit,ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { SwalPartialTargets, SwalComponent} from '@toverux/ngx-sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from "rxjs/Subscription";
import { BandejaSalidaService} from '../../../services';
import {TipoDocumento,DocumentoComentario,AreaGrupo, Trabajador, Empresa,Representante, Area, Documento, Asunto, Response, FiltroTrabajador} from '../../../models';
import {DocumentoFirmante} from '../../../models/documento-firmante';
import {EmpresasService, TrabajadoresService, AreasService, ParametrosService} from '../../../services';
import { validate}  from 'class-validator';
import { TipoFirma, Estado, OrigenDocumento, NivelError } from '../../../models/enums';

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

declare var jQuery:any;
@Component({
  selector: 'bandeja-salida-registrar',
  templateUrl: 'registrar.template.html',
  styleUrls: ['registrar.component.scss']
})
export class RegistrarDocumentoComponent implements OnInit{
  documentoComentario: DocumentoComentario[];
  fechaActual = new Date();
  comentarios:DocumentoComentario[];

  documento: Documento = new Documento();
  areaOrigen: Area = new Area();
  tiposDocumento: TipoDocumento[];
  remitentes: Trabajador[] = new Array<Trabajador>();
  remitentesFlujo: Trabajador[] = new Array<Trabajador>();
  remitente: Trabajador = new Trabajador();
  destinos: Area[] = new Array<Area>();

  destinosAreaGrupo: AreaGrupo[] = new Array<AreaGrupo>();
  areaGrupoDestino: AreaGrupo = new AreaGrupo();

  empresas: Empresa[] = new Array<Empresa>();
  representantes: Representante[] = new Array<Representante>();
  dirigido: Trabajador = new Trabajador();
  tipoFlujo: string;
  /*Flujo*/
  firmante: Trabajador = new Trabajador();
  iTemFirmante: DocumentoFirmante;
  /* Lista Items Anhadidos*/
  items: Trabajador[];
  /**/
  itemsEmpresa: Empresa[];
  itemsRepresentante: Representante[]; 
  /* Items Seleccionados */
  /* Items  */
  itemTrabajador: Trabajador = new Trabajador();
  itemArea: Area;
  areaAux: Area = new Area();
  /**/
  listCombos: DocumentoFirmante[] = new Array<DocumentoFirmante>();
  firmanteArea: DocumentoFirmante = new DocumentoFirmante();
  tipoDoc: TipoDocumento = new TipoDocumento();
  itemsOrigen: String[] = ['INTERNO','EXTERNO'];

  nanoEntrada: Number;
  ncorrelativo: Number;
  /**/
  loading : boolean;
  cargaDirigido: boolean;
  errortrabajadores: boolean = true;
  subscription: Subscription;
  textoCambio : boolean;
  envioSignal: boolean;
  firmateDuplicado: boolean;
  documentoTitle : string = "";
  documentoMessage : string = "";
  urlPDF: string;
  editorConfig = {
    /*placeholder: 'insert your text',*/
    tabsize: 2,
    height: 200,
    lang: 'es-ES',
    toolbar: [
      // [groupName, [list of button]]
      ['misc', ['undo', 'redo']],
      ['font', ['style', 'fontname', 'fontsize', 'color']],
      ['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['param', ['ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Courier New', 'Open Sans', 'Tahoma', 'Times']
  };
  bsModalRef: BsModalRef;
  documentoRetorno : Documento;
  /* valor del cuadro de diálogo Seleccionar Asunto */
  dialogItemAsunto: Asunto;
  codigoDocumento: string;
  codigoMovimiento: string;
  codigoFirmanteFinal : number;
  periodos: number[];

  cargaSeguimiento: boolean = false;
  nano_seguimiento: number;
  correlativo_seguimiento: number;
  movimiento_seguimiento: number;
  origen_seguimiento: string;
  remitente_seguimiento: number;
  representante_seguimiento: number;
  @ViewChild('ngselect_2') NgSelectComponent_2;
  @ViewChild('ngselect_1') NgSelectComponent_1;
  @ViewChild('duplicadoFirmanteSwal') private swalDialog: SwalComponent;
  errors: any;ng;
  invalid : boolean;

  private sub: any;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              public readonly swalTargets: SwalPartialTargets,
              private empresasService: EmpresasService,
              private bandejaSalidaService: BandejaSalidaService,
              private areasService : AreasService,
              private trabajadoresService: TrabajadoresService,
              private parametrosService: ParametrosService,
              private EmpresaService: EmpresasService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.items = new Array<Trabajador>();
    this.itemsRepresentante = new Array<Representante>();
    this.itemsEmpresa = new Array<Empresa>();
    this.listCombos.push(new DocumentoFirmante());
    this.firmanteArea.tipoFirma=TipoFirma.FIRMA;
    this.areaGrupoDestino.areaGrupo = 'A';
    this.loading = false;
    this.cargaDirigido = false;
    this.envioSignal = false;
  }
  
  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  ngOnInit() {
    this.codigoDocumento = null;
    
    this.loading= true;
    combineLatest(this.route.params, this.route.queryParams)
    .pipe(map(results => ({params: results[0], query: results[1]})))
    .subscribe(results => {
	  this.codigoDocumento =  results['params'].codigo;
    this.codigoMovimiento = results['params'].codMovimiento;
    this.nano_seguimiento = results['query'].nano;
    this.correlativo_seguimiento =  results['query'].correlativo;
    this.movimiento_seguimiento =  results['query'].movimiento;
    this.origen_seguimiento =  results['query'].origen;
    this.remitente_seguimiento =  results['query'].remitente;
    this.representante_seguimiento =  results['query'].representante;
/*
      console.log(this.codigoDocumento);
      console.log(this.codigoMovimiento);
      console.log(this.nano_seguimiento);
      console.log(this.correlativo_seguimiento);
      console.log(this.movimiento_seguimiento);
      console.log(this.origen_seguimiento);
      console.log(this.remitente_seguimiento);
      console.log(this.representante_seguimiento);*/
      this.BuscarParametros();
    });
  }
  
  BuscarParametros(){
    this.bandejaSalidaService.cargarParametros().subscribe(
      (response: Response) => {
        //console.log(response);
        this.documento.areaOrigen  = response.resultado.area;
        this.areaOrigen = this.documento.areaOrigen;
        this.tiposDocumento = response.resultado.listaTipoDocumento,
        //this.remitentes = response.resultado.listaTrabajador,
        this.remitentesFlujo = response.resultado.listaTrabajador,
        this.areaAux = this.remitentesFlujo[0].area;
        this.destinos = response.resultado.listaArea;
        this.destinosAreaGrupo = response.resultado.listaAreaGrupo;
        this.periodos = response.resultado.periodo;
        
        
       // console.log(this.documento.areaOrigen.descripcion.toString());
        if(!this.codigoDocumento){
          this.documento = this.bandejaSalidaService.crearDocumento();
          this.tipoFlujo = 'A';
          this.textoCambio = true;
          this.documento.areaOrigen  = response.resultado.area;
          if(!this.documento.codigo)
            this.documento.trabajadorOrigen = response.resultado.trabajadorOrigen;
          if(!this.documento.codigo)
            this.firmante = this.documento.areaOrigen.jefe;
         // console.log(this.documento.trabajadorOrigen);
          this.documentoTitle = "Nuevo Documento";
          this.documentoMessage = "creacion";
          if(this.nano_seguimiento != null &&
            this.correlativo_seguimiento != null &&
            this.movimiento_seguimiento != null &&
            this.origen_seguimiento != null &&
            this.remitente_seguimiento != null &&
            this.representante_seguimiento != null
            ){
            this.cargaSeguimiento = true;
            this.documento.correlativoEntrada =this.correlativo_seguimiento.toString();
            this.documento.nanoEntrada = this.nano_seguimiento;
            this.documento.codEntrada = this.correlativo_seguimiento;
            this.documento.codmov = this.movimiento_seguimiento;
            //this.documento.movimiento.codigo = this.movimiento_seguimiento;
            this.documento.movimiento=null;
            if(this.origen_seguimiento=='EXTERNO'){
              this.documento.origen = OrigenDocumento.EXTERNO 
              //console.log(this.remitente_seguimiento);  
            
              this.empresasService.buscarPorCodigo(this.remitente_seguimiento).subscribe(
                (response : Response) =>{
                  //console.log(response);
                  if(response.estado="OK"){
                    this.documento.empresaDestino = response.resultado;
                    this.OnCambiarRepresentantes();
                  }else{
                    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
                    return;
                  }
                },
                (response: Response) => this.controlarError(response),
              );
            } else {
              this.documento.origen = OrigenDocumento.INTERNO ;
              this.areaGrupoDestino.areaGrupo = 'A';
              this.areaGrupoDestino.codigo= this.remitente_seguimiento;
              this.ObtenerTrabajador();
            }
            //console.log(this.documento);
          }else{
            this.loading= false;
          }
        }
        else{
          this.BuscarDocumento();
          this.documentoTitle = "Editar Documento";
          this.documentoMessage = "edicion";
          
        }  
      }
        
    );
  }

  BuscarDocumento(){
    let bool = false;
    this.bandejaSalidaService.buscarPorDocumento(this.codigoDocumento,this.codigoMovimiento).subscribe(
      (response: Response) =>{
        console.log(response);
        if(!response.acciones.includes('MODIFICAR'))
          this.router.navigate(['bandeja-salida/pendientes']);
        this.documento = response.resultado;

        this.documento.areaOrigen = this.areaOrigen;
        if(!this.documento.firmante){
          this.listCombos = this.documento.visantes;
          this.documento.firmanteArea = this.listCombos.pop();
          this.codigoFirmanteFinal = this.documento.firmanteArea.trabajador.secuencial;
        }else{
          this.dirigido =  this.documento.visante;
          this.firmante =  this.documento.firmante;
        }
        
        if(this.documento.dirigidosTrabajador)
          this.items = this.documento.dirigidosTrabajador;
        if(this.documento.dirigidosEmpresa){
          this.itemsEmpresa = this.documento.dirigidosEmpresa;
        }
        if(!this.documento.visante){
          this.tipoFlujo='O';
          this.firmanteArea = this.documento.firmanteArea;
          this.dirigido = new Trabajador();
          this.dirigido.area = this.firmante.area = this.documento.areaOrigen;

        }else{
          this.tipoFlujo='A';
          this.firmante = this.documento.firmante;
          this.dirigido = this.documento.visante;
        };
        this.textoCambio = false;
        for(let i=0;i<this.remitentesFlujo.length;i++){
          if(this.remitentesFlujo[i].ficha == this.dirigido.ficha){
            bool= true;
            break;
          }
        }
        if(!bool){
          this.remitentesFlujo=[...this.remitentesFlujo, Object.assign(this.dirigido)];  
        }
        console.log(this.documento.numero);
        this.bandejaSalidaService.cargarComentarios(this.documento.numero).subscribe(
          (response: Response) => this.documentoComentario = response.resultado
        );
        if(this.documento.correlativoEntrada && this.documento.nanoEntrada){
          this.nano_seguimiento = this.documento.nanoEntrada;
          this.correlativo_seguimiento = Number.parseInt(this.documento.correlativoEntrada);
        }
        //console.log(this.documento);
        this.loading= false;
      }
    );
  }
  ObtenerTrabajador(){
    if(!this.areaGrupoDestino){
      this.remitentes = new Array<Trabajador>();
      this.documento.trabajadorDestino = new Trabajador(); 
      return;
    }

    if(this.areaGrupoDestino.areaGrupo=='G'){
      //this.toastr.info("Obtenecion de Grupo","Informacion",{closeButton:true})
      return;
    }
    this.documento.trabajadorDestino = new Trabajador();
    let filtroTrabajador : FiltroTrabajador = new FiltroTrabajador();
    //filtroTrabajador.area = this.areaGrupoDestino.codigo;
    let codigo = this.areaGrupoDestino.codigo;
    this.errortrabajadores = true;
    this.cargaDirigido = true;
    //this.trabajadoresService.listar(filtroTrabajador).subscribe(
      this.parametrosService.buscarTrabajadores({codigo}).subscribe( 
      (response : Response) => {
        this.remitentes = response.resultado;
        this.cargaDirigido = false;
        if(this.remitentes[0]==null || this.remitentes.length==0){
          this.toastr.info('El area no contiene trabajadores', 'Informacion', {closeButton: true});
          this.remitentes = new Array<Trabajador>();
          return;
        }
        this.errortrabajadores = false;
        if(this.cargaSeguimiento){
          this.loading= false;
          let trabajador = this.remitentes.find(e=>e.ficha==this.representante_seguimiento);
          if(!trabajador){
            this.toastr.info('El trabajador dirigido se encuentra inhabilitado', 'Informacion', {closeButton: true});
            trabajador = this.remitentes.find(e=>e.jefe==1);
          }
          if(!trabajador){
            this.toastr.info('El area no contiene jefe para respuesta', 'Informacion', {closeButton: true});
            return;
          }
          let area = this.destinos.find(e=> e.codigo==this.remitente_seguimiento);
          trabajador.area = area;
          this.items.push(trabajador);
          this.cargaSeguimiento = false;
          return;
        }
        this.documento.trabajadorDestino = this.remitentes.find((element)=>{
          return element.jefe==1;
        });
        if(!this.documento.trabajadorDestino){
          this.toastr.warning('Area seleccionada no posee jefe de equipo','Advertencia',{closeButton:true});
        }
      }
    );
    
  }
  ObtenerGrupo(){
    let bool: Boolean = true;
    let listaTrabajador : Array<Trabajador>;
    this.cargaDirigido = true;
    this.bandejaSalidaService.obtenerTrabajadorGrupo(this.areaGrupoDestino.codigo).subscribe(
      (response : Response) => {
        listaTrabajador = response.resultado;
          this.cargaDirigido = false;
          if(listaTrabajador[0]==null || listaTrabajador.length==0){
            this.toastr.info('El grupo no contiene areas', 'Informacion', {closeButton: true});
            this.remitentes = new Array<Trabajador>();
            return;
        }
        listaTrabajador.forEach(e=>{
          for(let item of this.items){
            if(item.ficha==e.ficha && item.area.codigo==e.area.codigo){
              bool = false;
              break;
            }
          }
          if(bool)
            this.items.push(e);
          bool = true;  
        });
      }
    );
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
      this.OnPlazo();
    }
  }
  OnPlazo() {
    if(this.documento.fechaDocumento==null || this.documento.plazo==null){
      return;
    } 
    if (this.documento.plazo.toString().trim() == "" || this.documento.plazo<1) {
      this.documento.plazo = 1;
    }
    if (this.documento.plazo>99) {
      this.documento.plazo = 99;
    }
    let date: Date;
    date = new Date(this.documento.fechaDocumento);
    if (this.documento.plazo > 0) {
      this.bandejaSalidaService.calcularFechaPlazo(date, this.documento.plazo).subscribe(
        (response: Response) => {
          this.documento.fechaPlazo = response.resultado
        },
        (response: Response) => this.controlarError(response),
      );
     }
  }
  /* controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    if( this.loading ) this.loading = false;
  } */
  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
    if( this.loading ) this.loading = false;
  }

  OnGuardar() {
    if(!this.documento.tipoDocumento.codigo){
      this.toastr.warning('Se debe seleccionar un tipo documento', 'Acción invalida', {closeButton: true});
      return;
    }
    if(!this.documento.fechaDocumento){
      this.toastr.warning('Se debe seleccionar una fecha de documento', 'Acción invalida', {closeButton: true});
      return;
    }
    if(!this.documento.plazo || this.documento.plazo.toString().trim()==""){
      this.toastr.warning('Se debe ingresar un plazo', 'Acción invalida', {closeButton: true});
      return;
    }
    
    if(!this.documento.prioridad){
      this.toastr.warning('Se debe seleccionar una prioridad de documento', 'Acción invalida', {closeButton: true});
      return;
    }
    this.documento.asunto = this.documento.asunto.trim();
    if(!this.documento.asunto || this.documento.asunto.length==0){
      this.toastr.warning('Se debe ingresar un asunto de documento', 'Acción invalida', {closeButton: true});
      return;
    }
    validate (this.documento).then(errors => {
      if (errors.length > 0) {
        this.invalid = true;
          let mensajes = errors.map(e => e.constraints[Object.keys(e.constraints)[0]]);
            this.toastr.warning(`Los siguientes campos son inválidos: ${mensajes.join('. ')}`, 'Acción inválida', {closeButton: true});

      }else{
        if(this.correlativo_seguimiento && this.documento.codigo==null){
          this.documento.correlativoEntrada = this.nano_seguimiento +'-'+ this.correlativo_seguimiento +'-'+ this.movimiento_seguimiento;
        }

        
        if(this.documento.origen=='INTERNO'){
          if(!this.items || this.items.length==0){
            this.toastr.warning('Lista de dirigidos vacio', 'Acción invalida', {closeButton: true});
            return;
          }
          this.documento.dirigidosTrabajador = this.items;
          this.documento.dirigidosEmpresa = null;
          this.documento.dirigidosRepresentante = null;
        }else if(this.documento.origen=='EXTERNO'){
          if(!this.itemsEmpresa || this.itemsEmpresa.length==0){
            this.toastr.warning('Debe elegir una empresa y representante','Acción invalida',{closeButton:true});
            return;
          }
          this.documento.dirigidosEmpresa = this.itemsEmpresa;
          this.documento.dirigidosTrabajador = this.items;
        }else return;

        if(this.tipoFlujo=='A'){
          
          this.firmante.area = this.areaAux;
          this.dirigido.area = this.areaAux;
    
          if(!this.dirigido || this.dirigido.ficha==0){
            this.toastr.warning('Se debe elegir un visante', 'Acción invalida', {closeButton: true});
            return;
          }
          this.documento.visante= this.dirigido;
          this.documento.firmante = this.firmante;
        
          this.documento.visante.estado = 1;
          this.documento.firmante.estado = 1;
    
          this.documento.visante.estadoModificado = 0;
          this.documento.firmante.estadoModificado = 0;
    
          this.documento.visante.secuencial = null;
          this.documento.firmante.secuencial = null;

          this.documento.visantes=null;
          this.documento.firmanteArea=null;
        }else if(this.tipoFlujo=='O'){
          let bool = true;
          if(!this.listCombos || this.listCombos.length==0){
            this.toastr.warning('Se debe elegir un area visante', 'Acción invalida', {closeButton: true});
            return;
          }
          if(!this.firmanteArea || this.firmanteArea.areaFirmante.codigo==0){
            this.toastr.warning('Se debe elegir un area firmante', 'Acción invalida', {closeButton: true});
            return;
          }
          for(let e of this.listCombos){
            e.trabajador.secuencial=null;
            if(e.areaFirmante.codigo==0)
              bool = false;
            if(e.areaFirmante.codigo==this.firmanteArea.areaFirmante.codigo){
              this.toastr.info('Area firmante esta incluida en la lista de visantes','Acción invalida',{closeButton:true});
              //return;
              this.firmateDuplicado=false;
              //return;
            }
          }
          if(!bool){
            this.toastr.warning('Una area visante esta en blanco','Acción invalida',{closeButton:true});
            return;
          }
          this.documento.visantes = this.listCombos;
          this.documento.firmanteArea = this.firmanteArea;
          this.documento.firmanteArea.nivel = this.listCombos.length + 1;
          this.documento.firmante = null;
          this.documento.visante = null;
          
        }else return;
    
        //console.log(this.documento);
       if(this.documento.observaciones)
        this.documento.observaciones = this.documento.observaciones.trim().toUpperCase();
       if(this.documento.referencia)
        this.documento.referencia = this.documento.referencia.trim().toUpperCase();
       if(this.documento.asunto)
        this.documento.asunto = this.documento.asunto.trim().toUpperCase();
    
    
    
        this.loading = true;
        //console.log(this.documento);
        //<o:p></o:p>
        //Office tags replacement for empty value
        this.documento.contenido=this.documento.contenido.replace(/<o:p[^>]*>/g, ' ').replace(/<\/o:p>/g, ' ');
        //this.documento.contenido=this.documento.contenido.replace("</o:p>","");
        debugger;
        this.bandejaSalidaService.guardarDocumento(this.documento).subscribe(
          (response: Response) => {
            if(response.estado = 'OK') {
            this.loading = false;
            this.textoCambio = false;
            this.envioSignal = false;
            this.documentoRetorno = response.resultado,
            this.documento.numero = response.resultado.numero;
            this.documento.fechaRegistro = response.resultado.fechaRegistro;
            this.documento.codigo = response.resultado.codigo;
            this.documento.nano = response.resultado.nano;
            this.documento.urlDocumento = response.resultado.urlDocumento;
            this.toastr.success('Se ha guardado el documento.', 'Acción completada', {closeButton: true});
            /* if(this.documento.movimiento && this.documento.movimiento.codigo==0 || !this.codigoMovimiento){
              this.router.navigate(['bandeja-salida/editar/' + this.documento.numero]);
            } */
            if(this.documento.movimiento && this.documento.movimiento.codigo==0 || !this.codigoMovimiento){
              this.router.navigate(['bandeja-salida/pendientes/']);
            }
          }else{
            this.toastr.error('Ha ocurrido un error en la ultima accion.', 'Error', {closeButton: true});
            this.loading = false;
          }
        },
        (response: Response) => this.controlarError(response),
        );      
      }
    });
  }
  OnConfirmarDuplicadoButton(){
    console.log("Entro a funcion de swal");
    this.firmateDuplicado= false;
  }
  ChangeTipoFlujo(){
    if(!this.documento.codigo || this.documento.codigo==null)
      return;
    if(this.tipoFlujo=="A"){
      this.firmante = this.documento.areaOrigen.jefe;
      
    }else{
      return;
    }
  }
  OnEliminar(){
    if(this.documento.codigo){
      let mov = null;
      if(this.documento.movimiento){
        mov = this.documento.movimiento.codigo;
      }
      this.bandejaSalidaService.eliminarDocumento(this.documento.numero, mov).subscribe(
        (response : Response) => {
          let resultado = response.estado;
          if(resultado == "OK"){
            this.toastr.info('Documento eliminado', 'Acción completada!', {closeButton: true});
            this.router.navigate(['bandeja-salida/pendientes']);
          }else{
            this.toastr.error('Se presentó un error inesperado en la última acción Error: ' + resultado, 'Error', {closeButton: true})
            this.router.navigate(['bandeja-salida/pendientes']);
          }
        }
      );
      
    }
    
  }
  OnEnviar() {
    if(!this.documento.contenido || this.documento.contenido.trim().length == 0){
      this.toastr.warning('No se puede enviar documento sin contenido ', 'Warning', {closeButton: true});
      return;
    }
    if(this.textoCambio){
      this.toastr.warning('Se debe guardar las modificaciones ', 'Warning', {closeButton: true});
      return;
    }
    
    if(this.documento.codigo){
      this.bandejaSalidaService.enviarDocumento(this.documento).subscribe(
        (response : Response) => {
          let resultado = response.resultado;
          //console.log(resultado);
          if(resultado == "Documento Enviado"){
            this.toastr.success('El documento ha sido enviado', 'Acción completada!', {closeButton: true});
            this.router.navigate(['bandeja-salida/pendientes']);
          }else{
            this.toastr.error('Se presentó un error inesperado en la última acción Error: ' + resultado, 'Error', {closeButton: true})
            this.router.navigate(['bandeja-salida/pendientes']);
          }
        },
        (response: Response) => this.controlarError(response),
      );
      }
    }

  OnRegresar() {
    this.router.navigate(['bandeja-salida/pendientes']);
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
  agregarItem(term) {
    return {codigo: 0, nombre: term};
  }

  editor(e) {
    console.log('editor:', e);
  }
  OnSeleccionarAsunto() {
    if (this.dialogItemAsunto != null) {
      this.documento.asunto = this.dialogItemAsunto.descripcion;
    } 
  }

  reset(){
    this.firmanteArea.areaFirmante = new Area();
  }
  
  modelChanged(area: Area){
    let codigo = area.codigo;
    let index = this.listCombos.length;
    if(codigo==-1){
        this.reset();
    }else{
        //let i = 0;
        /*for(i;i<this.listCombos.length;i++){
            this.areaAux = this.listCombos[i].areaFirmante;
            if(this.areaAux.codigo!=0 && codigo==this.areaAux.codigo){
                i=-1;
                break;
            }
        }*/
        /*if(i!=-1){*/
          if(this.listCombos[this.listCombos.length-1].areaFirmante.codigo==this.firmanteArea.areaFirmante.codigo){
            this.toastr.info('Area firmante seleccionada esta asignada como ultimo vistante','Informacion',{closeButton:true});
            this.reset();
            return;
          }
          this.firmanteArea.areaFirmante.codigo=codigo;
          this.ObtenerTrabajadorFirmante(index);
        /*}else{
            this.toastr.info('Area firmante esta incluida en la lista de visantes','Informacion',{closeButton:true});
            this.reset();
        }*/
    }
  }


  ObtenerTrabajadorFirmante(index: number){
      this.firmanteArea.trabajador = null;
      //this.areasService.obtenerJefe(this.firmanteArea.areaFirmante.codigo).subscribe(
      //this.parametrosService.
      let codigo = this.firmanteArea.areaFirmante.codigo;
      this.parametrosService.buscarJefe({codigo}).subscribe(
      //this.areasService.obtenerJefe(this.firmanteArea.areaFirmante.codigo).subscribe(
        (response : Response) => {
          this.firmanteArea.trabajador = response.resultado;
          if(this.firmanteArea.trabajador==null){
              this.firmanteArea.areaFirmante = new Area();
              this.toastr.info('El area no contiene un jefe', 'Informacion', {closeButton: true});
              return;
          }else{
            this.firmanteArea.nivel = index+1;
            this.firmanteArea.trabajador.estado = 1,
            this.firmanteArea.trabajador.estadoModificado = 0;
          }
        }
      );
  } 
  deleteRegister(index: number){
      this.items.splice(index,1)[0];
  }
  deleteRegisterEmpresa(index: number){
      this.itemsEmpresa[0].representantes.splice(index,1)[0];
      this.itemsEmpresa.splice(index,1)[0];
  }
  deleteRegisterVisante(index : number){
    this.listCombos.splice(index,1);
  }
  AgregarComponente(){
    
    if(this.areaGrupoDestino && this.areaGrupoDestino.areaGrupo=="G"){
      this.ObtenerGrupo();
      return;
    }
    if(!this.areaGrupoDestino || this.areaGrupoDestino.codigo==0){
      this.toastr.info('Se debe elegir una area', 'Informacion', {closeButton: true});
      return;
    }
    if(!this.documento.trabajadorDestino || this.documento.trabajadorDestino.ficha==0){
      this.toastr.info('Se debe elegir un trabajador', 'Informacion', {closeButton: true});
      return;
    }
    let num  = this.documento.trabajadorDestino.ficha;
    if(this.areaGrupoDestino && this.documento.trabajadorDestino){
      let obj = this.items.find(function(element){
        return element.ficha==num;
      });
      if(obj !== undefined){ 
        this.toastr.info('El trabajador seleccionado ya ha sido agregado', 'Informacion', {closeButton: true});
        this.documento.trabajadorDestino = new Trabajador();
        if(this.documento.origen=='INTERNO'){
          this.NgSelectComponent_1.focus();
        }else{
          this.NgSelectComponent_2.focus();
        }
        return;
      }else if(this.documento.trabajadorDestino){
        this.documento.trabajadorDestino.estado = 1;
        this.documento.trabajadorDestino.estadoModificado=0;
        let area : Area = new Area();
        area.abreviatura = this.areaGrupoDestino.abreviatura;
        area.codigo = this.areaGrupoDestino.codigo;
        area.descripcion = this.areaGrupoDestino.descripcion;
        this.documento.trabajadorDestino.area =area;  
        this.items.push(this.documento.trabajadorDestino); 
        this.documento.trabajadorDestino = new Trabajador();
        if(this.documento.origen=='INTERNO'){
          this.NgSelectComponent_1.focus();
        }else{
          this.NgSelectComponent_2.focus();
        }
        
        return;
      }
    }
  }
  AgregarComponenteEmpresa(){
    if(!this.documento.representanteDestino || this.documento.representanteDestino.codigo==0){
      this.toastr.info('Se debe elegir una empresa', 'Informacion', {closeButton: true});
      return;
    }
    if(!this.documento.representanteDestino || this.documento.representanteDestino.codigo==0){
      this.toastr.info('Se debe elegir un representante', 'Informacion', {closeButton: true});
      return;
    }
    if(this.documento.empresaDestino && this.documento.representanteDestino){
      this.documento.empresaDestino.representantes = new Array<Representante>();
      this.documento.representanteDestino.estado=Estado.ACTIVO;
      this.documento.representanteDestino.estadoModificado=0;
      this.documento.representanteDestino.estadoRepresentante=1;
      this.documento.empresaDestino.representantes.push(this.documento.representanteDestino)
      this.itemsEmpresa.push(this.documento.empresaDestino);
    }
  }
  visanteAreaChange(trabajador : Trabajador){
    if(this.firmante.ficha == trabajador.ficha){
      this.dirigido = new Trabajador();
      this.toastr.info('El visante seleccionado no puede ser el jefe de area', 'Informacion', {closeButton: true});
    }
  }
  
  OnAgregarComponenteBox(){
    this.iTemFirmante = new DocumentoFirmante();
    this.iTemFirmante.tipoFirma=TipoFirma.VISADO;
    this.listCombos.push(this.iTemFirmante);
  }
  OnCambiarDerivado(searchValue : string) {
    let descripcion = searchValue;
    if (descripcion != null && descripcion.length>=3) {
        if(this.subscription) {
          this.subscription.unsubscribe;
        }
        //this.bandejaSalidaService.cambiarRemitente({descripcion}, 1, 100).subscribe(
        this.parametrosService.buscarEmpresa({descripcion}).subscribe(  
        (response: Response) => {this.empresas = response.resultado;
          
        },

        (response: Response) => this.controlarError(response),
      );
    }
  }
  

  OnCambiarRepresentantes(){
    if(!this.documento.empresaDestino){
      this.representantes=new Array<Representante>();
      this.documento.representanteDestino = new Representante();
      return;
    }
      
    this.documento.representanteDestino = new Representante();
    this.cargaDirigido = true;
    let codigo = this.documento.empresaDestino.codigo;
    //this.empresasService.buscarPorCodigo(this.documento.empresaDestino.codigo).subscribe(
      this.parametrosService.buscarRepresentante({codigo}).subscribe(  
    (response: Response) => {
      
        //this.representantes = response.resultado.representantes;
        this.representantes = response.resultado;
        if(this.representantes  && this.representantes.length>0)
          this.documento.representanteDestino = this.representantes[0];
        this.cargaDirigido = false;
        if(this.cargaSeguimiento){
          this.loading= false;
          let representante =  this.representantes.find((x => x.codigo == this.representante_seguimiento))
          let empresa : Empresa;
          empresa = this.documento.empresaDestino;
          empresa.representantes.push(representante);
          this.itemsEmpresa.push(empresa);
          this.cargaSeguimiento = false;
        }
      },
      (response: Response) => this.controlarError(response),
    );
  }
  OnChageText(newValue){
    if(newValue && newValue!=this.documento.contenido){
      this.textoCambio = true;
    }
  }
  Validar(event) {
    validate(this.documento).then( errors => {
      this.errors = {};
      this.invalid = errors.length > 0;
      if (errors.length > 0) {
        errors.map(e => {
          this.errors[e.property] = e.constraints[Object.keys(e.constraints)[0]];
        });
      }
    });
  }
}
