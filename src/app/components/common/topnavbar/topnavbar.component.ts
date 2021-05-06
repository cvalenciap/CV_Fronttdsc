import { Component, OnInit } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { AppSettings } from '../../../app.settings';
import { AuthService } from 'src/app/auth/auth.service';
import { SessionService } from 'src/app/auth/session.service';
declare var jQuery:any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopNavbarComponent implements OnInit {

  nombreSistema: string;
  codigoUsuario: number;
  nombreUsuario: string;
  inicialesUsuario: string;
  perfilUsuario: string;
  areaUsuario: string;
  abrevArea: string;

  fullScreen: boolean;
  login: string;

  constructor(private auth: AuthService, private session: SessionService) {
    this.nombreSistema = AppSettings.APP_NAME;
  }

  ngOnInit() {
    this.codigoUsuario = this.session.User.codFicha;
    this.nombreUsuario = this.session.User.nombUsuario;
    const s = this.session.User.nombUsuario.split(' ').map((item) => item.trim());
    if (s.length > 1 && s[0][0] && s[1][0]) {
      this.inicialesUsuario = (s[0][0] + s[1][0]).toUpperCase();
    } else {
      this.inicialesUsuario = this.session.User.nombUsuario.substr(0, 2).toUpperCase();
    }
    this.perfilUsuario = this.session.User.descPerfil;
    this.areaUsuario = this.session.User.descArea;
    this.abrevArea = this.session.User.abrevArea;
    this.login = this.session.User.codUsuario;
  }

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

  fullScreenMode(): void {
    let elem: any;
    elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
    this.fullScreen = true;
  }

  restoreScreen(): void {
    let elem: any;
    elem = document;
    if (elem.exitFullscreen) {
      elem.exitFullscreen();
    } else if (elem.mozCancelFullScreen) { /* Firefox */
      elem.mozCancelFullScreen();
    } else if (elem.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitExitFullscreen();
    } else if (elem.msExitFullscreen) { /* IE/Edge */
      elem.msExitFullscreen();
    }
    this.fullScreen = false;
  }

  OnLogout() {
    this.auth.logout();
  }

}
