import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Documento} from '../../models';
import {IBandejaSalidaVisadosService} from '../interfaces/ibandeja-salida-visados.service';
import {environment} from '../../../environments/environment';
import { SessionService } from 'src/app/auth/session.service';

@Injectable({
  providedIn: 'root',
})
export class BandejaSalidaVisadosService implements IBandejaSalidaVisadosService {

  private apiEndpoint:string;
  private apiEndpointPDF: string;
  private apiEndpointExcel: string;
  
  constructor(private http:HttpClient,
              private session: SessionService) {
    this.apiEndpointPDF = environment.serviceEndpoint + '/bandejas/visados.pdf';
    this.apiEndpoint = environment.serviceEndpoint + '/bandejas/visados';
    this.apiEndpointExcel = environment.serviceEndpoint + '/bandejas/visados.xls';
  }

  crear():Documento {
    const documento = new Documento();
    //documento.codigo = 0;
    //documento.estado = Estado.ACTIVO;
    return documento;
  }

  buscarDocumentos(parametros:{
    modalidad?: string,
    usuario?: string,
    perfil?: string,
    correlativo?: string,
    nano?: string,
    asunto?: string,
    referencia?: string,
    origen?: string,
    tipoDocumento?: string,
    numeroDocumento?: string,
    remitente?: string,
    area?: string,
    prioridad_alta?: string,
    estado?: string,
    prioridad?: string,
    orden?: string,
    campo?: string,
    cadena?: string,
    dirigido?: string,
    docEntrada?: string,
    fechaInicio?: Date,
    fechaFin?: Date,}, pagina:number, registros:number) {
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
    if (parametros.asunto) {
      params = params.set('asunto', parametros.asunto);
    }
    if (parametros.referencia) {
      params = params.set('referencia', parametros.referencia);
    }
    if (parametros.origen) {
      params = params.set('origen', parametros.origen);
    }
    if (parametros.tipoDocumento) {
      params = params.set('tipoDocumento', parametros.tipoDocumento);
    }
    if (parametros.numeroDocumento) {
      params = params.set('numeroDocumento', parametros.numeroDocumento);
    }
    if (parametros.remitente) {
      params = params.set('remitente', parametros.remitente);
    }
    if (parametros.estado) {
      params = params.set('estado', parametros.estado);
    }
    if (parametros.prioridad) {
      params = params.set('prioridad', parametros.prioridad);
    }
    if (parametros.dirigido) {
      params = params.set('dirigido', parametros.dirigido);
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
    return this.http.get(this.apiEndpoint, {params});
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
    prioridad?: string}) {
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
    if (parametros.asunto) {
      params = params.set('asunto', parametros.asunto);
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
    prioridad?: string}) {
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
    if (parametros.asunto) {
      params = params.set('asunto', parametros.asunto);
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
    const url = `${this.apiEndpointPDF}`;
    return this.http.get(url, {responseType: 'arraybuffer', params: params});
  }
}
