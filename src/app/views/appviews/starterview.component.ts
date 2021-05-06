import { Component, OnDestroy, OnInit, } from '@angular/core';
import { SessionService } from 'src/app/auth/session.service';
import {ResumenInicio} from 'src/app/models/resumen-inicio';
import {StarterService} from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { FiltroDocumento } from 'src/app/models/filtro-documento';
import { EstadoDocumento } from 'src/app/models/enums';
import { Router } from '@angular/router';

@Component({
  selector: 'starter',
  templateUrl: 'starter.template.html'
})
export class StarterViewComponent implements OnDestroy, OnInit  {

  item = new ResumenInicio();
  loading: boolean;
  public nav:any;
  nombreUsuario: string;
  filtro: FiltroDocumento = new FiltroDocumento();

  private SESSION_KEY_FILTRO_MESA_PARTES = 'mesa-partes.filtro';
  private SESSION_KEY_FILTRO_RECIBIDOS = 'bandeja-recibidos.filtro';
  private SESSION_KEY_FILTRO_PENDIENTES = 'bandeja-pendientes.filtro';
  private SESSION_KEY_FILTRO_VISADOS = 'bandeja-visados.filtro';
  private SESSION_KEY_FILTRO_FIRMADOS = 'bandeja-firmados.filtro';
  private SESSION_KEY_FILTRO_PLAZO = 'bandeja-plazo.filtro';
  private SESSION_KEY_PAGINACION = 'bandeja-recibidos.paginacion';


  public constructor(private session: SessionService,
    private resumenService: StarterService,
    private toastr: ToastrService,
    private router: Router) {
    this.nav = document.querySelector('nav.navbar');
    this.loading = false;
    this.resumenService.resumen.subscribe((resultado: ResumenInicio) => {
      this.item = Object.assign(new ResumenInicio(), resultado);
      this.loading = false;
    });
  }

  public ngOnInit() {
    const nombre = this.session.User.nombUsuario;
    //const nombre = this.session.User.nombUsuario.split(' ')[0];
    //this.nombreUsuario = nombre[0].toUpperCase() + nombre.substr(1).toLowerCase();
    this.nombreUsuario = nombre;
    this.nav.className += " white-bg";
    this.loading = true;
    this.resumenService.obtenerResumen();
  }

  checkPermission(routename: string): boolean {
    return this.session.validatePermission(routename);
  }

  public ngOnDestroy():any {
    this.nav.classList.remove("white-bg");
  }
  public OnPendientes(rute:String){
    this.filtro.modalidad = 0;
    switch (rute){
      
      case '/mesa-partes':{
        this.filtro.estado = EstadoDocumento.INGRESADO;
        this.session.save(this.SESSION_KEY_FILTRO_MESA_PARTES, this.filtro);
        break;
      }

      case '/bandeja-entrada/recibidos':{
        this.filtro.estado = EstadoDocumento.PENDIENTE;
        this.session.save(this.SESSION_KEY_FILTRO_RECIBIDOS, this.filtro);
        break;
      }
      
      case '/bandeja-entrada/con-plazo/porvencer':{
        this.filtro.estado = "POR VENCER";
        this.session.save(this.SESSION_KEY_FILTRO_PLAZO, this.filtro);
        rute = '/bandeja-entrada/con-plazo';
        break;
      }
      
      case '/bandeja-entrada/con-plazo/vencidos':{
        this.filtro.estado = "VENCIDO";
        this.session.save(this.SESSION_KEY_FILTRO_PLAZO, this.filtro);
        rute = '/bandeja-entrada/con-plazo';
        break;
      }
      
      case '/bandeja-salida/pendientes':{
        this.filtro.estado = "OBSERVADO";
        this.session.save(this.SESSION_KEY_FILTRO_PENDIENTES, this.filtro);
        break;
      }
      
      case '/bandeja-salida/visados':{
        this.filtro.estado = "POR VISAR";
        this.session.save(this.SESSION_KEY_FILTRO_VISADOS, this.filtro);
        break;
      }
      
      case '/bandeja-salida/firmados':{
        this.filtro.estado = "POR FIRMAR";
        this.session.save(this.SESSION_KEY_FILTRO_FIRMADOS, this.filtro);
        break;
      }
    }
   
    this.router.navigate([rute]);
    //routerLink="/bandeja-entrada/recibidos"
  }
}
