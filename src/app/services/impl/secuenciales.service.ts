import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Secuencial} from '../../models';
import {Estado} from '../../models/enums';
import {ISecuencialesService} from '../interfaces/isecuenciales.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SecuencialesService implements ISecuencialesService {

  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/secuenciales';
  }

  crear(): Secuencial {
    const secuencial = new Secuencial();
    secuencial.estado = Estado.ACTIVO;
    return secuencial;
  }

  buscarPorParametros(parametros: {area?: number, codigo?: string, descripcion?: string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());

    if (parametros.codigo) { params = params.set('codigo', parametros.codigo); }
    if (parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }

    return this.http.get(`${this.apiEndpoint}`, {params});

  }

  buscarPorCodigo(codigo: string) {
    const url = `${this.apiEndpoint}/` + codigo;
    console.log("entro");
    console.log(url);
    return this.http.get(url);
  }

  guardar(secuencial: Secuencial) {
    let url = this.apiEndpoint;
    url += `/${secuencial.tipoDocumento.codigo}`;
    console.log(url);
    return this.http.put(url, secuencial);
  }

  validarCorrelativo(secuencial: Secuencial) {
    console.log(secuencial);
    let url = this.apiEndpoint;
    url += `/${secuencial.tipoDocumento.codigo}`;
    console.log(url);
    return this.http.post(url, secuencial);
  }

  eliminar(secuencial: Secuencial) {
    //const url = `${this.apiEndpoint}/${secuencial.tipo.codigo}`;
    const url = `${this.apiEndpoint}/${secuencial}`;
    return this.http.delete(url);
  }

}
