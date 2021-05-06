import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Area} from '../../models';
import {Estado} from '../../models/enums';
import {IAreasService} from '../interfaces/iareas.service';
import {Trabajador} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AreasService implements IAreasService {

  private apiEndpoint: string;

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(public http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/areas';

  }

  buscarPorParametros(parametros: {codigo?: string, descripcion?: string}) {
    let params: HttpParams = new HttpParams();
      if (parametros.codigo) { params = params.set('codigo', parametros.codigo); }
    if (parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }
    return this.http.get(this.apiEndpoint,{params});
  }


  buscarPorCodigo(codigo: number) {
    const url = `${this.apiEndpoint}/${codigo}`;
    return this.http.get(url);

  }

  obtenerJefe(codigo: number) {
    const url = `${this.apiEndpoint}/${codigo}/jefe`;
      return this.http.get(url);

  }

  validarJefe (codigo: number, numeroFicha: number) {
    const url = `${this.apiEndpoint}/${codigo}/${numeroFicha}/jefe`;
    console.log(url);
    return this.http.get(url);
  }

  actualizarJefe(idArea: number, jefe: Trabajador) {
    let url = `${this.apiEndpoint}`;
    if (idArea !== 0) {
      url += `/${idArea}/jefe`;
    }
    return this.http.post(url, jefe);
  }

}
