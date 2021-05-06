import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Empresa} from '../../models';
import {environment} from '../../../environments/environment';
import {IEmpresasService} from '../interfaces/iempresas.service';
@Injectable({
    providedIn: 'root',
})

export class EmpresasService implements IEmpresasService {
    private apiEndPoint: string;

    constructor(private http: HttpClient) {
        this.apiEndPoint = environment.serviceEndpoint + '/empresas';
        //console.log(this.apiEndPoint);
    }
    crear(): Empresa {
        const empresa = new Empresa();
        return empresa;
    }
    buscarPorParametros(parametros: {codigo?: string, descripcion?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros && parametros.codigo) { params = params.set('codigo', parametros.codigo); }
        if (parametros && parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }
        return this.http.get(this.apiEndPoint, {params});
    }
    buscarPorCodigo(codigo: number) {
        const url = `${this.apiEndPoint}/${codigo}`;
        //console.log(url);
        return this.http.get(url);
    }
    obtenerTipos(){
        const url = `${this.apiEndPoint}/tipos`;
        //console.log(url);
        return this.http.get(url);
    }
    
    guardar(empresa: Empresa) {
        console.log(empresa);
        debugger;
        let url = this.apiEndPoint;
        if (empresa.codigo && empresa.codigo  !=0 ) {
            url += `/${empresa.codigo}`;
        }
        console.log(url);
        return this.http.post(url, empresa);
    }
    eliminar(empresa: Empresa) {
        const url = `${this.apiEndPoint}/${empresa.codigo}`;
        return this.http.delete(url);
    }
}
