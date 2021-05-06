import { TipoDocumento, Area } from ".";

export class ParametroReporte{
    listaTiposDocumento: Array<TipoDocumento>;
    listaAreas: Array<Area>;
    listaNano: Array<Number>;
    constructor(){
        this.listaTiposDocumento = new Array<TipoDocumento>();
        this.listaAreas = new Array<Area>();
        this.listaNano  = new Array<Number>();
    }
}
