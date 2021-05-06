import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private session: SessionService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!sessionStorage.getItem('currentUser') && this.session.expired)  {
      this.router.navigate(['/login']);
      return false;
    }
    /*if (!this.session.validatePermission(this.router.url)) {
      console.log('no puede', this.session);
      this.router.navigate(['/inicio']);
      return false;
    }*/
    return true;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!sessionStorage.getItem('currentUser') && this.session.expired)  {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}
