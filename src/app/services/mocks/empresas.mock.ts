import {Injectable} from '@angular/core';
import {Estado} from '../../models/enums';
import {Response, Empresa, Representante, Tipo} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IEmpresasService} from '../interfaces/iempresas.service';
import * as data from './empresas.json';

@Injectable({
  providedIn: 'root',
})
export class EmpresasMockService implements IEmpresasService {

  crear(): Empresa {
    const empresa = new Empresa();
    const representante = new Representante();
    
    empresa.codigo=0;
    empresa.descripcion="";
    empresa.fechaRegistro= new Date();
    representante.tipoDocumento = new Tipo();
    representante.tipoRepresentante = new Tipo();
    representante.celular="";
    representante.codigo=0;
    representante.correo="";
    representante.direccion="";
    representante.estado=Estado.ACTIVO;
    representante.fax="";
    representante.fechaRegistro = new Date();
    representante.nombre="";
    representante.numeroDocumento="";
    representante.responsable="";
    representante.telefono="";
    empresa.representantes= [representante];
    empresa.estado = Estado.ACTIVO;
    return empresa;
  }

  buscarPorParametros(parametros: {codigo?: string, descripcion?: string}, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaEmpresas;
    return Observable.of(response);
  }

  obtenerTipos(){
    return null;
}

  buscarPorCodigo(codigo: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).empresa;
    return Observable.of(response);
  }

  guardar(empresa: Empresa) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).empresa;
    return Observable.of(response);
  }

  eliminar(empresa: Empresa) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }

  listar() {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaEmpresas;
    return Observable.of(response);
  }


}
