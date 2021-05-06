import { Trabajador } from "../models";

export class Area {
  codigo?: number;
  nombre?: string;
  abreviatura?: string;
  descripcion?: string;
  jefe?:  Trabajador;
  constructor(){
    this.codigo = 0;
    this.descripcion= "";
    this.nombre = "";
    this.abreviatura= "";
  }
}
