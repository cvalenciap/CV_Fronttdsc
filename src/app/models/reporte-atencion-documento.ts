
import {EstadoDocumento} from './enums';
import {Area} from '.';
export class ReporteAtencionDocumento{
    correlativo :number;
    numeroDocumento: string;
    areaDestino: Area ;
    fechaDocumento:Date ;
    fechaDerivacion:Date ;
    estado: EstadoDocumento;
    nombres: string;
    observacion: string;
    asunto : string;
    constructor(){
        this.areaDestino=new Area();
    }
}