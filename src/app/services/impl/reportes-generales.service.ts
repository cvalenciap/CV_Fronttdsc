import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {IReportesGeneralesService} from '../interfaces/ireportes-generales.service';
import {Paginacion} from '../../models';
import { ReturnStatement } from '@angular/compiler';
@Injectable({
    providedIn: 'root',
})

export class ReportesGeneralesService implements IReportesGeneralesService {
    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/reportes';
    }
    obtenerParametros() {
        let url = `${this.apiEndpoint}/obtenerparametros`;
        return this.http.get(url);
    }
    consultarDocumentosEntrada(parametros: {nano?: number, registro?: number}, pagina: number, registros:number) {
        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
        console.log(parametros);
        if (parametros && parametros.nano) { params = params.set('nano', parametros.nano.toString()); }
        if (parametros && parametros.registro) { params = params.set('registro', parametros.registro.toString()); }
        console.log(params);
        let url = `${this.apiEndpoint}/documentos_entrada`;
        console.log(params);
        return this.http.get(url, {params});
    }
    exportarDocumentosEntrada(parametros: {nano?: number, registro?: number}, pagina: number, registros:number) {
        let params: HttpParams = new HttpParams();
        if (parametros && parametros.nano) { params = params.set('nano', parametros.nano.toString()); }
        if (parametros && parametros.registro) { params = params.set('registro', parametros.registro.toString()); }
        console.log(params);
        let url = `${this.apiEndpoint}/documentos_entrada.xls`;
        //return this.http.post(url,(<any>data).documentoExcel,{responseType: 'arraybuffer'});
        //return this.http.get(url, {params});
        return this.http.get(url, {responseType: 'arraybuffer', params: params});
    }
    consultarAtencionDocumentos(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string, ficha:number }, pagina: number, registros:number ) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
            console.log(parametros);
        if (parametros && parametros.area) { params = params.set('codigoArea', parametros.area.toString()); }
        if (parametros && parametros.descripcion) { params = params.set('descripcionArea', parametros.descripcion); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaInicial', parametros.fechaInicial.toISOString().substring(0,10)); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaFinal', parametros.fechaFinal.toISOString().substring(0,10)); }
        if (parametros && parametros.estado) { params = params.set('estado', parametros.estado); }
        if (parametros && parametros.ficha) { params = params.set('ficha', parametros.ficha.toString()); }
        console.log(params);
        let url = `${this.apiEndpoint}/atencion_documentos`;
        return this.http.get(url, {params});
    }
    listarAnno() {
        return null;
    }
    imprimirAtencionDocumentos(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string, ficha:number }, pagina: number, registros:number ) {
        let params: HttpParams = new HttpParams();
        /*
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());*/
            console.log(parametros);
        if (parametros && parametros.area) { params = params.set('codigoArea', parametros.area.toString()); }
        if (parametros && parametros.descripcion) { params = params.set('descripcionArea', parametros.descripcion); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaInicial', parametros.fechaInicial.toISOString().substring(0,10)); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaFinal', parametros.fechaFinal.toISOString().substring(0,10)); }
        if (parametros && parametros.estado) { params = params.set('estado', parametros.estado); }
        if (parametros && parametros.ficha) { params = params.set('ficha', parametros.ficha.toString()); }
        console.log(params);
        let url = `${this.apiEndpoint}/atencion_documentos.pdf`;
        //let url = `http://10.240.147.53:8080/api/reportes/atencion_documentos.pdf`;
        return this.http.get(url, {responseType: 'arraybuffer', params: params});
    }
    exportarAtencionDocumentos(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string, ficha:number }, pagina: number, registros:number ) {
        /*
            .set('pagina', null)
            .set('registros', null);
        */
        let params: HttpParams = new HttpParams()
        if (parametros && parametros.area) { params = params.set('codigoArea', parametros.area.toString()); }
        if (parametros && parametros.descripcion) { params = params.set('descripcionArea', parametros.descripcion); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaInicial', parametros.fechaInicial.toISOString().substring(0,10)); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaFinal', parametros.fechaFinal.toISOString().substring(0,10)); }
        if (parametros && parametros.estado) { params = params.set('estado', parametros.estado); }
        if (parametros && parametros.ficha) { params = params.set('ficha', parametros.ficha.toString()); }
        console.log(params);
        let url = `${this.apiEndpoint}/atencion_documentos.xls`;
        //return this.http.post(url,(<any>data).documentoExcel,{responseType: 'arraybuffer'});
        //return this.http.get(url, {params});
        return this.http.get(url, {responseType: 'arraybuffer', params: params});
    }
    consultarPorAreaFechaEstado(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string }, pagina: number, registros:number ) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
            console.log(parametros);
        if (parametros && parametros.area) { params = params.set('codigoArea', parametros.area.toString()); }
        if (parametros && parametros.descripcion) { params = params.set('descripcionArea', parametros.descripcion); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaInicial', parametros.fechaInicial.toISOString().substring(0,10)); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaFinal', parametros.fechaFinal.toISOString().substring(0,10)); }
        if (parametros && parametros.estado) { params = params.set('estado', parametros.estado); }
        console.log(params);
        let url = `${this.apiEndpoint}/area_fecha_estado`;
        return this.http.get(url, {params});
    }
    exportarPorAreaFechaEstado(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, estado: string}, pagina: number, registros:number ) {
        let params: HttpParams = new HttpParams()
        if (parametros && parametros.area) { params = params.set('codigoArea', parametros.area.toString()); }
        if (parametros && parametros.descripcion) { params = params.set('descripcionArea', parametros.descripcion); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaInicial', parametros.fechaInicial.toISOString().substring(0,10)); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaFinal', parametros.fechaFinal.toISOString().substring(0,10)); }
        if (parametros && parametros.estado) { params = params.set('estado', parametros.estado); }
        console.log(params);
        let url = `${this.apiEndpoint}/area_fecha_estado.xls`;
        //return this.http.post(url,(<any>data).documentoExcel,{responseType: 'arraybuffer'});
        //return this.http.get(url, {params});
        return this.http.get(url, {responseType: 'arraybuffer', params: params});
    }
    consultarDocumentosAsignados(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, ficha: number}, pagina: number, registros:number ) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
            console.log(parametros);
        if (parametros && parametros.area) { params = params.set('codigoArea', parametros.area.toString()); }
        if (parametros && parametros.descripcion) { params = params.set('descripcionArea', parametros.descripcion); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaInicial', parametros.fechaInicial.toISOString().substring(0,10)); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaFinal', parametros.fechaFinal.toISOString().substring(0,10)); }
        if (parametros && parametros.ficha) { params = params.set('ficha', parametros.ficha.toString()); }
        console.log(params);
        let url = `${this.apiEndpoint}/documentos_asignados`;
        return this.http.get(url, {params});
    }
    imprimirDocumentosAsignados(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, ficha: number}, pagina: number, registros:number ) {
        let params: HttpParams = new HttpParams();
        /*
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());*/
            console.log(parametros);
        if (parametros && parametros.area) { params = params.set('codigoArea', parametros.area.toString()); }
        if (parametros && parametros.descripcion) { params = params.set('descripcionArea', parametros.descripcion); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaInicial', parametros.fechaInicial.toISOString().substring(0,10)); }
        if (parametros && parametros.fechaInicial) { params = params.set('fechaFinal', parametros.fechaFinal.toISOString().substring(0,10)); }
        if (parametros && parametros.ficha) { params = params.set('ficha', parametros.ficha.toString()); }
        console.log(params);
        let url = `${this.apiEndpoint}/documentos_asignados.pdf`;
        //let url = `http://10.240.147.53:8080/api/reportes/atencion_documentos.pdf`;
        return this.http.get(url, {responseType: 'arraybuffer', params: params});
    }
    exportarDocumentosAsignados(parametros: {area?: number, descripcion?: string, fechaInicial?: Date, fechaFinal?: Date, ficha: number}, pagina: number, registros:number ) {
        /*
            .set('pagina', null)
            .set('registros', null);
        */
       let params: HttpParams = new HttpParams()
       if (parametros && parametros.area) { params = params.set('codigoArea', parametros.area.toString()); }
       if (parametros && parametros.descripcion) { params = params.set('descripcionArea', parametros.descripcion); }
       if (parametros && parametros.fechaInicial) { params = params.set('fechaInicial', parametros.fechaInicial.toISOString().substring(0,10)); }
       if (parametros && parametros.fechaInicial) { params = params.set('fechaFinal', parametros.fechaFinal.toISOString().substring(0,10)); }
       if (parametros && parametros.ficha) { params = params.set('ficha', parametros.ficha.toString()); }
       console.log(params);
       let url = `${this.apiEndpoint}/documentos_asignados.xls`;
       //return this.http.post(url,(<any>data).documentoExcel,{responseType: 'arraybuffer'});
       //return this.http.get(url, {params});
       return this.http.get(url, {responseType: 'arraybuffer', params: params});
    }

    consultarPorSeguimiento(parametros: {nano?: number, area?: number, numeroDocumento?: string, tipoDocumento: string}, pagina: number, registros:number ) {
       let params: HttpParams = new HttpParams()
         .set('pagina', pagina.toString())
         .set('registros', registros.toString());
       console.log("params: ", params);
       if (parametros && parametros.nano) { params = params.set('nano', parametros.nano.toString()); }
       if (parametros && parametros.area) { params = params.set('codigoArea', parametros.area.toString()); }
       if (parametros && parametros.numeroDocumento) { params = params.set('numeroDocumento', parametros.numeroDocumento); }
       if (parametros && parametros.tipoDocumento) { params = params.set('codigoTipoDocumento', parametros.tipoDocumento); }
       console.log("params: ", params);
       let url = `${this.apiEndpoint}/por_seguimiento`;
       return this.http.get(url, {params});
    }

    consultarPorRegistroEntrada(parametros: {nano?: number,numeroDocumento?: string, tipoDocumento?: string}, pagina: number, registros:number ) {
        let params: HttpParams = new HttpParams()
         .set('pagina', pagina.toString())
         .set('registros', registros.toString());
       console.log("params: ", params);
       if (parametros && parametros.nano) { params = params.set('nano', parametros.nano.toString()); }
       if (parametros && parametros.numeroDocumento) { params = params.set('codsal', parametros.numeroDocumento); }
       if (parametros && parametros.tipoDocumento) { params = params.set('tipoDocumento', parametros.tipoDocumento); }
       console.log("params: ", params);
       let url = `${this.apiEndpoint}/por_registro_entrada`;
       return this.http.get(url, {params});
    }
    exportarPorRegistroEntrada(parametros: {nano?: number,numeroDocumento?: string, tipoDocumento?: string}, pagina: number, registros:number ) {
        let params: HttpParams = new HttpParams();
        if (parametros && parametros.nano) { params = params.set('nano', parametros.nano.toString()); }
        if (parametros && parametros.numeroDocumento) { params = params.set('codsal', parametros.numeroDocumento); }
        if (parametros && parametros.tipoDocumento) { params = params.set('tipoDocumento', parametros.tipoDocumento); }
        console.log(params);
        let url = `${this.apiEndpoint}/por_registro_entrada.xls`;
        //return this.http.post(url,(<any>data).documentoExcel,{responseType: 'arraybuffer'});
        //return this.http.get(url, {params});
        return this.http.get(url, {responseType: 'arraybuffer', params: params});
    }
}
