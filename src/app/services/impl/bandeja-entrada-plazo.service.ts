import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Documento, DocumentoSeguimiento} from '../../models';
import {PrioridadDocumento, Estado, EstadoDocumento} from '../../models/enums';
import {IBandejaEntradaPlazoService} from '../interfaces/ibandeja-entrada-plazo.service';
import {environment} from '../../../environments/environment';
import { SessionService } from 'src/app/auth/session.service';

@Injectable({
  providedIn: 'root',
})
export class BandejaEntradaPlazoService implements IBandejaEntradaPlazoService {

  private apiEndpoint:string;
  private apiEndpointDocumentos:string;
  private apiEndpointExcel: string;
  private apiEndpointPDF: string;
  private session: SessionService;
  private seguimiento:Documento;

  constructor(private http:HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/bandejas/plazo';
    this.apiEndpointDocumentos = environment.serviceEndpoint + '/documentos-entrantes';
    this.apiEndpointExcel = environment.serviceEndpoint + '/bandejas/plazo.xls';
    this.apiEndpointPDF = environment.serviceEndpoint + '/bandejas/plazo.pdf';
  }

  crear():Documento {
    const documento = new Documento();
    //documento.codigo = 0;
    //documento.estado = Estado.ACTIVO;
    return documento;
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
    if (parametros.fechaInicio) {
      console.log(parametros);
      try {
        params = params.set('fechaInicio', parametros.fechaInicio.toISOString().substr(0, 10));
      } catch (error) {
        params = params.set('fechaInicio', parametros.fechaInicio.toString().substr(0, 10));
      }
    }
    if (parametros.fechaFin) {
      try {
        params = params.set('fechaFin', parametros.fechaFin.toISOString().substr(0, 10));  
      } catch (error) {
        params = params.set('fechaFin', parametros.fechaFin.toString().substr(0, 10));  
      }
    }
    const url = `${this.apiEndpointPDF}`;
    return this.http.get(url, {responseType: 'arraybuffer', params: params});
  }

  buscarDocumentos(parametros: { modalidad?: string, usuario?: string, perfil?: string, correlativo?: string, correlativoFin?: string,
    nano?: string, asunto?: string; origen?: string, tipoDocumento?: string, numeroDocumento?: string; remitente?: string; area?: string,
    prioridad_alta?: string, estado?: string, prioridad?: string, orden?: string, campo?: string, cadena?: string}, pagina: number,
    registros: number) {

    let params: HttpParams = new HttpParams().set('pagina', pagina.toString()).set('registros', registros.toString());

    if (parametros.modalidad) {
      params = params.set('modalidad', parametros.modalidad);
    } else {
      params = params.set('modalidad', '0');
    }
    if (parametros.perfil) {
      params = params.set('perfil', parametros.perfil);
    }
    if (parametros.correlativo) {
      params = params.set('correlativo', parametros.correlativo);
    }
    if (parametros.tipoDocumento) {
      params = params.set('tipoDocumento', parametros.tipoDocumento);
    }
    if (parametros.correlativoFin) {
      params = params.set('correlativoFin', parametros.correlativoFin);
    }
    if (parametros.nano) {
      params = params.set('nano', parametros.nano);
    } else {
      params = params.set('nano', (new Date()).toISOString().substr(0, 4));
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
    return this.http.get(this.apiEndpoint, {params});
  }

  actualizarLeido(documento: Documento) {
    const url = `${this.apiEndpointDocumentos}/leido`;
    return this.http.put(url, documento);
  }

  actualizarRecibido(documentos: Documento[]) {
    var s: string;
    var i: number;
    s ="[ ";
    for(i=0;i<documentos.length;i++){
      s = s + `"${documentos[i].nano.toString()},${documentos[i].origen.toString()},${documentos[i].correlativo.toString()},${documentos[i].codmov.toString()}",`;
    }
    s = s.substring(0,s.length-1) + "]";
    let url = `${this.apiEndpoint}/recibido`;
    return this.http.put(url, JSON.parse(s));
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
    if (parametros.fechaInicio) {
      console.log(parametros);
      try {
        params = params.set('fechaInicio', parametros.fechaInicio.toISOString().substr(0, 10));
      } catch (error) {
        params = params.set('fechaInicio', parametros.fechaInicio.toString().substr(0, 10));
      }
    }
    if (parametros.fechaFin) {
      try {
        params = params.set('fechaFin', parametros.fechaFin.toISOString().substr(0, 10));  
      } catch (error) {
        params = params.set('fechaFin', parametros.fechaFin.toString().substr(0, 10));  
      }
    }
    const url = `${this.apiEndpointExcel}`;    
    return this.http.get(url, {responseType: 'arraybuffer', params: params});
  }
}
