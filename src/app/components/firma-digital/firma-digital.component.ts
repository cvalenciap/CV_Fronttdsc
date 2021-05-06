/**
 * @package       FirmaDigitalModule
 * @class         FirmaDigitalComponent
 * @description   Componente de firma digital
 * @author        Daniel Salas
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * FON_SED-031      DSALASD     24/01/2018    Creación del componente
 * -------------------------------------------------------------------------------------
 */
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IConfigFirma } from './config/iconfig-firma';
import { VisarConfig } from './config/visar';
import { FirmarConfig } from './config/firmar';
import { environment } from '../../../environments/environment';

@Component({
  selector: '<firma-digital>',
  templateUrl: './firma-digital.template.html'
})
export class FirmaDigitalComponent implements OnInit, AfterViewInit, OnDestroy {

  public firma: IConfigFirma;
  public altoFrame: number;
  public anchoFrame: number;

  @Input('tipo') // para determinar la configuración
  tipo: 'VB' | 'FR' = 'VB';
  @Input('id') // usar ficha o código de trabajador
  id = '0';
  @Input('imagen') // nombre de imagen
  imagen = '';
  @Input('comentario') // texto de comentario
  comentario = '';
  @Input('archivos') // array de nombres de archivos
  archivos: string[] = [];

  @Output() finalizar = new EventEmitter<any>();

  @ViewChild('ssoForm') ssoForm: ElementRef;

  listenerFn: () => void; // capturar listener

  constructor(private renderer: Renderer2) {
    if (this.listenerFn) {
      // función que descarta el listener
      this.listenerFn();
    }
    if (environment.firmaDisponible) {
      // registrar evento para capturar respuesta de componente de firma
      this.RegistrarEventoFirma();
    }
  }

  ngOnInit() {
    this.altoFrame = 300;
    this.anchoFrame = 600;
    switch (this.tipo) {
      case 'VB':
        this.firma = new VisarConfig();
        break;
      case 'FR':
        this.firma = new FirmarConfig();
        break;
      default:
    }
    this.firma.alias = '12345678'; // DNI de prueba this.id;
    this.firma.nombreImagen = this.imagen || null;
    this.firma.comentario = this.comentario || null;
    this.firma.archivos = this.archivos.map((item: string) => {
      return item.replace(environment.serviceFileServerEndPoint, '')
      .replace(environment.firmaRutaDestino, '')
      .replace(/^\//, '')
      .replace(/\/$/, '');
    });
  }

  ngAfterViewInit() {
    if (environment.firmaDisponible) {
      this.ssoForm.nativeElement.submit();
    } else {
      console.log(this.firma);
      // simular firma OK
      setTimeout(() => { this.finalizar.emit({ok: true}); }, 2000);
    }
  }

  RegistrarEventoFirma() {
    if (!environment.production) { console.info('iniciar componente de Firma Digital'); }
    this.listenerFn = this.renderer.listen('window', 'message', (e: any) => {
      if (!environment.production) { console.log('respuesta de componente', e); }
      if (e && e.data) {
        const respuesta = JSON.parse(e.data);
        if (respuesta && respuesta.resultado) {
          if (respuesta.resultado == 0) {
            this.finalizar.emit({ok: true});
            console.info(respuesta.estado);
          } else {
            this.finalizar.emit({ok: false, mensaje: 'Se presentaron problemas al firmar el documento'});
            console.error(respuesta.estado);
          }
        } else {
          this.finalizar.emit({ok: false, mensaje: 'No se pudo obtener el resultado de firmado'});
        }
      } else {
        this.finalizar.emit({ok: false, mensaje: 'No se obtuvo respuesta del servidor de firma'});
      }
      // función que descarta el listener
      this.listenerFn();
    });
  }

  ngOnDestroy() {
    if (this.listenerFn) {
      // función que descarta el listener
      this.listenerFn();
    }
  }
}

