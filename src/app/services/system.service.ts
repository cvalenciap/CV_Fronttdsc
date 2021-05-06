import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SystemService {

  private apiEndpoint: string;
  private APP_PARAMS_KEY = 'webServiceInformation';

  constructor(private http: HttpClient,
              private  router: Router) {
    this.apiEndpoint = `${environment.serviceEndpoint}/`;
    if (! localStorage.getItem(this.APP_PARAMS_KEY)) {
      this.http.get(`${this.apiEndpoint}`).subscribe(
        (response) => {
          localStorage.setItem(this.APP_PARAMS_KEY, JSON.stringify(response));
        }, this.handleError
      );
    }
  }

  private obtenerParametro(parametro: string): string {
    const allParams = JSON.parse(localStorage.getItem(this.APP_PARAMS_KEY));
    return allParams[parametro] || '';
  }

  private handleError(err) {
    console.error(`Error al obtener parametros: ${err.error}`);
  }

  get nombre() {
    return this.obtenerParametro('nombre');
  }
  get version() {
    return this.obtenerParametro('version');
  }
  get paquete() {
    return this.obtenerParametro('paquete');
  }
  get mensaje() {
    return this.obtenerParametro('mensaje');
  }
}
