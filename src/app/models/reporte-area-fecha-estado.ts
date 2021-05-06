import { Area } from ".";
import {EstadoDocumento} from "./enums";
export class ReporteAreaFechaEstado {
    correlativo: number;
    numeroDocumento: string;
    areaDestino: Area;
    fechaDocumento: Date ;
	asunto:string ;
	fechaDerivacion: Date ;
	estado: EstadoDocumento ;
	nombre: string ;
}
  