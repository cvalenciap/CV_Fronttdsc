export class Paginacion {
  private _pagina: number;
  get pagina(): number {
    return this._pagina;
  }
  set pagina(pagina: number) {
    this._pagina = pagina;
  }
  private _registros: number;
  get registros(): number {
    return this._registros;
  }
  set registros(registros: number) {
    this._registros = registros;
  }
  private _totalPaginas: number;
  get totalPaginas(): number {
    return this._totalPaginas;
  }
  private _totalRegistros: number;
  get totalRegistros(): number {
    return this._totalRegistros;
  }
  set totalRegistros(totalRegistros: number) {
    this._totalRegistros = totalRegistros;
  }
  private _indiceMin: number;
  get indiceMin(): number {
    return this._indiceMin;
  }
  private _indiceMax: number;
  get indiceMax(): number {
    return this._indiceMax;
  }
  private DEFAULT_REGISTROS = 10;

  constructor(paginacion?: {pagina?: number, registros?: number, totalPaginas?: number, totalRegistros?: number}) {
    this._pagina = paginacion && paginacion.pagina || 1;
    this._registros = paginacion && paginacion.registros > 0 && paginacion.registros || this.DEFAULT_REGISTROS;
    this._totalRegistros = paginacion && paginacion.totalRegistros || 0;
    this._totalPaginas = (paginacion && paginacion.totalPaginas) ||
      (this._totalRegistros > 1 ? Math.ceil(this._totalRegistros / this._registros) : 1);
    this.actualizarIndices();
  }

  private actualizarIndices() {
    /*if (this._totalRegistros > 0) {
      this._indiceMin = (this._registros > 1) ? this : 1;
      this._indiceMax = (this._totalRegistros > this._registros) ? this._registros : this._totalRegistros;
    } else {
      this._indiceMin = 0;
      this._indiceMax = 0;
    }*/
  }


  primera() { this.pagina = 1; }
  siguiente() { if (this.pagina < this.totalPaginas) { this.pagina++; } }
  anterior() { if (this.pagina !== 1) {this.pagina--; } }
  ultima() { this.pagina = this.totalPaginas; }
}
