import { Trabajador } from ".";
import { Area } from ".";
import { TipoFirma, EstadoFirma } from "./enums";

export class DocumentoFirmante {
  
  nivel: number;
  areaFirmante : Area;
  trabajador: Trabajador;
  tipoFirma: TipoFirma;
  estadoFirma: EstadoFirma;
  constructor(){
    this.nivel=-1;
    this.areaFirmante = new Area();
    this.trabajador = new Trabajador();
  }
}
