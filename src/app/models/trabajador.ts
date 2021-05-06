import {IsInt} from 'class-validator';
import {Area} from './area';

export class Trabajador {
  codigo?: number;
  @IsInt()
  ficha: number;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  area?: Area;
  cargo?: string;
  ubicacion?: string;
  anexo?: number;
  correo?: string;
  responsable?: string;
  nombrecompleto?: string;
  jefe?: number;
  estado?: number;
  estadoModificado?: number;
  secuencial?:  number;
  nombreCompleto?: string;
  constructor(){
    this.nombre = "";
    this.area = new Area();
    this.secuencial = null;
    this.ficha = 0;
    this.estadoModificado=-1; // Modificado/Eliminado
    this.estado=-1; //Estado Base de Datos
  }
}


