import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppSettings } from './app.settings';
import { SystemService } from './services/system.service';
import { SessionService } from './auth/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SystemService]
})
export class AppComponent implements OnInit {

  public constructor(private titleService: Title,
                    private system: SystemService,
                    private session: SessionService,
                    private router: Router) {
    this.titleService.setTitle( AppSettings.APP_TITLE );
  }

  ngOnInit() {
    if (!sessionStorage.getItem('expiresIn') || sessionStorage.getItem('expiresIn') === '0') {
      this.session.deleteSession();
      this.router.navigate(['/login']);
    }
  }

}

