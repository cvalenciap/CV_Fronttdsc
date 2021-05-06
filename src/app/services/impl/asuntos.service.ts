import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Asunto} from '../../models';
import {Estado} from '../../models/enums';
import {environment} from '../../../environments/environment';
import {IAsuntosService} from '../interfaces/iasuntos.service';

@Injectable({
  providedIn: 'root',
})
export class AsuntosService {

  private apiEndpoint:string;

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(public http:HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/asuntos';
  }

  crear():Asunto {
    const asunto = new Asunto();
    asunto.estado = Estado.ACTIVO;
    asunto.fechaRegistro = new Date().toISOString();
    return asunto;
  }

  buscarPorParametros(parametros:{codigo?: string, descripcion?: string}, pagina:number, registros:number) {
    let params:HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.codigo) {
      params = params.set('codigo', parametros.codigo);
    }

    if (parametros.descripcion) {
      params = params.set('descripcion', parametros.descripcion);
    }
    return this.http.get(this.apiEndpoint, {params});
  }

  buscarPorCodigo(codigo:number) {
    const url = `${this.apiEndpoint}/${codigo}`;
    return this.http.get(url);
  }

  guardar(asunto:Asunto) {
    let url = this.apiEndpoint;
    if (asunto.codigo && asunto.codigo !== 0) {
      url += `/${asunto.codigo}`;
    }
    return this.http.post(url, asunto);
  }

  eliminar(codigo:number) {
    const url = `${this.apiEndpoint}/${codigo}`;
    return this.http.delete(url);
  }
}


