import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { User } from './user';
import { StarterService } from '../services/impl/starter.service';

(window as any).global = window;

@Injectable({ providedIn: 'root' })
export class SessionService {

  private expiresAt: number;
  private authenticated: boolean;
  accessToken: string;
  private userProfile: User;
  private permissions: string[];
  private _expired: boolean;

  constructor(private starterService: StarterService) {
    //if ((this.accessToken === null || this.accessToken === undefined)  && sessionStorage.getItem('accessToken')) {
    this.expiresAt = Number(sessionStorage.getItem('expiresIn')) * 60000 + Date.now();
    this.accessToken = sessionStorage.getItem('accessToken');
    this.userProfile = JSON.parse(sessionStorage.getItem('currentUser'));
    this.permissions = null;
    //this.authenticated = true;
  }

  setSession(authResult) {
    // Save authentication data and update login status subject
    this.expiresAt = authResult.expiresIn * 60000 + Date.now();
    this.accessToken = authResult.token;
    this.userProfile = authResult.userProfile;
    this.authenticated = true;
    sessionStorage.setItem('expiresIn', authResult.expiresIn);
    sessionStorage.setItem('accessToken', authResult.token);
    sessionStorage.setItem('currentUser', JSON.stringify(authResult.userProfile));
  }

  updateExpiration() {
    // Update session expiration date
    this.expiresAt = Number(sessionStorage.getItem('expiresIn')) + Date.now();
  }

  expireSession() {
    this.deleteSession();
    this._expired = true;
  }

  deleteSession() {
    // remove user from local storage to log user out
    this.authenticated = false;
    this.accessToken = null;
    this.userProfile = null;
    this.expiresAt = null;
    this.permissions = null;
    sessionStorage.removeItem('expiresIn');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('currentUser');
    sessionStorage.clear();
    this.starterService.reset();
  }

  public getAuthorities(): string[] {
    this.permissions = [];
    if (sessionStorage.getItem('accessToken')) {
      this.permissions = this.userProfile.permisos;
      this.permissions.push('/inicio');
      if (this.permissions.includes('/bandeja-entrada')) {
        this.permissions.push('/bandeja-entrada/recibidos');
        this.permissions.push('/bandeja-entrada/con-plazo');
      }
    }
    return this.permissions;
  }

  public validatePermission(permission: string): boolean {
    // Validar si usuario posee un permiso
    if (permission[0] !== '/') { permission = `/${permission}`; }
    const urls = this.getAuthorities();
    return urls.includes(permission);
  }

  get User() {
    // Return user profile
    return this.userProfile;
  }

  get isLoggedIn(): boolean {
    // Check if current date is before token
    // expiration and user is signed in locally
    return (Date.now() < this.expiresAt) && this.authenticated;
  }

  get expired(): boolean {
    // Check if current date is before token expiration
    /*if(this.expiresAt!=null){
      return Date.now() > this.expiresAt;
    }*/
    // return  (Date.now() > this.expiresAt) && this.authenticated;
    return this._expired;
  }

  public read(key: string) {
    const value = sessionStorage.getItem(key);
    try {
      const obj = JSON.parse(value);
      return obj;
    } catch (e) {
      return value;
    }
  }
  public save(key: string, value: any) {
    if (typeof value === 'object' || Array.isArray(value)) {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      sessionStorage.setItem(key, (typeof value !== 'string') ? value.toString() : value);
    }
  }
}
