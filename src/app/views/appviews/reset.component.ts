import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {SessionService} from '../../auth/session.service';
import {Router} from '@angular/router';
import {AppSettings} from '../../app.settings';

@Component({
  selector: 'reset',
  templateUrl: 'reset.template.html'
})
export class ResetComponent implements OnInit {

  id: string;
  name: string;
  copyright: string;
  version: string;
  username: string;
  oldPassword: string;
  newPassword: string;
  newPasswordCheck: string;
  waiting: boolean;
  requested: boolean;
  info: string;
  error: string;
 constructor(private auth: AuthService,
              private session: SessionService,
              private router: Router) {
    this.id = AppSettings.APP_ID;
    this.name = AppSettings.APP_NAME;
    this.copyright = AppSettings.APP_COPYRIGHT;
    this.version = AppSettings.APP_VERSION;
    this.waiting = false;
    this.requested = false;
  }

  ngOnInit() {
    if (this.session.isLoggedIn) {
      this.router.navigate(['/']);
    }
    if (this.auth.error) {
      this.error = this.auth.error;
    }
    if (this.auth.info) {
      this.info = this.auth.info;
    }
    this.auth.passwordRequested.subscribe((resetResult: number) => {
      switch (resetResult) {
        case 0:
          this.waiting = false;
          this.requested = false;
          this.error = this.auth.error || null;
          this.info = this.auth.info || null;
          break;
        case 1:
          this.waiting = false;
          this.requested = true;
          this.error = this.auth.error || null;
          this.info = this.auth.info || null;
          break;
        case 2:
          this.router.navigate(['/login']);
          break;
      }
    });
  }

  doRequest(form) {
    if (!form.valid) {
      if (!this.username) { this.error = 'Debe ingresar su nombre de usuario'; return; }
    }
    this.waiting = true;
    this.auth.requestPassword(this.username);
  }

  doReset(form) {
    this.error = '';
    if (!form.valid) {
      if (!this.oldPassword) { this.error = 'Debe ingresar la contraseña temporal'; return; }
      if (!this.newPassword) { this.error = 'Debe ingresar su nueva contraseña'; return; }
      if (!this.newPasswordCheck) { this.error = 'Debe repetir la nueva contraseña'; return; }
      if (this.newPassword !== this.newPasswordCheck) { this.error = 'La contraseñas no coinciden'; return; }
    }
    this.waiting = true;
    if (this.requested) {
      this.auth.resetPassword(this.username, this.oldPassword, this.newPassword, this.newPasswordCheck);
    }
  }

  doLogin() {
    this.router.navigate(['/login']);
  }
}
