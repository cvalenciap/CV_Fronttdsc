import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Response, ResumenInicio} from '../../models';
import {environment} from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root',
})
export class StarterService {

  private apiEndpoint: string;
  private _updated: boolean;
  resumen: BehaviorSubject<ResumenInicio>;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/bandejas/';
    this._updated = false;
    this.resumen = new BehaviorSubject(new ResumenInicio());
  }

  private consultarResumenInicio() {
    const url = `${this.apiEndpoint}resumen`;
    return this.http.get(url).subscribe(
      (response: Response) => {
        const resumen: ResumenInicio = Object.assign(new ResumenInicio(), <ResumenInicio>response.resultado);
        this.resumen.next(resumen);
        this._updated = true;
      }
    );
  }

  obtenerResumen(): void {
    this.consultarResumenInicio();
    /*if (!this._updated) {
      this.consultarResumenInicio();
    }*/
  }

  reset(): void {
    this.resumen = new BehaviorSubject(new ResumenInicio());
  }
}


