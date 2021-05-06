import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { environment} from '../../../../environments/environment';
import { TipoDocumento, Empresa, Area, Documento, DocumentoAdjunto, DocumentoDirigido, Response, UploadResponse, ParametrosMesaPartes, Representante, Asunto, Trabajador} from '../../../models';
import { MesaPartesService, EmpresasService, FileServerService} from '../../../services';
import { EstadoDocumento, TipoArchivo, NivelError } from '../../../models/enums';
import { SessionService } from 'src/app/auth/session.service';
import { initChangeDetectorIfExisting } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'mesa-partes-registar',
  templateUrl: 'registrar.template.html',
  styleUrls: ['registrar.component.scss']
})
export class RegistrarDocumentoComponent implements OnInit {
  private value:any = {};
  nano: number;
  correlativo: number;
  loading: boolean;
  private sub: any;
  documento = new Documento();
  tiposDocumento: TipoDocumento[];
  empresas: Empresa[];
  empresa: Empresa;
  representantes: Representante[];
  representante: Representante;
  destinos: Area[];
  dirigidos: DocumentoDirigido[];
  dirigido: Empresa = new Empresa();
  parametrosMesaPartes : ParametrosMesaPartes;
  docAnterior: string;
  /* valor del cuadro de diálogo Seleccionar Asunto */
  dialogItemAsunto: Asunto;
  /* indicador de nuevo remitente */
  nuevoRemitente: boolean;
  anexo: DocumentoAdjunto;
  anexos: DocumentoAdjunto[];
  subscription = new Subscription;
  documentoDirigido: DocumentoDirigido;
  areaAux : Area[];
  //trabajadorAux : Trabajador[];
  ocultarRepresentante: boolean;
  areaPrincipal: Area;
  nanoPrincipal: number;
  empresaNueva = new Empresa();
  representanteNuevo = new Representante();
  cambiaFechaRecepcion: boolean = true;  
  periodos: number[];
  permiteGrabar: Boolean;

  nanoEntrada : number;
  numeroEntrada : number;

  
  file_aux : HTMLInputElement;
  file_name : string;


  constructor(private router: Router,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private empresasService: EmpresasService,
              private route: ActivatedRoute,
              private bandejaService: MesaPartesService,
              private session:SessionService,
              private bandejaFileServerService: FileServerService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.empresa = new Empresa();
    this.documento.remitente = new Empresa();
    this.documento.representante = new Representante();
  }

  ngOnInit() {
    this.loading = true;
    this.permiteGrabar = true; 
    this.periodos = new Array<number>();
    this.areaPrincipal = new Area();
    this.areaPrincipal.descripcion = this.session.User.descArea;
    this.nanoPrincipal = (+((new Date()).toISOString().substr(0,4)));
    this.ocultarRepresentante = true;
    this.nuevoRemitente = false;
    this.documento.tipoDocumento = new TipoDocumento();
    this.documento.areaOrigen = new Area();
    this.documento.dirigidos = new Array<DocumentoDirigido>();
    this.documento.urlDocumento='';
    this.bandejaService.cargarParametros().subscribe(
      (response: Response) => {
        this.tiposDocumento = response.resultado.listaTiposDocumento;
        this.destinos = response.resultado.listaArea;
        this.periodos = response.resultado.listaPeriodos;
        this.loading = false;
      },
      (error) => {
        this.toastr.error('No se pudo obtener los parámetros de este formulario. Por favor intente nuevamente.', 'Error', {closeButton: true});
        this.router.navigate(['mesa-partes']);
      }
    );

    this.sub = this.route.params.subscribe(params => {
      this.nano = + params['nano'];
      this.correlativo = + params['correlativo'];
      this.anexos = new Array<DocumentoAdjunto>();
    })

    if (this.nano && this.correlativo) {
      this.loading = true;
      this.bandejaService.obtenerDocumento(this.nano, this.correlativo).subscribe(
        (response: Response) => {
          this.cambiaFechaRecepcion=false;
          this.documento = response.resultado;
          this.nanoPrincipal = this.documento.nano;
          this.areaPrincipal = this.documento.areaPrincipal;
          this.docAnterior = this.documento.urlDocumento;
          if(this.docAnterior!=null && this.docAnterior!='VACIO'){
            this.file_name = 'Archivo Cargado';
          }else{
            this.file_name = 'VACIO';
            this.file_aux = null;
          }
          if (this.documento.dirigidos_to.length) {
            this.areaAux = new Array<Area>();
            this.documento.dirigidos_to.forEach((e) => {
              e.area.jefe = e.trabajador;
              e.trabajador.area = null;
              this.areaAux.push(e.area);  
            });
          }
          this.documento.opcion="3";
          this.anexos=this.documento.anexos||[];
          /*Nuevo Adjun*/
         /*  this.file_anexos_doc= this.documento.anexos||[]; */
          /**/
        this.ocultarRepresentante = false;
        this.loading = false;
      },
        (error) => this.controlarError(error)
      );
    } else {
      this.documento = this.bandejaService.crearDocumento();
      this.documento.observaciones="";
      this.documento.referencia="";
      this.documento.asunto="";  
      this.documento.urlDocumento=null;
      this.docAnterior=null;
      this.documento.dirigidos_cc=null;
      this.documento.dirigidos_to=new Array<DocumentoDirigido>();
      this.documento.dirigidos_cc = new Array<DocumentoDirigido>();
      this.documento.dirigidos_to = new Array<DocumentoDirigido>();
      this.documento.accionesstr='03';
      this.documento.plazo=1;
      this.OnCambiarPlazo();
      this.ocultarRepresentante = true;
      this.documento.estado=EstadoDocumento.INGRESADO;
      this.nuevoRemitente=false;
      this.documento.documentoEntrada='';
    }
  }

  OnAgregar(){
    var dd: DocumentoDirigido;
    this.documento.dirigidos_to = new Array<DocumentoDirigido>();
    this.areaAux.forEach((e)=>{
      dd = new DocumentoDirigido();
      dd.area=e;
      dd.trabajador=e.jefe;
      dd.tipo='AA';
      this.documento.dirigidos_to.push(dd);
    });
  }

  onSearchChange(searchValue : string ) {
    console.log(searchValue);
  }

  OnFechaDocumento() {
    if(this.documento.fechaDocumento==null) {
      this.documento.fechaDocumento= new Date();
    } else {
      if(this.documento.fechaDocumento.toString()=='Invalid Date') {
        this.documento.fechaDocumento= new Date();
      }
    }
  }

  OnFechaRecepcion() {
    if(this.cambiaFechaRecepcion==false) {
      this.cambiaFechaRecepcion=true;
      return;
    }
    if(this.documento.fechaRecepcion==null) {
      this.documento.fechaRecepcion= new Date();
    } else {
      if(this.documento.fechaRecepcion.toString()=='Invalid Date') {
        this.documento.fechaRecepcion= new Date();
      }
    }
      this.OnCambiarPlazo();
  }

  OnCambiarPlazo() {
    if (!this.documento.plazo) {
      this.documento.plazo = 1;
    }
    if (this.documento.plazo<=0) {
      this.documento.plazo = 1;
    }
    if (this.documento.plazo>environment.max_valor_plazo) {
      this.documento.plazo = environment.max_valor_plazo;
    }
    if (this.documento.fechaRecepcion) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      
      this.subscription = this.bandejaService.calcularFechaPlazo(this.documento.fechaRecepcion, this.documento.plazo).subscribe(
        (response:Response) => {
          this.documento.fechaPlazo = response.resultado,
            (error) => this.controlarError(error)
        }
      );
    }
  }

  OnSeleccionarAsunto() {
    if (this.dialogItemAsunto != null) {
      this.documento.asunto = this.dialogItemAsunto.descripcion;
    }
  }

  OnCambiarRemitente(searchValue : string) {
  let descripcion = searchValue;
  //if (this.nuevoRemitente) { return; }
  if (descripcion != null && descripcion.length>=3) {
    if(this.subscription) {
      this.subscription.unsubscribe;
    }    
    this.subscription = this.bandejaService.cambiarRemitente({descripcion}, 1, 100).subscribe(
      (response: Response) => {
        this.empresas = response.resultado;
        if (this.empresas.length>0) {
          this.nuevoRemitente=false;
          this.ocultarRepresentante=false;          
        } else {
          this.ocultarRepresentante=true;
          this.empresas = new Array<Empresa>(); 
          this.representantes = new Array<Representante>();
          this.documento.remitente = new Empresa();
          this.documento.representante = new Representante();
          this.documento.remitente.codigo=0;
          this.documento.remitente.descripcion=searchValue.toUpperCase();
          this.documento.remitente.estado='ACTIVO';
          this.documento.representante.estado='ACTIVO';
          this.documento.representante.codigo=0;
          this.documento.representante.nombre=searchValue.toUpperCase();
          this.empresas.push(this.documento.remitente);
          this.representantes.push(this.documento.representante);
          this.ocultarRepresentante=false;
          this.nuevoRemitente=true;
        }
      },
      (error) => this.controlarError(error)
    );
  }
}

  OnSalirEmpresa() {
    if(this.empresas.length==0) {
      this.empresas.push(this.empresaNueva);
    }
    if(this.representantes.length==0) {
      this.representantes.push(this.representanteNuevo);
    }
  }

  OnCambiarRepresentantes(valor: any) {
    if(this.nuevoRemitente==false) {
      if(this.documento.remitente!=null) {    
        this.bandejaService.cambiarRepresentantes(valor.codigo).subscribe(
          (response: Response) => 
            {
              this.representantes = response.resultado,
              this.documento.representante = this.representantes[0];
            },
          (error) => this.controlarError(error)
        );
      } else {
        this.documento.representante=null;
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

  /* agregar nuevo remitente con texto ingresado en ng-select */
  OnAgregarRemitente(term: string) {
    const empresa =  new Empresa();
    const representante = new Representante();
    representante.codigo=0;
    representante.nombre = term.toUpperCase();
    representante.estado = 'ACTIVO';
    empresa.codigo = 0;
    empresa.descripcion = term.toUpperCase();
    empresa.estado = 'ACTIVO';
    this.representanteNuevo = representante;
    this.empresaNueva = empresa;
    this.nuevoRemitente=true;
    return empresa;
  }

  OnCambiarDirigido() {
    let i=0;
  }

  OnGuardar() {
    console.log(this.documento);
    
    if(this.permiteGrabar==true) {
      this.documento.accionesstr='03';
      this.documento.nano = this.nano;
      this.documento.correlativo = this.correlativo;
      let i = 0;
      let longitud = 0;
      if (this.anexos != null) {
        let longitud = this.anexos.length;
      } else {
        let longitud = 0;
      }
      if (longitud > 0) {
        for (i = 0; i <= longitud; i++) {
          this.bandejaService.eliminarAnexo(this.anexos[i]).subscribe(
            (response:Response) => {
              let obj = response.resultado;
              if (i == longitud) {
                this.guardarCabecera();
              }
            },
            (error) => this.controlarError(error)
          );
        }        
      } else {
        this.guardarCabecera();
      }
    }
  }

  OnValidarCampos() {
    this.permiteGrabar=true;
    console.log(this.documento);
    if(!this.documento.tipoDocumento.codigo) {
      this.toastr.warning('No se ha seleccionado un Tipo de Documento', 'Acción inválida', {closeButton: true});
      this.permiteGrabar=false;
      return;
    }

    if((this.documento.numero==null) || this.documento.numero.length==0) {
      this.toastr.warning('No se ha ingresado el Número de Documento', 'Acción inválida', {closeButton: true});
      this.permiteGrabar=false;
      return false;
    }

    if(!this.documento.remitente || this.documento.remitente.codigo==null) {
      this.toastr.warning('No se ha especificado el Remitente', 'Acción inválida', {closeButton: true});
      return false;
    }

    if(!this.documento.representante || this.documento.representante.codigo==null ) {
      /*this.documento.representante.codigo==null*/ 
      this.toastr.warning('No se ha especificado el Representante', 'Acción inválida', {closeButton: true});
      return false;
    }   

    if((!this.documento.dirigidos_to) || this.documento.dirigidos_to.length==0) {
      this.toastr.warning('No se ingresaron las Áreas de Destino en el campo Dirigido A:', 'Acción inválida', {closeButton: true});
      this.permiteGrabar=false;
      return false;
    }

    if(this.documento.asunto && this.documento.asunto.trim()==""){
      this.toastr.warning('No se ha especificado el Asunto de Documento', 'Acción inválida', {closeButton: true});
      this.permiteGrabar=false;
      return false;
    }
    if((this.documento.asunto==null) || this.documento.asunto.length==0) {
      this.toastr.warning('No se ha especificado el Asunto de Documento', 'Acción inválida', {closeButton: true});
      this.permiteGrabar=false;
      return false;
    }

    
    if(this.documento.documentoEntrada && this.documento.documentoEntrada.toString().trim().length>0 && this.documento.nanoEntrada) {
      /*this.bandejaService.validarEntrante(+this.documento.nanoEntrada, +this.documento.documentoEntrada).subscribe(
        (response:Response) => {
          if (response.resultado == 1) {
            this.permiteGrabar=true;
            this.OnGuardar();
            return;
          } else {
            this.permiteGrabar=false;
            this.toastr.warning('No se encuentra el documento de referencia indicado', 'Acción inválida', {closeButton: true});
            return;
          }
        },
        (error) => {
          this.controlarError(error);
          this.permiteGrabar=false;
          return;
        }
      );*/
      this.permiteGrabar=true;
      this.OnGuardar();
      return;
    } else {
      this.documento.nanoEntrada = null;
      this.documento.documentoEntrada = null;
      this.permiteGrabar=true;
      this.OnGuardar();
      return;
    }
  }

  OnGuardarEmpresa() {
    this.representantes[0].estadoModificado=1;
    this.representantes[0].estadoRepresentante=0;
    this.documento.remitente.representantes[0]= (this.representantes[0]);
    this.empresasService.guardar(this.documento.remitente).subscribe(
      (response: Response) => {
        this.documento.remitente = response.resultado;
        this.documento.representante = this.documento.remitente.representantes[0];
        this.OnAdjuntar();
        //this.guardarDocumento();
      },
      (error) => this.controlarError(error)
    );
  }
  
  guardarDocumento(){
    if(this.documento.numero)
      this.documento.numero = this.documento.numero.trim().toUpperCase();
    if(this.documento.referencia)
      this.documento.referencia = this.documento.referencia.trim().toUpperCase();
    if(this.documento.observaciones)
      this.documento.observaciones = this.documento.observaciones.trim().toUpperCase();
    if(this.documento.asunto)
     this.documento.asunto = this.documento.asunto.trim().toUpperCase();
    this.loading = true;
    console.log("Documento a Guardar: ");
    console.log(this.documento);
    this.bandejaService.guardarDocumento(this.documento).subscribe(
      (response: Response) => {
        this.documento.nano = response.resultado.nano;
        this.documento.correlativo = response.resultado.correlativo;
        if(this.documento.urlDocumento!=null && this.documento.urlDocumento!=this.docAnterior) {
          this.bandejaService.actualizarArchivo(this.documento, this.documento.nano, this.documento.correlativo).subscribe(
            (data: any) => {
              console.log("Archivo Actualizado");
              this.router.navigate(['mesa-partes']);
              this.toastr.success('El documento se guardó correctamente', 'Acción completada!', {closeButton: true});
            },
            (error) => this.controlarError(error)
          );
        }else{
          this.router.navigate(['mesa-partes']);
        }
        this.actualizarAnexos();
      },
      (error) => this.controlarError(error)
    );
  }

  guardarCabecera() {
    console.log(this.nuevoRemitente);
    /*Verificacion de Documento entrante*/
    if(this.numeroEntrada || this.nanoEntrada){
      if( typeof(this.numeroEntrada)!='number'){
       var isnum = /^\d+$/.test(this.numeroEntrada);
        if(isnum){
           this.numeroEntrada = Number.parseInt(this.numeroEntrada);
         /*   console.log(this.numeroEntrada); */
        }else{
           this.toastr.warning('Registro de entrada ingresado inválido', 'Acción inválida');
           return;
         }
       }
       if((!this.nanoEntrada && this.numeroEntrada)){
         this.toastr.warning('No se ha seleccionado un año para el registro de entrada ingresado', 'Acción inválida');
         return;
       }else
       if(this.nanoEntrada && !this.numeroEntrada){
         this.toastr.warning('No se ha ingresado un registro de entrada', 'Acción inválida');
         return;
       }
       this.documento.documentoEntrada = "" +this.numeroEntrada;
       this.documento.nanoEntrada = this.nanoEntrada;
     }  
    /*Fin*/
    if(this.nuevoRemitente){
      this.OnGuardarEmpresa();
    }else{
      this.OnAdjuntar();
      //this.guardarDocumento();
    }
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.loading = false;
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }

  actualizarAnexos() {
    if(this.anexos!=null) {
      let longitud = this.anexos.length;
      let i = 0;
      for(i=0;i<longitud;i++) {
        this.anexos[i].nano=this.documento.nano;
        this.anexos[i].correlativo=this.documento.correlativo;
        this.bandejaService.guardarAnexo(this.anexos[i]).subscribe(
          (response: Response) => {
            console.log("Anexo Guardado");
          },
          (error) => this.controlarError(error)
        )
      }
    }
  }

  GuardarFile(file: HTMLInputElement){
    if(!this.bandejaFileServerService.validateFile(file)){
      this.toastr.warning('Debe seleccionar un archivo PDF, XLSX, XLS, DOCX, DOC o IMG', 'Archivo Inválido');
      return;
    }
    this.file_aux = file;
    this.file_name = this.file_aux.files[0].name;
  }

  /* file: HTMLInputElement */
  OnAdjuntar() {
    if(this.file_aux){
      var lista: Array<string>;
      lista = new Array<string>();

      /* if(!this.bandejaFileServerService.validateFile(this.file_aux)){
        this.toastr.warning('Debe seleccionar un archivo PDF, XLSX, XLS, DOCX, DOC o IMG', 'Archivo Inválido');
        return;
      } */
      //Cancelar carga de archivo anterior
      if(this.subscription){
        this.subscription.unsubscribe;
      }
      this.docAnterior = this.documento.urlDocumento;
      if(this.docAnterior!=null && this.docAnterior!='VACIO') {
        //let index = this.docAnterior.lastIndexOf('/');
        let array_url = this.docAnterior.split('/');
        let url = array_url.pop();
        let path = array_url.pop();
        /* lista.push(this.docAnterior.replace(environment.serviceFileServerEndPoint+"/","")); */
        lista.push(path+'/'+url);
        this.bandejaFileServerService.deleteFiles(lista).subscribe(
          (response: Response) => {
            console.log(response.resultado);
            this.OnSubirArchivo(this.file_aux);
          },
            (error) => this.controlarError(error)
          );
      }else{
        this.OnSubirArchivo(this.file_aux);
      }
    }else{
      this.guardarDocumento();
    }
  }

  OnSubirArchivo(file: HTMLInputElement){
    this.bandejaFileServerService.uploadFile(file, environment.pathMesaPartes).subscribe(
      (response : UploadResponse) => {
        this.documento.urlDocumento = response.url;
        this.guardarDocumento();
        this.toastr.info('El archivo se cargó correctamente.', 'Carga completa', {closeButton: true});
      },
      (error) => this.controlarError(error)
    );
  }

  OnEliminarAnexo(id) {
    let indice = new DocumentoAdjunto();
    indice = this.anexos.find(x => x.nombre === id);
    this.docAnterior = indice.ubicacion;
    var lista: Array<string>;
    lista = new Array<string>();
    
    /* Obtiene url*/
    let array_url = this.docAnterior.split('/');
    let url = array_url.pop(); //Nombre de archivo
    let path = array_url.pop(); //Carpeta de archivo
    
    /* lista.push(this.docAnterior.replace(environment.serviceFileServerEndPoint+"/","")); */
    lista.push(path+'/'+url);
    this.bandejaFileServerService.deleteFiles(lista).subscribe(
      (response: Response) => {
        this.anexos.splice(this.anexos.indexOf(indice),1);
        this.bandejaService.eliminarAnexo(indice).subscribe(
          (response:Response) => {
            let obj = response.resultado;
            this.toastr.info('Se eliminó el anexo', 'Acción completada', {closeButton: true});
          },
          (error) => this.controlarError(error)
        );
      },
      (error) => this.controlarError(error)
    );
  }

/**/ 
  /* Nuevo Anexo */

  /* file_anexos: HTMLInputElement[] = new Array<HTMLInputElement>();
  file_anexos_doc: DocumentoAdjunto[] = new Array<DocumentoAdjunto>();
  OnAdjuntarAnexoTemp(file: HTMLInputElement){
    if(!this.file_anexos){
      this.file_anexos = new Array<HTMLInputElement>();
    }
    if(!this.file_anexos_doc){
      this.file_anexos_doc = new Array<DocumentoAdjunto>();
    }
    let doc_anx = new DocumentoAdjunto();
    doc_anx.ubicacion='VACIO';
    this.file_anexos_doc.push(doc_anx);
    this.file_anexos.push(file);
  }
  OnEliminarAnexoTemp(index:number){
    if(this.file_anexos && this.file_anexos.length>0){
      this.file_anexos.slice(index,1);
    }

    if(this.file_anexos_doc && this.file_anexos_doc.length>0){
      if(this.file_anexos[])
      this.file_anexos_doc.slice(index,1);
    }
  }

  OnAdjuntarAnexos(file: HTMLInputElement[]){
    return;
  } */
/**/

  OnAdjuntarAnexo(file2: HTMLInputElement) {
    if(!this.bandejaFileServerService.validateFile(file2)){
      this.toastr.warning('Debe seleccionar un archivo PDF, XLSX, XLS, DOCX, DOC o IMG', 'Archivo Inválido');
      file2.value='';
      return;
    }
    if(file2.files[0]) {
      this.bandejaFileServerService.uploadFile(file2, environment.pathMesaPartes).subscribe(
        (response : UploadResponse) => {
          if(response.url) {
            this.anexo = new DocumentoAdjunto();
            this.anexo.ubicacion = response.url;
            this.anexo.extension = response.extension;
            this.anexo.nombre = response.nombre;
            this.anexo.nombreReal = response.nombreReal;
            this.anexo.anterior = response.anterior;
            this.anexo.nano = this.documento.nano;
            this.anexo.correlativo = this.documento.correlativo;
            this.anexo.estado='I';
            this.anexo.usuario=this.session.User.codUsuario;
            this.anexos.push(this.anexo);
            this.toastr.info('El anexo se cargó correctamente', 'Carga completa', {closeButton: true});
          }
        },
        (error) => this.controlarError(error)
      );
    }
  }

  onDescartar() {
    var lista: Array<string>;
    lista = new Array<string>();
    let i = 0;
    let longitud = 0;
    if(this.anexos!=null) {
      longitud=this.anexos.length;
    } else {
      longitud = 0;
    }
    if(longitud>0) {
      for(i=0;i<=this.anexos.length-1;i++) {
        if(this.anexos[i].anterior==0) {          
          this.bandejaService.eliminarAnexo(this.anexos[i]).subscribe(
            (response:Response) => {
              let obj = response.resultado;
              lista.push(this.anexos[i].ubicacion.replace(environment.serviceFileServerEndPoint+"/",""));
            },
            (error) => this.controlarError(error)
          );
        }
      }
      this.bandejaFileServerService.deleteFiles(lista).subscribe(
        (response: Response) => {
          console.log(response.resultado);
        },
        (error) => this.controlarError(error)
      );
    }
    //if(this.documento.urlDocumento!=this.docAnterior) {
    if(this.file_aux && this.documento.urlDocumento!=this.docAnterior) {  
      lista = new Array<string>();
      lista.push(this.documento.urlDocumento.replace(environment.serviceFileServerEndPoint+"/",""));
      this.bandejaFileServerService.deleteFiles(lista).subscribe(
        (response: Response) => {
          console.log(response.resultado);
        },
        (error) => this.controlarError(error)
      );
    }
    if (this.nano) {
      this.toastr.info('Se descartó la actualización del documento', 'Confirmación', {closeButton: true});
    }
    this.router.navigate(['mesa-partes']);
  }

  OnFolios() {
    if(!this.documento.folios || this.documento.folios<0) {
      this.documento.folios=0;
    }
  }
}
