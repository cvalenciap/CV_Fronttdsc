import { Area, Trabajador, TipoDocumento } from ".";
import {EstadoDocumento} from "./enums";
export class ReporteRegistroEntradaDet {
    seguimiento : number;
	correlativo: number;
	fechaDerivado : Date;
	areaRemitente : Area;
	trabajadorRemitente : Trabajador;
	areaDestino : Area;
	trabajadorDestino : Trabajador;
	estado :EstadoDocumento;
    comentario : string;
}