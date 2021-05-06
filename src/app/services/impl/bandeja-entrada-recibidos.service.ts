import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Documento, DocumentoSeguimiento} from '../../models';
import {PrioridadDocumento, Estado, EstadoDocumento, OrigenDocumento} from '../../models/enums';
import {IBandejaEntradaRecibidosService} from '../interfaces/ibandeja-entrada-recibidos.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BandejaEntradaRecibidosService implements IBandejaEntradaRecibidosService {

  private apiEndpoint:string;
  private apiEndpointDocumentos:string;
  private apiEndpointDocumentoSaliente:string;
  private apiEndpointExcel: string;
  private apiEndpointPDF: string;
  private seguimiento:Documento;
  private apiEndPointResumen:string;
  private apiEndPointReportes:string;

  constructor(private http:HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/bandejas/recibidos';
    this.apiEndpointDocumentos = environment.serviceEndpoint + '/documentos-entrantes';
    this.apiEndpointDocumentoSaliente = environment.serviceEndpoint + '/documentos-salientes';
    this.apiEndpointExcel = environment.serviceEndpoint + '/bandejas/recibidos.xls';
    this.apiEndpointPDF = environment.serviceEndpoint + '/bandejas/recibidos.pdf';
    this.apiEndPointReportes = environment.serviceEndpoint + '/reportes';
  }

  crear():Documento {
    const documento = new Documento();
    //documento.codigo = 0;
    //documento.estado = Estado.ACTIVO;
    return documento;
  }

  buscarDocumentos( parametros: { modalidad?: string, correlativo?: string, correlativoFin?: string , nano?: string, asunto?: string;
                                  origen?: string, dirigido?:string, tipoDocumento?: string; numeroDocumento?: string; fechaInicio?: Date; fechaFin?: Date;
                                  remitente?: string; estado?: string, prioridad?: string}, pagina: number, registros: number) {

    let params: HttpParams = new HttpParams().set('pagina', pagina.toString()).set('registros', registros.toString());

    if (parametros.modalidad) {
      params = params.set('modalidad', parametros.modalidad);
    } else {
      params = params.set('modalidad', '0');
    }
    if (parametros.dirigido) {
      params = params.set('dirigido', parametros.dirigido);
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
    const url = `${this.apiEndpoint}`;
    return this.http.get(url, {params});
  }

  buscarDocumento(nano:number, correlativo:number) {
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}`; //verificar
    return this.http.get(url);
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

  obtenerSeguimiento(
    parametros:{
      ncodseg?: string,
      remitente?: string,
      comentario?: string},
    nano:number, codigo:number, pagina:number, registros:number) {
    let params:HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
      if (parametros.ncodseg) {
        params = params.set('ncodseg', parametros.ncodseg);
      }
      if (parametros.remitente) {
        params = params.set('remitente', parametros.remitente);
      }
      if (parametros.comentario) {
        params = params.set('comentario', parametros.comentario);
      }
    const url = `${this.apiEndpointDocumentos}/${nano}/${codigo}/seguimiento`; //verificar
    console.log(url);
    return this.http.get(url, {params});
  }

  eliminarSeguimiento(nano:number, correlativo:number, codmov:number) {
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}/seguimiento/${codmov}`;
    return this.http.delete(url);
  }

  obtenerArbolDocumento(nano: number, correlativo: number) {
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}/arbol-seguimiento`;
    return this.http.get(url);
  }

  actualizarAtendido(nano:number, correlativo:number, codmov:number) {
    this.seguimiento = new Documento();
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}/seguimiento/${codmov}`;
    return this.http.put(url, this.seguimiento);
  }

  crearSeguimiento(documentoSeguimiento: DocumentoSeguimiento) {
    //documentoSeguimiento.fechaDerivacion = new Date(documentoSeguimiento.fechaDerivacion.toISOString());
    const url = `${this.apiEndpointDocumentos}/seguimiento`;
    return this.http.post(url, documentoSeguimiento);
  }

  obtenerParametros(ncodarea:number) {
    const url = `${this.apiEndpoint}/parametros`;
    return this.http.get(url);
  }

  cambiarRemitente(parametros: {descripcion: string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    params = params.set('descripcion', parametros.descripcion);
    const url = `${this.apiEndpoint}/empresas`;
    return this.http.get(url, {params});
  }

  recepcionFisica(documentoSeguimiento: DocumentoSeguimiento) {
    const url = `${this.apiEndpointDocumentos}/recepcion-fisica`;
    return this.http.put(url, documentoSeguimiento);
  }

  cambiarRepresentantes(codigo: number) {
    const url = `${this.apiEndpoint}/empresas/${codigo}/representantes`;
    return this.http.get(url);
  }

  calcularFechaPlazo(fechaRecepcion: Date, plazo: number) {
    let fecha="";
    if(fechaRecepcion.toString().length==10) {
      fecha = fechaRecepcion.toString();
    } else {
      fecha = fechaRecepcion.toISOString().substr(0,10);
    }
    const url = `${this.apiEndpoint}/fecha-vencimiento`;
    let params:HttpParams = new HttpParams()
      .set('fechaInicio', fecha.toString())
      .set('nPlazo', plazo.toString());
    return this.http.get(url, {params});
  }

  guardarDocumento(documento: Documento) {
    if(!documento.remitente) {
      documento.remitente=null;
      documento.representante=null;
    }
    var s, s2, s3: string;
    var i: number;
    s2 ="[ ";
    s3 ="[ ";
    if(documento.dirigidos_to) {
      if(documento.dirigidos_to.length>0) {
        for(i=0;i<=documento.dirigidos_to.length-1;i++){
          s2 = s2 + `{"area": {"codigo": "${documento.dirigidos_to[i].area.codigo.toString()}"},`;
          s2 = s2 + `"trabajador": {"ficha": "${documento.dirigidos_to[i].trabajador.ficha.toString()}"},`;
          s2 = s2 + `"tipo": "${documento.dirigidos_to[i].tipo}"},`;
        }
        s2 = s2.substring(0,s2.length-1) + "]";
        documento.dirigidos_to=JSON.parse(s2);
      }
    }
    if(documento.dirigidos_cc) {
      if(documento.dirigidos_cc.length>0) {
        for(i=0;i<=documento.dirigidos_cc.length-1;i++){
          s3 = s3 + `{"area": {"codigo": "${documento.dirigidos_cc[i].area.codigo.toString()}"},`;
          s3 = s3 + `"trabajador": {"ficha": "${documento.dirigidos_cc[i].trabajador.ficha.toString()}"},`;
          s3 = s3 + `"tipo": "${documento.dirigidos_cc[i].tipo}"},`;
        }
        s3 = s3.substring(0,s3.length-1) + "]";
        documento.dirigidos_cc=JSON.parse(s3);
      }
    }

    if(documento.origen=='INTERNO') {
      documento.remitente=null;
      documento.representante=null;
    } else {
      s = `{"codigo": "${documento.remitente.codigo}"}`;
      documento.remitente=JSON.parse(s);
      s = `{"codigo": "${documento.representante.codigo}"}`;
      documento.representante=JSON.parse(s);
    }
    s = `{"codigo": "${documento.tipoDocumento.codigo}"}`;
    documento.tipoDocumento=JSON.parse(s);
    let url = `${this.apiEndpointDocumentos}`;
    return this.http.post(url, documento);
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

  generarHojaEnvioPDF(nano: number, correlativo: number) {
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}/hoja-envio`;
    return this.http.get(url, {responseType: 'arraybuffer' });
  }

  generarHojaSeguimientoPDF(vnumdoc: string){
    const url = `${this.apiEndPointReportes}/seguimiento/${vnumdoc}`;
    return this.http.get(url, {responseType: 'arraybuffer' });
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

  actualizarArchivo(documento: Documento, nano: number, correlativo:number) {
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}/archivo`;
    return this.http.post(url, documento);
  }

  eliminar(nano: number, correlativo: number) {
    const url = `${this.apiEndpointDocumentos}/${nano}/${correlativo}`;
    return this.http.delete(url);
  }

  generarCargo(codDocumento: string, codMovimiento: string) {
    const url = `${this.apiEndpointDocumentoSaliente}/${codDocumento}/${codMovimiento}/cargo`;
    return this.http.get(url, {responseType: 'arraybuffer'} );
  }

}
