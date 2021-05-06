import { Area, Trabajador, TipoDocumento, ReporteDocumentoEntradaDet } from ".";
import {EstadoDocumento} from "./enums";
export class ReporteDocumentoEntrada {
    nano : number;
    correlativo: number;
    tipoDocumento: string;
    numeroDocumento : string;
    estadoDocumento: EstadoDocumento;
    fechaDocumento: Date;
    remitente: string;
    diasPlazo : number;
    asunto: string;
    referencia: string;
    detalle : ReporteDocumentoEntradaDet[];
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
  