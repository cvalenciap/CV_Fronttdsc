import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

(window as any).global = window;

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiEndpoint: string;
  expiresAt: Date;
  authenticated: BehaviorSubject<boolean>; // false=sin autenticar, true=autenticado
  passwordRequested: BehaviorSubject<0 | 1 | 2>; // 0=solicitar password, 1=actualizar password, 2=password actualizado
  accessToken: string;
  userProfile: any;
  info: string;
  error: string;

  constructor(private http: HttpClient,
              private router: Router,
              private session: SessionService) {
    this.apiEndpoint = `${environment.serviceEndpointAuth}`;
    this.authenticated = new BehaviorSubject(null);
    this.passwordRequested = new BehaviorSubject(null);
  }

  login(username: string, password: string) {
    this.info = null;
    this.error = null;
    const loginParams = {username, password};
    this.http.post<any>(`${this.apiEndpoint}/login`, loginParams).subscribe(
      (response) => {
        if (response && response.resultado && response.resultado.token) {
          this.session.setSession(response.resultado);
          this.authenticated.next(true);
          window.location.hash = '';
          this.router.navigate(['/']);
        } else {
          this.error = 'El procedimiento de autenticación no se realizó correctamente';
          this.authenticated.next(false);
        }
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
         this.error = 'Ocurrió un error al durante la conexión con el servicio de autenticación'; 
        } else {
          switch (errorResponse.status) {
            case 400:
            case 401:
            case 403:
              this.error = errorResponse.error.error.mensaje;
              break;
            case 404:
              this.error = 'La configuración del servicio de autenticación no es correcta';
              break;
            case 500:
            default:
              //this.error = 'Ocurrió un error durante el proceso de autenticación';
              {
                this.error = errorResponse.error.mensajeInterno;
                console.log(this.error);
              }
          }
          if (! environment.production) {
            console.error(`Auth Error:`, errorResponse.error);
          }
        }
        this.authenticated.next(false);
      });
  }

  logout() {
    this.http.post<any>(`${this.apiEndpoint}/logout`, {}).subscribe(
      (response) => {
        // clear session info
        this.session.deleteSession();
        this.error = null;
        this.authenticated.next(false);
        this.router.navigate(['/login']);
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error = 'Ocurrió un error al durante la cngonexión con el servicio de autenticación';
        } else if (errorResponse.status !== 200) {
          switch (errorResponse.status) {
            case 404:
              this.error = 'La configuración del servicio de autenticación no es correcta';
              break;
            case 500:
            default:
              this.error = 'Ocurrió un error durante el proceso de autenticación';
          }
          console.error(`Auth Error: ${this.error}`);
        }
        // clear session info
        this.session.deleteSession();
        this.authenticated.next(false);
        this.router.navigate(['/login']);
      }
    );
  }

  requestPassword(username: string) {
    this.info = null;
    this.error = null;
    const requestParams = {username};
    this.http.post<any>(`${this.apiEndpoint}/login/password/request`, requestParams).subscribe(
      (response) => {
        if (response && response.resultado) {
          this.info = response.resultado;
          this.passwordRequested.next(1);
        } else {
          this.error = 'La solicitud no se realizó correctamente';
          this.passwordRequested.next(0);
        }
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error = 'Ocurrió un error al durante la conexión con el sistema de seguridad';
        } else {
          switch (errorResponse.status) {
            case 401:
            case 404:
              this.error = errorResponse.error.error.mensaje;
              break;
            case 500:
            default:
              this.error = 'Ocurrió un error durante la solicitud';
          }
          if (! environment.production) {
            console.error(`Auth Error:`, errorResponse.error);
          }
        }
        this.passwordRequested.next(0);
      }
    );
  }

  resetPassword(username: string, oldPassword: string, newPassword: string, newPasswordCheck: string) {
    this.info = null;
    this.error = null;
    const requestParams = {username};
    this.http.post<any>(`${this.apiEndpoint}/login/password/reset`, requestParams).subscribe(
      (response) => {
        if (response && response.resultado) {
          this.info = response.resultado;
          this.passwordRequested.next(2);
        } else {
          this.error = 'La solicitud no se realizó correctamente';
          this.passwordRequested.next(1);
        }
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error = 'Ocurrió un error al durante la conexión con el sistema de seguridad';
        } else {
          switch (errorResponse.status) {
            case 401:
            case 404:
              this.error = errorResponse.error.error.mensaje;
              break;
            case 500:
            default:
              this.error = 'Ocurrió un error durante la solicitud';
          }
          if (! environment.production) {
            console.error(`Auth Error:`, errorResponse.error);
          }
        }
        this.passwordRequested.next(1);
      }
    );
  }
}
