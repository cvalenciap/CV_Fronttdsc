import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { IBandejaSalidaService } from '../interfaces/ibandeja-salida.service';
import { Documento, DocumentoComentario, Movimiento, Grupo } from '../../models';
import { OrigenDocumento, EstadoDocumento, Estado, PrioridadDocumento } from '../../models/enums';
import { SessionService } from 'src/app/auth/session.service';

@Injectable({
  providedIn: 'root',
})

export class BandejaSalidaService implements IBandejaSalidaService {

    private apiEndpoint: string;
    private apiEndpointExcel: string;
    private apiEndpointPDF: string;
    private apiEndpointDocSal: string;
    private apiEndpointComentarios: string;

    constructor(private http: HttpClient,
                private session: SessionService) {
      this.apiEndpoint = environment.serviceEndpoint + '/bandejas/pendientes';
      this.apiEndpointPDF = environment.serviceEndpoint + '/bandejas/pendientes.pdf';
      this.apiEndpointExcel = environment.serviceEndpoint + '/bandejas/pendientes.xls';
      this.apiEndpointDocSal = environment.serviceEndpoint + '/documentos-salientes';
      this.apiEndpointComentarios = environment.serviceEndpoint + '/comentarios';
    }

    buscarDocumentos(parametros:{
      modalidad?: string,
      usuario?: string,
      perfil?: string,
      correlativo?: string,
      nano?: string,
      asunto?: string;
      origen?: string,
      numeroDocumento?: string;
      referencia?:string;
      remitente?: string;
      area?: string,
      prioridad_alta?: string,
      tipoDocumento?:string, 
      estado?: string,
      dirigido?: string,
      prioridad?: string,
      docEntrada?: string,
      orden?: string,
      campo?: string,
      cadena?: string,
      fechaInicio?: Date,
      fechaFin?: Date}, pagina:number, registros:number) {
      console.log(parametros);
      let params:HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());

      params = params.set('usuario', this.session.User.codFicha.toString());
      params = params.set('area', this.session.User.codArea.toString());
      if (parametros.modalidad) {
        params = params.set('modalidad', parametros.modalidad);
      } else {
        params = params.set('modalidad', "0");
      }
      if (parametros.perfil) {
        params = params.set('perfil', parametros.perfil);
      }
      if (parametros.correlativo) {
        params = params.set('correlativo', parametros.correlativo);
      }
      if (parametros.nano) {
        params = params.set('nano', parametros.nano);
      } else {
        params = params.set('nano', (new Date()).toISOString().substr(0,4));
      }
      if (parametros.origen) {
        params = params.set('origen', parametros.origen);
      }
      if (parametros.remitente) {
        params = params.set('remitente', parametros.remitente);
      }
      if (parametros.prioridad) {
        params = params.set('prioridad', parametros.prioridad);
      }
      if (parametros.numeroDocumento) {
        params = params.set('numeroDocumento', parametros.numeroDocumento);
      }
      if (parametros.estado) {
        params = params.set('estado', parametros.estado);
      }
      if (parametros.asunto) {
        params = params.set('asunto', parametros.asunto);
      }
      if (parametros.dirigido) {
        params = params.set('dirigido', parametros.dirigido);
      }
      if (parametros.referencia) {
        params = params.set('referencia', parametros.referencia);
      }
      if (parametros.tipoDocumento) {
        params = params.set('tipoDocumento', parametros.tipoDocumento);
      }
      if (parametros.docEntrada) {
        params = params.set('docEntrada', parametros.docEntrada);
      }
      if(parametros.fechaFin){
        try {
          params = params.set('fechaFin', parametros.fechaFin.toISOString().substring(0,10));    
        } catch (error) {
          params = params.set('fechaFin', parametros.fechaFin.toString().substring(0,10));
        }
      }
      if(parametros.fechaInicio){
        

        try {
          params = params.set('fechaInicio', parametros.fechaInicio.toISOString().substring(0,10));  
        } catch (error) {
          params = params.set('fechaInicio', parametros.fechaInicio.toString().substring(0,10));
        }
      }
      console.log(params);
      return this.http.get(this.apiEndpoint, {params});
    }

    crearDocumento() {
      const documento = new Documento();
      documento.origen = OrigenDocumento.INTERNO;
      documento.estado = EstadoDocumento.PENDIENTE;
      documento.prioridad = PrioridadDocumento.MEDIA; 
      documento.plazo = 1 ;
      documento.fechaRegistro = new Date();
      documento.fechaDocumento = new Date();
      documento.fechaPlazo = new Date();
      return documento;
    }

    cargarParametros(){
        const url = `${this.apiEndpoint}/parametros`;
        return this.http.get(url);
    }

    obtenerTrabajador(codigo :string){
      const url = `${environment.serviceEndpoint}/trabajadores/?area=${codigo}`;
      return this.http.get(url);
    }

    obtenerTrabajadorGrupo(codigo: number){
      const url = `${this.apiEndpoint}/trabajadores/?grupo=${codigo}`;
      return this.http.get(url);
    }

    calcularFechaPlazo(fechaDocumento: Date, plazo: number) {
      const url = `${this.apiEndpoint}/fecha-vencimiento`;
      let params: HttpParams = new HttpParams()
        .set('fechaInicio', fechaDocumento.toISOString().substring(0,10))
        .set('nPlazo', plazo.toString());
      return this.http.get(url, {params});
    }

    obtenerEmpresas(){
      const url = `${environment.serviceEndpoint}/empresas`;
      return this.http.get(url);
    }

    cambiarRemitente(parametros: {descripcion: string}, pagina: number, registros: number) {
      let params: HttpParams = new HttpParams()
        .set('pagina', "1")
        .set('registros', "100");
      params = params.set('descripcion', parametros.descripcion);
      const url = `${this.apiEndpoint}/empresas`;
      console.log(url);
      return this.http.get(url, {params});
    }

    guardarDocumento(documento : Documento){
      const url = `${this.apiEndpointDocSal}`;
      return this.http.post(url,documento);
    }

    obtenerDocumento(vnumdoc: string){
      const url = `${this.apiEndpointDocSal}/${vnumdoc}`;
      return this.http.get(url);
    }

    buscarPorDocumento(codDocumento: string, codMovimiento: string) {
      let url;
      if(codMovimiento)
        url = `${this.apiEndpointDocSal}/${codDocumento}?codigoMovimiento=${codMovimiento}`;
      else
        url = `${this.apiEndpointDocSal}/${codDocumento}`;
      const urlSend = url;
     return this.http.get(urlSend);
    }

    cargarComentarios(documento: string){
     const url = `${this.apiEndpointComentarios}/${documento}`;
     //console.log(url);
     return this.http.get(url);
    }

    guardarComentarios(codMovimiento :number, descripcion: string ){
     const documentoComentario = new DocumentoComentario();
     documentoComentario.descripcion = descripcion;
     documentoComentario.movimiento = new Movimiento();
     documentoComentario.movimiento.codigo = codMovimiento;

     const url = `${this.apiEndpointComentarios}`;
     return this.http.put(url, documentoComentario);
    }

    eliminarDocumento(codDocumento: string, codMovimiento: string){
      let url;
      if(codMovimiento)
        url = `${this.apiEndpointDocSal}/${codDocumento}?codigoMovimiento=${codMovimiento}`;
      else
        url = `${this.apiEndpointDocSal}/${codDocumento}`;
      const urlSend = url;
      //console.log(urlSend);
      return this.http.delete(urlSend);
    }

    enviarDocumento(documento: Documento){
      const url=`${this.apiEndpointDocSal}/enviar`;
      return this.http.post(url, documento);
    }

    visarDocumento(documento: Documento){
     const url = `${this.apiEndpointDocSal}/visar`;
     return this.http.post(url, documento);
    }

    firmarDocumento(documento: Documento){
     const url = `${this.apiEndpointDocSal}/firmar`;
     return this.http.post(url, documento);
    }

    observarDocumento(documento: Documento){
     const url = `${this.apiEndpointDocSal}/observar`;
     return this.http.post(url, documento);
    }

    verificarCorrelativo(correlativo : Number, nano: Number){
      const url=`${this.apiEndpointDocSal}/verificarCorrelativo/${correlativo}/${nano}`;
      return this.http.get(url);
    }

    generarExcel(parametros: {
      modalidad?: string,
      correlativo?: string,
      nano?: string,
      asunto?: string;
      origen?: string,
      tipoDocumento?: string;
      numeroDocumento?: string;
      fechaInicio?: Date;
      fechaFin?: Date;
      remitente?: string;
      estado?: string,
      prioridad?: string,
      referencia?:string}) {
        let params: HttpParams = new HttpParams()
        .set('pagina', '0')
        .set('registros', '0');

      params = params.set('modalidad', parametros.modalidad);

      if (parametros.correlativo) {
        params = params.set('correlativo', parametros.correlativo);
      }
      if (parametros.nano) {
        params = params.set('nano', parametros.nano);
      }
      if (parametros.origen) {
        params = params.set('origen', parametros.origen);
      }
      if (parametros.remitente) {
        params = params.set('remitente', parametros.remitente);
      }
      if (parametros.prioridad) {
        params = params.set('prioridad', parametros.prioridad);
      }
      if (parametros.tipoDocumento) {
        params = params.set('tipoDocumento', parametros.tipoDocumento);
      }
      if (parametros.numeroDocumento) {
        params = params.set('numeroDocumento', parametros.numeroDocumento);
      }
      if (parametros.estado) {
        params = params.set('estado', parametros.estado);
      }
      if (parametros.referencia) {
        params = params.set('referencia', parametros.referencia);
      }
      if (parametros.asunto) {
        params = params.set('asunto', parametros.asunto);
      }
      if (parametros.fechaInicio) {
        params = params.set('fechaInicio', parametros.fechaInicio.toISOString().substr(0,10));
      }
      if (parametros.fechaFin) {
        params = params.set('fechaFin', parametros.fechaFin.toISOString().substr(0,10));
      }
      const url = `${this.apiEndpointExcel}`;
      return this.http.get(url, {responseType: 'arraybuffer', params: params});
    }

    generarPDF(parametros: {
      modalidad?: string,
      correlativo?: string,
      nano?: string,
      asunto?: string;
      origen?: string,
      tipoDocumento?: string;
      numeroDocumento?: string;
      fechaInicio?: Date;
      fechaFin?: Date;
      remitente?: string;
      estado?: string,
      prioridad?: string,
      referencia?:string}) {
        let params: HttpParams = new HttpParams()
        .set('pagina', '0')
        .set('registros', '0');
      params = params.set('modalidad', parametros.modalidad);
      if (parametros.correlativo) {
        params = params.set('correlativo', parametros.correlativo);
      }
      if (parametros.nano) {
        params = params.set('nano', parametros.nano);
      }
      if (parametros.origen) {
        params = params.set('origen', parametros.origen);
      }
      if (parametros.remitente) {
        params = params.set('remitente', parametros.remitente);
      }
      if (parametros.prioridad) {
        params = params.set('prioridad', parametros.prioridad);
      }
      if (parametros.tipoDocumento) {
        params = params.set('tipoDocumento', parametros.tipoDocumento);
      }
      if (parametros.numeroDocumento) {
        params = params.set('numeroDocumento', parametros.numeroDocumento);
      }
      if (parametros.referencia) {
        params = params.set('referencia', parametros.referencia);
      }
      if (parametros.estado) {
        params = params.set('estado', parametros.estado);
      }
      if (parametros.asunto) {
        params = params.set('asunto', parametros.asunto);
      }
      if (parametros.fechaInicio) {
        params = params.set('fechaInicio', parametros.fechaInicio.toISOString().substr(0,10));
      }
      if (parametros.fechaFin) {
        params = params.set('fechaFin', parametros.fechaFin.toISOString().substr(0,10));
      }
      const url = `${this.apiEndpointPDF}`;
      return this.http.get(url, {responseType: 'arraybuffer', params: params});
    }

   visarDocumentos(documentos: Documento[]){
     const url = `${this.apiEndpointDocSal}/visarDocumentos`;
     return this.http.post(url, documentos);
   }

   firmarDocumentos(documentos: Documento[]){
     const url = `${this.apiEndpointDocSal}/firmarDocumentos`;
     return this.http.post(url, documentos);
   }

   observarDocumentos(documentos: Documento[]){
     const url = `${this.apiEndpointDocSal}/observarDocumentos`;
     return this.http.post(url, documentos);
   }
}
