import { Component, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from 'src/app/auth/session.service';
import {StarterService} from '../../../services';
import {ResumenInicio} from '../../../models';
import 'jquery-slimscroll';

declare var jQuery:any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html'
})

export class NavigationComponent implements AfterViewInit {

  contadores = new ResumenInicio();

  constructor(private router: Router, private session: SessionService, private resumenService: StarterService) {
    // obtener resumen
    this.resumenService.resumen.subscribe((resultado: ResumenInicio) => {
      this.contadores = Object.assign(new ResumenInicio(), resultado);
    });
  }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  checkPermission(routename: string): boolean {
    return this.session.validatePermission(routename);
  }
   
  OnDireccionar(opcion: string) {

    switch (opcion) {
      case '/mesa-partes':
        this.session.save('mesa-partes.filtro',null);
        this.session.save('mesa-partes.paginacion',null);       
        break;      
      case '/bandeja-entrada/recibidos':   
        this.session.save('bandeja-recibidos.filtro',null);
        this.session.save('bandeja-recibidos.paginacion',null); 
        break;
      case '/bandeja-entrada/con-plazo':   
        this.session.save('bandeja-plazo.filtro',null);
        this.session.save('bandeja-plazo.paginacion',null); 
        break;
      case '/bandeja-salida/pendientes':
        this.session.save('bandeja-pendientes.filtro',null);
        this.session.save('bandeja-pendientes.paginacion',null); 
        break;
      case '/bandeja-salida/visados':
        this.session.save('bandeja-visados.filtro',null);
        this.session.save('bandeja-visados.paginacion',null); 
        break;
      case '/bandeja-salida/firmados':
        this.session.save('bandeja-firmados.filtro',null);
        this.session.save('bandeja-firmados.paginacion',null); 
        break;
      /* case '/mantenimiento/tipos-documento':
        this.session.save('bandeja-plazo.filtro',null);
        this.session.save('bandeja-plazo.paginacion',null); 
        break; 
        case '/mantenimiento/asuntos':
        this.session.save('bandeja-plazo.filtro',null);
        this.session.save('bandeja-plazo.paginacion',null); 
        break;
        case '/mantenimiento/empresas':
        this.session.save('bandeja-plazo.filtro',null);
        this.session.save('bandeja-plazo.paginacion',null); 
        break;
        case '/mantenimiento/feriados':
        this.session.save('bandeja-plazo.filtro',null);
        this.session.save('bandeja-plazo.paginacion',null); 
        break; */
    }
    console.log(opcion);
    this.router.navigate([opcion]);
    //this.router.navigate([opcion], { skipLocationChange: true });
    
  }


}
