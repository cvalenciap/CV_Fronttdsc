import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Feriado} from '../../models';
import {Estado} from '../../models/enums';
import {IFeriadosService} from '../interfaces/iferiados.service';
import { SessionService } from '../../auth/session.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeriadosService implements IFeriadosService {

  private apiEndpoint: string;

  constructor(private http: HttpClient, private session: SessionService) {
    this.apiEndpoint = environment.serviceEndpoint + '/feriados';
  }
  obtenerTipos(){
    let url = this.apiEndpoint + `/tipos`;
    return this.http.get(url);
  }
  crear(): Feriado {
    const feriado = new Feriado();
    feriado.fechaRegistro=new Date();
    feriado.estado = Estado.ACTIVO;
    feriado.responsable = this.session.User.codUsuario;
    return feriado;
  }

  buscarPorParametros(parametros: {codigo?: string, fecha?: string, descripcion?: string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.codigo) { params = params.set('codigo', parametros.codigo); }
    if (parametros.fecha) { params =  params.set('fecha', parametros.fecha); }
    if (parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }
    return this.http.get(this.apiEndpoint, {params});
  }

  buscarPorCodigo(codigo: number) {
    const url = `${this.apiEndpoint}/${codigo}`;
    return this.http.get(url);
  }

  guardar(feriado: Feriado) {
    let url = this.apiEndpoint;
    if (feriado.codigo) {
      url += `/${feriado.codigo}`;
    }
    return this.http.post(url, feriado);
  }

  eliminar(feriado: Feriado) {
    const url = `${this.apiEndpoint}/${feriado.codigo}`;
    return this.http.delete(url);
  }

}
