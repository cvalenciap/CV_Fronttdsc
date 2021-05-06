import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Grupo} from '../../models';
import {Estado} from '../../models/enums';
import {IGruposService} from '../interfaces/igrupos.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GruposService implements IGruposService {

  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/grupos';
  }

  crear(): Grupo {
    const grupo = new Grupo();
    grupo.estado = Estado.ACTIVO;
    return grupo;
  }

  buscarPorParametros(parametros: {codigo?: string, descripcion?: string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.codigo) { params = params.set('codigo', parametros.codigo); }
    if (parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }
    return this.http.get(this.apiEndpoint, {params});
  }

  buscarPorCodigo(codigo: number) {
    const url = `${this.apiEndpoint}/${codigo}`;
    return this.http.get(url);
  }

  guardar(grupo: Grupo) {
     let url = this.apiEndpoint;
     if (grupo.codigo != null) {
        url += `/${grupo.codigo}`;
     }
     return this.http.post(url, grupo);
  }

  eliminar(grupo: Grupo) {
     const url = `${this.apiEndpoint}/${grupo.codigo}`;
     console.log("URL: " + url);
     return this.http.delete(url);
  }

}
