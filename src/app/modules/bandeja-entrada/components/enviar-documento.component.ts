import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {FiltroTrabajador, Area, DocumentoSeguimiento, Trabajador, TipoDocumento, ParametrosPendientes, Response, DocumentoDirigido, UploadResponse} from '../../../models';
import {AccionDocumento, AccionesDocumento, AccionesChecked, EstadoDocumento, NivelError, TipoArchivo} from '../../../models/enums';
import {BandejaEntradaRecibidosService, TrabajadoresService, FileServerService} from '../../../services';
import {environment} from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/auth/session.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'bandeja-entrada-enviar-documento',
  templateUrl: 'enviar-documento.template.html'
})
export class EnviarDocumentoComponent implements OnInit {

  @Input()
  listaAreas: Area[];
  @Input()
  listaTrabajadores: Trabajador[];
  @Input()
  listaTipoDocumentos: TipoDocumento[];
  @Input()
  seguimiento: DocumentoSeguimiento;
  @Output()
  ready = new EventEmitter();
  @Output()
  cambiarArea = new EventEmitter<Area>();
  @Output()
  guardar = new EventEmitter<DocumentoSeguimiento>();
  @Output()
  cancelar = new EventEmitter();

  @Output()
  enviar = new EventEmitter();
  subscription: Subscription;
  acciones: Map<AccionDocumento, string>;
  seleccionados: AccionDocumento[];
  cadenaAcciones: string ='03';
  filtroTrabajador: FiltroTrabajador;
  itemDerivado: {area: Area, trabajador: Trabajador};
  fechaDerivacion: Date;
  fechaPlazo: Date;
  derivados = [];
  parametros: ParametrosPendientes;
  conPlazo : Map<string,string>;
  editarPlazo : boolean;
  nuevoSeguimiento: DocumentoSeguimiento;
  documentoAdjunto: string;
  observacion: string;
  docAnterior:string;
  archivoName: string;
  cargaAdjunto : boolean;
  i: number;
  conPlazoTest='NO';
  _location: Location;
  loading : boolean;
  cargaTrabajadores : boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bandejaService: BandejaEntradaRecibidosService,
    private trabajadoresService: TrabajadoresService,
    private toastr: ToastrService,
    private session: SessionService,
    private bandejaFileServerService: FileServerService) {
      
    }

  ngOnInit() {
    this.loading = true;
    this.nuevoSeguimiento = new DocumentoSeguimiento();
    this.nuevoSeguimiento = this.seguimiento;
    this.itemDerivado = {area: new Area, trabajador: new Trabajador};
    this.editarPlazo = true;
    this.fechaPlazo = null;
    this.acciones = AccionesDocumento;
    this.seleccionados = new Array<AccionDocumento>();    
    this.seleccionados.push(AccionDocumento.ACCION_NECESARIA);
    this.observacion = '';
    this.nuevoSeguimiento=this.seguimiento;
    this.fechaDerivacion = new Date();
    let code = this.session.User.codArea;
    this.nuevoSeguimiento.urlDocumento = '';
    this.seguimiento.urlDocumento = '';
    console.log(this.nuevoSeguimiento);
    this.bandejaService.obtenerParametros(null).subscribe(
      (response: Response) => {
        this.parametros = response.resultado;
        this.listaAreas = this.parametros.listaArea;
        for(let i = 0; i<this.listaAreas.length; i++){
          if(this.listaAreas[i].codigo==code){
            this.itemDerivado.area = this.listaAreas[i];
            break;
          }
        }
        if(!this.itemDerivado.area || this.itemDerivado.area.codigo==0)
          this.itemDerivado.area = this.listaAreas[0];
        this.loading= false;
        this.OnTrabajadores();
      },
      (response: Response) => this.controlarError(response),
    );
    this.ready.emit();
  }

  OnFechaDerivacion() {
    if(this.fechaDerivacion==null) {
      this.fechaDerivacion= new Date();
    } else {
      if(this.fechaDerivacion.toString().toUpperCase()=='INVALID DATE') {
        this.fechaDerivacion= new Date();
      }
    }
    this.OnPlazo();
  }

  OnFechaPlazo() {
    if (this.fechaPlazo != null) {
      if (this.fechaPlazo.toString().toUpperCase() == 'INVALID DATE') {
        this.fechaPlazo = new Date();
      }
    }
  }

  OnPlazo() {
    if (this.conPlazoTest=='SI') {
      this.fechaPlazo = this.fechaDerivacion;
      this.editarPlazo = false;
    } else {
      this.fechaPlazo =  null;
      this.editarPlazo = true;
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
  
  OnEnviar() {
    if(this.derivados.length==0) {
      this.toastr.warning('No se han especificado las Áreas y Trabajadores de destino', 'Acción inválida', {closeButton: true});
      return;
    }

    if(this.nuevoSeguimiento.urlDocumento==null || this.nuevoSeguimiento.urlDocumento=='')
    {
      this.toastr.warning('Debe adjuntar el archivo asociado al documento', 'Acción inválida', {closeButton: true});
      return;
    }

    if(this.conPlazo && this.fechaPlazo==null) {
      this.toastr.warning('No se ha ingresado la Fecha de Plazo', 'Acción inválida', {closeButton: true});
      return;
    }

    if(this.seleccionados.length==0) {
      this.toastr.warning('No se han especificado las Acciones a realizar', 'Acción inválida', {closeButton: true});
      return;
    }
    let error = false;
    this.nuevoSeguimiento.codmovant = this.nuevoSeguimiento.codmov;
    this.nuevoSeguimiento.acciones=this.seleccionados;
    this.nuevoSeguimiento.fechaDerivacion=this.fechaDerivacion;
    if(this.conPlazo) {
      this.nuevoSeguimiento.plazo = 1;
    } else {
      this.nuevoSeguimiento.plazo = 0;
    }
    this.nuevoSeguimiento.fechaPlazo = this.fechaPlazo;
    this.nuevoSeguimiento.observaciones = this.observacion;
    this.nuevoSeguimiento.dirigidos = new Array<DocumentoDirigido>();
    for(let x=0;x<this.derivados.length;x++){
      let documentoDirigido = new DocumentoDirigido();
      documentoDirigido.area = this.derivados[x].area;
      documentoDirigido.trabajador = this.derivados[x].trabajador;
      this.nuevoSeguimiento.dirigidos.push(documentoDirigido);
    }
    let a = JSON.parse(JSON.stringify(this.nuevoSeguimiento));
    console.log(a);
    this.bandejaService.crearSeguimiento(a).subscribe(
      (response: Response) => {
        this.toastr.success('El documento fue enviado satisfactoriamente', 'Acción completada!', {closeButton: true});
        this.enviar.emit(true);
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

  /* OnCancelar() {
    this.cancelar.emit();
  } */


  OnCancelar() {
    var lista: Array<string>;
    lista = new Array<string>();
    if(this.seguimiento.urlDocumento!=null && this.seguimiento.urlDocumento!='') {
      lista.push(this.seguimiento.urlDocumento.replace(environment.serviceFileServerEndPoint+"/",""));
      this.bandejaFileServerService.deleteFiles(lista).subscribe(
        (response: Response) => {
          console.log(response.resultado);
        },
        (response: Response) => this.controlarError(response),
        );
    }
    this.cancelar.emit();
    //this._location.back();
  }

  private verificarDuplicado(area:Area , trabajador:Trabajador):Boolean {
    let valido = true;
    this.derivados.forEach((e)=>{
      if(e.area.codigo ==area.codigo && e.trabajador.ficha==trabajador.ficha){
        valido = false;
        return valido;
      }
    });
    return valido;
  }

  OnAgregar() {
    let area : Area = this.itemDerivado.area;
    let trabajador :Trabajador = this.itemDerivado.trabajador;
    if(!this.verificarDuplicado(area,trabajador)){
      this.toastr.warning('El área y trabajador especificados ya fueron seleccionados', 'Acción inválida', {closeButton: true});
      return;
    }
    let item = {
      area,trabajador
    };
    this.derivados.push(item);
  }

  OnEliminar(index) {
    this.derivados.splice(index, 1);
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
      
    if(this.nuevoSeguimiento.urlDocumento!=null && this.nuevoSeguimiento.urlDocumento!='' /* && this.nuevoSeguimiento.urlDocumento!=this.docAnterior */) {
      lista.push(this.nuevoSeguimiento.urlDocumento.replace(environment.serviceFileServerEndPoint+"/",""));
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
        this.nuevoSeguimiento.urlDocumento = response.url;
        this.toastr.info('El archivo se cargó correctamente.', 'Carga completa', {closeButton: true});
        console.log(this.documentoAdjunto);
        console.log(this.nuevoSeguimiento.urlDocumento);
      },
      (error) => {
        console.log(error);
        this.toastr.error('Se presentó un problema al cargar el archivo: ', 'Error', {closeButton: true});
      }
    );
  }

  OnTrabajadores() {
    this.filtroTrabajador = new FiltroTrabajador();
    this.filtroTrabajador.area = this.itemDerivado.area.codigo;
    this.cargaTrabajadores = true;
    this.trabajadoresService.listar(this.filtroTrabajador).subscribe(
      (response: Response) => {
        console.log(response);
        this.cargaTrabajadores = false;
        this.listaTrabajadores = response.resultado;
        for(let i = 0; i<this.listaTrabajadores.length; i++){
          if(this.listaTrabajadores[i].jefe==1){
            this.itemDerivado.trabajador = this.listaTrabajadores[i];
            break;
          }
        }
        if(!this.itemDerivado.trabajador || this.itemDerivado.trabajador.ficha==0)
          this.itemDerivado.trabajador = this.listaTrabajadores[0];
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnGenerarAcciones() {
    this.cadenaAcciones='';
    this.seleccionados.forEach((e)=> {
      this.cadenaAcciones = this.cadenaAcciones + e.toString() +  ',';
    });
    this.cadenaAcciones = this.cadenaAcciones.substr(0,this.cadenaAcciones.length - 1);
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }

}
