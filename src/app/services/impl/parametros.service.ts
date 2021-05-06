import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Asunto} from '../../models';
import {Estado} from '../../models/enums';
import {environment} from '../../../environments/environment';
import {IAsuntosService} from '../interfaces/iasuntos.service';

@Injectable({
  providedIn: 'root',
})
export class ParametrosService {

  private apiEndpoint:string;

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(public http:HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/parametros';
  }

  buscarAsuntos(parametros:{ descripcion?: string}, pagina:number, registros:number) {
    let params:HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    let asuntosEndpiont = this.apiEndpoint + '/asuntos';
    if (parametros && parametros.descripcion) {
      params = params.set('descripcion', parametros.descripcion);
    }
    return this.http.get(asuntosEndpiont, {params});
  }
  buscarTipoDocumento(parametros:{ codigo?: number}) {
    let params:HttpParams = new HttpParams();
    let tipoDocumentoEndpoint = this.apiEndpoint + '/tipodocumento';
    if (parametros.codigo) {
      params = params.set('codigo', parametros.codigo.toString());
    }
    return this.http.get(tipoDocumentoEndpoint, {params});
  }
  buscarAreas() {
    let empresasEndpoint = this.apiEndpoint + '/areas';
    return this.http.get(empresasEndpoint);
  }
  buscarTrabajadores(parametros:{codigo?: number}) {
    let params:HttpParams = new HttpParams();
    let empresasEndpoint = this.apiEndpoint + '/trabajadores';
    if (parametros && parametros.codigo) { params = params.set('codigoArea', parametros.codigo.toString()); }
    return this.http.get(empresasEndpoint, {params});
  }
  buscarEmpresa(parametros:{ descripcion?: string}) {
    let params:HttpParams = new HttpParams();
    let empresasEndpoint = this.apiEndpoint + '/empresas';
    if (parametros && parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }
    return this.http.get(empresasEndpoint, {params});
  }
  buscarRepresentante(parametros:{ codigo?: number}) {
    let params:HttpParams = new HttpParams();
    let represenstanteEndpoint = this.apiEndpoint + '/representantes';
    if ( parametros &&  parametros.codigo) {
      params = params.set('codigoEmpresa', parametros.codigo.toString());
    }
    return this.http.get(represenstanteEndpoint, {params});
  }
  buscarPeriodos(){
      let periodosEndPoint = this.apiEndpoint + '/periodos';
      return this.http.get(periodosEndPoint);
  }
  buscarJefe(parametros:{ codigo?: number}){
    let params:HttpParams = new HttpParams();
    let jefeEndpoint = this.apiEndpoint + '/jefe';
    if ( parametros &&  parametros.codigo) {
      params = params.set('codigo', parametros.codigo.toString());
    }
    return this.http.get(jefeEndpoint, {params});
  }
}


