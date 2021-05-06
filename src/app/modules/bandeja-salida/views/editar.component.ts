import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import { Location } from '@angular/common';

import {SessionService} from './../../../auth/session.service';
import {Response, Documento, DocumentoComentario, Trabajador} from '../../../models';
import {BandejaSalidaService} from '../../../services';
import {FirmaDigitalComponent} from '../../../components/firma-digital/firma-digital.component';
import { environment } from 'src/environments/environment.prod';
import { NivelError } from '../../../models/enums';

@Component({
  //selector: 'bandeja-salida-editar',
  templateUrl: 'editar.template.html'
})
export class EditarDocumentoComponent implements OnInit {

  itemCodDocumento: string;
  itemCodMovimiento: string;
  item: Documento = new Documento();
  /*Herencia ciclica*/
  jefe: Trabajador = new Trabajador();
  accionDocumento: string = "";
  acciones: string[];
  private sub: any;
  // parametros usados para firma digital
  tipoFirma: string;
  codigoFirma: number;
  rutaDocumento: string;
  urlPDF : string;
  private fechaActual = new Date();

  @ViewChild('firmaDigital') private firmaDigital: FirmaDigitalComponent;
  @ViewChild('firmaDigitalSwal') private firmaDigitalSwal: SwalComponent;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private _location: Location,
              private route: ActivatedRoute,
              private session: SessionService,
              private bandejaService: BandejaSalidaService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.itemCodDocumento = params['codDocumento'];
      this.itemCodMovimiento = params['codMovimiento'];
    });

    if (this.itemCodDocumento && this.itemCodMovimiento) {
      this.bandejaService.buscarPorDocumento(this.itemCodDocumento, this.itemCodMovimiento).subscribe(
        (response: Response) => {
          console.log(response);
          this.acciones = response.acciones;
          this.item = response.resultado;
          this.jefe = this.item.areaRemitente.jefe;
          this.tipoFirma = this.item.movimiento.accionDocumento;
          this.codigoFirma = this.session.User.codFicha;
          this.accionDocumento = this.item.movimiento.accionDocumento;
          this.rutaDocumento = this.item.urlDocumento;
        },
        (response: Response) => this.controlarError(response),
      );
    } else {
      this.item = this.bandejaService.crearDocumento();
    }

  }

  DoVisar() {
    this.bandejaService.visarDocumento(this.item).subscribe(
      (response: Response) => {
        if (response.estado === 'OK') {
            this.toastr.success('El documento se visó correctamente', 'Acción completada!', {closeButton: true});
            if (this.accionDocumento === 'VB') {
              this.router.navigate(['bandeja-salida/visados']);
            }
        }
      },
      (response: Response) => this.controlarError(response),
    );
  }

  DoFirmar() {
    this.bandejaService.firmarDocumento(this.item).subscribe(
      (response: Response) => {
        if (response.estado === 'OK') {
          this.toastr.success('El documento se firmó correctamente', 'Acción completada!', {closeButton: true});
          if (this.accionDocumento === 'FR') {
            this.router.navigate(['bandeja-salida/firmados']);
          }
        }
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnFirmaDigitalIniciar() {
    // iniciar firma digital
    this.firmaDigitalSwal.show();
  }
  OnFirmaDigitalFinalizar(e: any) {
    this.firmaDigitalSwal.nativeSwal.close();
    if (e.ok) {
      this.toastr.info('El documento fue firmado digitalmente', 'Acción completada!', {closeButton: true});
      // actualizar estado del documento
      switch (this.accionDocumento) {
        case 'VB': this.DoVisar(); break;
        case 'FR': this.DoFirmar(); break;
      }
    } else {
      this.toastr.error(`${e.mensaje}. El estado del documento no ha sido alterado.`,
        'Error con componente de Firma Digital', {closeButton: true});
    }
  }

  OnObservar() {
    this.bandejaService.observarDocumento(this.item).subscribe(
      (response: Response) => {
        if (response.estado === 'OK') {
          this.toastr.info('El documento se observó correctamente', 'Acción completada!', {closeButton: true});
          if (this.accionDocumento === 'VB') {
            this.router.navigate(['bandeja-salida/visados']);
          } else if (this.accionDocumento === 'FR') {
            this.router.navigate(['bandeja-salida/firmados']);
          }
        }
      },
      (response: Response) => this.controlarError(response),
    );
  }

  OnComentar(descripcion: string) {
    this.bandejaService.guardarComentarios(this.item.movimiento.codigo, descripcion).subscribe(
      (response: Response) => {
        this.toastr.info('El comentario se registró correctamente', 'Acción completada!', {closeButton: true});
      },
      (response: Response) => this.controlarError(response),
    );
  }
  OnRegresar() {
    /*
    if(this.accionDocumento=="VB"){
      this.router.navigate(['bandeja-salida/visados']);
    }
    if(this.accionDocumento="FR"){
      this.router.navigate(['bandeja-salida/firmados']);
    }
    */
   this._location.back();
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
    //if( this.loading ) this.loading = false;
  }
}
