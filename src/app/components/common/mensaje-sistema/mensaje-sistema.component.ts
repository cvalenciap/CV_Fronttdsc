import { Component, OnInit } from '@angular/core';
import { SystemService } from 'src/app/services/system.service';

declare var jQuery:any;

@Component({
  selector: 'mensaje-sistema',
  templateUrl: 'mensaje-sistema.template.html',
  styleUrls: [ 'mensaje-sistema.component.scss' ],
  providers: [SystemService]
})
export class MensajeSistemaComponent implements OnInit {

  mensaje:string;

  constructor(private sistema: SystemService) {
    this.mensaje = sistema.mensaje;
  }

  ngOnInit() {
    jQuery(".marquee .system-message").text(this.mensaje);
  }
}
