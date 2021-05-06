import {Directive, Injectable, SystemJsNgModuleLoader} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Area, TipoDocumento, Documento, DocumentoAdjunto, Empresa, Representante, Response, DocumentoDirigido, Trabajador} from '../../models';
import {PrioridadDocumento, Estado, OrigenDocumento, EstadoDocumento} from '../../models/enums';
import {IMesaPartesService} from '../interfaces/imesa-partes.service';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})

export class MesaPartesService implements IMesaPartesService {
  private apiEndpoint: string;
  private apiEndpointExcel: string;
  private apiEndpointPDF: string;
  private apiEndpointDocumentos: string;
  private codigo : string;
  private modalidad: string;
  private apiEndpointHtml : string;
  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/bandejas/mesa-partes';
    this.apiEndpointExcel = environment.serviceEndpoint + '/bandejas/mesa-partes.xls';
    this.apiEndpointPDF = environment.serviceEndpoint + '/bandejas/mesa-partes.pdf';
    this.apiEndpointHtml = environment.serviceEndpoint + '/documentos-entrantes';
    this.apiEndpointDocumentos = environment.serviceEndpoint + '/documentos-entrantes';
  }

  private item: DocumentoAdjunto;

  buscarDocumentos(parametros: {
    modalidad?: string,
    correlativo?: string,
    correlativoFin?: string,
    nano?: string,
    asunto?: string;
    origen?: string,
    tipoDocumento?: string;
    numeroDocumento?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    remitente?: string;
    dirigido?: string;
    estado?: string,
    prioridad?: string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.modalidad) {
      params = params.set('modalidad', parametros.modalidad);
    } else {
      params = params.set('modalidad', "0");
    }
    if (parametros.correlativo) {
      params = params.set('correlativo', parametros.correlativo);
    }
    if (parametros.correlativoFin) {
      params = params.set('correlativoFin', parametros.correlativoFin);
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
    if (parametros.dirigido) {
      params = params.set('dirigido', parametros.dirigido);
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
      params = params.set('fechaInicio', moment(parametros.fechaInicio).format('YYYY-MM-DD'));
    }
    if (parametros.fechaFin) {
      params = params.set('fechaFin', moment(parametros.fechaFin).format('YYYY-MM-DD'));
    }
    const url = `${this.apiEndpoint}`;
    return this.http.get(url, {params});
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
    correlativoFin?: string,
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
    if (parametros.correlativoFin) {
      params = params.set('correlativoFin', parametros.correlativoFin);
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
      params = params.set('fechaInicio', parametros.fechaInicio.toISOString().substr(0,10));
    }
    if (parametros.fechaFin) {
      params = params.set('fechaFin', parametros.fechaFin.toISOString().substr(0,10));
    }
    const url = `${this.apiEndpointPDF}`;    
    return this.http.get(url, {responseType: 'arraybuffer', params: params});
  }

  generarHtml(documento: Documento){
    const url = `${this.apiEndpointHtml}/${documento.nano}/${documento.correlativo}/cargo`;
    return this.http.get(url, {responseType: 'arraybuffer'})
  }

  generarHoja(documento: Documento){
    const url = `${this.apiEndpointHtml}/${documento.nano}/${documento.correlativo}/hoja-resumen`;
    return this.http.get(url, {responseType: 'arraybuffer'})
  }

  obtenerDocumento(nano: number, correlativo: number) {
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}`;
    return this.http.get(url);
  }

  obtenerArbolDocumento(nano: number, correlativo: number) {
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}/arbol-seguimiento`;
    return this.http.get(url);
  }

  cargarParametros() {
    const url = `${this.apiEndpoint}/parametros`;
    return this.http.get(url);
  }

  calcularFechaPlazo(fechaInicio: Date, nPlazo: number) {
    let fecha="";
      if(fechaInicio.toString().length==10) {
        fecha = fechaInicio.toString();
      } else {
        fecha = fechaInicio.toISOString().substr(0,10);
      }
      const url = `${this.apiEndpoint}/fecha-vencimiento`;
      let params:HttpParams = new HttpParams()
        .set('fechaInicio', fecha)
        .set('nPlazo', nPlazo.toString());
      return this.http.get(url, {params});
  }

  convierteFechas(fecha: Date) {
    const url = `${this.apiEndpoint}/convierte-fechas`;
    let params: HttpParams = new HttpParams()
      .set('fecha', fecha.toISOString());
    return this.http.get(url, {params});
  }

  cambiarRemitente(parametros: {descripcion: string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    params = params.set('descripcion', parametros.descripcion);
    const url = `${this.apiEndpoint}/empresas`;
    return this.http.get(url, {params});
  }

  cambiarRepresentantes(codigo: number) {
    const url = `${this.apiEndpoint}/empresas/${codigo}/representantes`;
    return this.http.get(url);
  }

  crearDocumento(): Documento {
    const documento = new Documento();
    documento.remitente = new Empresa();
    documento.representante = new Representante();
    documento.origen = OrigenDocumento.EXTERNO;
    documento.areaOrigen = new Area();
    documento.tipoDocumento = new TipoDocumento();
    documento.opcion="1";
    documento.estado=EstadoDocumento.INGRESADO;
    documento.plazo=0;
    documento.fechaRecepcion = new Date();
    documento.fechaDocumento = new Date();
    documento.fechaPlazo = new Date();
    documento.prioridad = PrioridadDocumento.MEDIA;
    documento.folios=0;
    return documento;
  }

  guardarDocumento(documento: Documento) {
    var s, s2: string;
    var i: number;
    s2 ="[ ";
    for(i=0;i<=documento.dirigidos_to.length-1;i++){
      s2 = s2 + `{"area": {"codigo": "${documento.dirigidos_to[i].area.codigo.toString()}"},`;
      s2 = s2 + `"trabajador": {"ficha": "${documento.dirigidos_to[i].trabajador.ficha.toString()}"},`;
      s2 = s2 + `"tipo": "${documento.dirigidos_to[i].tipo}"},`;
    }
    s2 = s2.substring(0,s2.length-1) + "]";
    s = `{"codigo": "${documento.remitente.codigo}"}`;
    documento.remitente=JSON.parse(s);
    s = `{"codigo": "${documento.representante.codigo}"}`;
    documento.representante=JSON.parse(s);
    s = `{"codigo": "${documento.tipoDocumento.codigo}"}`;
    documento.tipoDocumento=JSON.parse(s);
    documento.origen = OrigenDocumento.EXTERNO;
    documento.dirigidos_to=JSON.parse(s2);
    let url = `${this.apiEndpointDocumentos}`;
    return this.http.post(url, documento);
  }

  eliminarAnexo(item: DocumentoAdjunto) {
    let params: HttpParams = new HttpParams()
      .set('ubicacion', item.ubicacion);
    let url = `${this.apiEndpointDocumentos}/anexos`;
    return this.http.get(url,{params});
  }

  eliminarDocumento(nano: number, correlativo: number) {
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}`;
    return this.http.delete(url);
  }

  actualizarArchivo(documento: Documento, nano: number, correlativo:number) {
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}/archivo`;
    return this.http.post(url, documento);
  }

  guardarAnexo(item: DocumentoAdjunto) {
    let url = `${this.apiEndpointDocumentos}/anexos`;
    return this.http.post(url,item);
  }

  validarEntrante(nano: number, correlativo: number) {
    const url = `${this.apiEndpointDocumentos}/${nano.toString()}/${correlativo.toString()}/validarentrante`;
    return this.http.get(url);
  }
}
