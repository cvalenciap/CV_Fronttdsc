import { Area, Trabajador } from ".";
import {EstadoDocumento} from "./enums";
export class ReporteSeguimiento{
    seguimiento: number;
    correlativo: number;
    nano: number;
    fechaDocumento: Date;
    areaRemitente: Area;
    estado: EstadoDocumento ;
    asunto: string ;
    observacion: string ;
    urlDocumento : string;
}
