import { Injectable, Component } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  template: `<body></body>`, 
  providers:[SessionService]
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private session: SessionService
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let authReq = request;
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let token = sessionStorage.getItem('accessToken');

    if (currentUser && token) {
      //this.session.updateExpiration(); 
      //console.log(this.session.accessToken);
      authReq = request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) });
    }

    return next.handle(authReq);
  }
}
