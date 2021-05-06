import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {SessionService} from '../../auth/session.service';
import {Router} from '@angular/router';
import {AppSettings} from '../../app.settings';

@Component({
  selector: 'login',
  templateUrl: 'login.template.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

  id: string;
  name: string;
  copyright: string;
  version: string;
  username: string;
  password: string;
  loading: boolean;
  error: string;

  constructor(private auth: AuthService,
              private session: SessionService,
              private router: Router) {
    this.id = AppSettings.APP_ID;
    this.name = AppSettings.APP_NAME;
    this.copyright = AppSettings.APP_COPYRIGHT;
    this.version = AppSettings.APP_VERSION;
    this.loading = false;
    this.error = '';
  }

  ngOnInit() {
    if (this.session.isLoggedIn) {
      this.router.navigate(['/']);
    }
    if (this.session.expired) {
      this.error = 'Su sesión ha expirado';
    } else if (this.auth.error) {
      this.error = this.auth.error;
    }
    this.auth.authenticated.subscribe((loginResult: boolean) => {
      if (!loginResult && this.auth.error) { this.error = this.auth.error; }
    });
  }

  doLogin(form) {
    this.error = '';
    if (form.valid) {
      this.loading = true;
      this.auth.login(this.username, this.password);
    } else {
      if (!this.username) { this.error = 'Debe ingresar su nombre de usuario'; return; }
      if (!this.password) { this.error = 'Debe ingresar su contraseña'; return; }
    }
  }

  doRecover() {
    this.router.navigate(['/login/reset']);
  }
}
