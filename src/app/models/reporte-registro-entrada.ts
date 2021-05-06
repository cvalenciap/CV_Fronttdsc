import { Area, Trabajador,ReporteRegistroEntradaDet } from ".";
import {EstadoDocumento} from "./enums";
export class ReporteRegistroEntrada{
    correlativo: number;
    nano: number;
    fechaDocumento: Date;
    tipoDocumento : string;
	numeroDocumento : string;
	estadoDocumento : EstadoDocumento; 
	remitente : string;
	diasPlazo : number;
	asunto : string;
	referencia : string;
    detalle : ReporteRegistroEntradaDet[];
    constructor(){
        this.nano = null;
        this.correlativo = null;
        this.asunto = null;
        this.diasPlazo=  null;
        this.estadoDocumento =  null;
        this.fechaDocumento=  null;
        this.numeroDocumento=  null;
        this.referencia=  null;
        this.tipoDocumento =  null;
        this.remitente=  null;
        this.detalle = null;
    }
}
  