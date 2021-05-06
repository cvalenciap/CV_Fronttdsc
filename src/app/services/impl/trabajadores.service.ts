import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Area, FiltroTrabajador} from '../../models';
import {ITrabajadoresService} from '../interfaces/itrabajadores.service';
import {Trabajador} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class TrabajadoresService {

  private apiEndpoint: string;
  filtroTrabajador = new FiltroTrabajador();

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(public http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/trabajadores';
  }
  listar(filtroTrabajador: FiltroTrabajador) {
    let params:HttpParams = new HttpParams()
      .set('area', filtroTrabajador.area.toString())
      .set('ficha', filtroTrabajador.ficha.toString());
    const url = `${this.apiEndpoint}`;
    return this.http.get(url, {params});
  }
}
