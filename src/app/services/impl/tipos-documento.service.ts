import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TipoDocumento} from '../../models';
import {Estado} from '../../models/enums';
import {environment} from '../../../environments/environment';
import {ITiposDocumentoService} from '../interfaces/itipos-documento.service';
@Injectable({
    providedIn: 'root',
})
export class TiposDocumentoService implements ITiposDocumentoService {
    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/tipos_documento';
    }

    crear(): TipoDocumento {
        const tipoDocumento = new TipoDocumento();
        tipoDocumento.estado = Estado.ACTIVO;
        tipoDocumento.fechaRegistro = new Date().toString();
        return tipoDocumento;
    }

    buscarPorParametros(parametros: {codigo?: string, descripcion?: string}, pagina: number, registros: number) {
       let params: HttpParams = new HttpParams()
          .set('pagina', pagina.toString())
          .set('registros', registros.toString());
        if (parametros.codigo) { params = params.set('codigo', parametros.codigo); }
        if (parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }
        return this.http.get(this.apiEndpoint, {params});
      }
      buscarPorCodigo(codigo: string) {
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
      }
      guardar(tipoDocumento: TipoDocumento) {
        let url = this.apiEndpoint;
        if (tipoDocumento.codigo != null) {
          tipoDocumento.codigo = tipoDocumento.codigo.toUpperCase();
          tipoDocumento.descripcion = tipoDocumento.descripcion.toUpperCase();
          tipoDocumento.abreviatura = tipoDocumento.abreviatura.toUpperCase();
        	url += `/${tipoDocumento.codigo}`;
        }
        console.log(url);
        console.log(tipoDocumento);
        return this.http.post(url, tipoDocumento);
      }
      eliminar(tipoDocumento: TipoDocumento) {
        const url = `${this.apiEndpoint}/${tipoDocumento.codigo}`;
        return this.http.delete(url);
      }
}
