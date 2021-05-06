/**
 * @package       SecuencialesModule
 * @class         SecuencialesEditarComponent
 * @description   formulario secuenciales
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {SecuencialesService} from '../../../services';
import {Response, Secuencial} from '../../../models';
import {validate,Matches} from 'class-validator';
import {HttpErrorResponse} from '@angular/common/http';
import { NivelError } from '../../../models/enums';

@Component({
  selector: 'secuenciales-editar',
  templateUrl: 'editar.template.html',
  providers: [SecuencialesService]
})
export class SecuencialesEditarComponent implements OnInit {

  /* codigo seleccionado */
  itemCodigo: string;
  itemVal: string;
  item = new Secuencial();
  private sub: any;
 // invalid = false;
  invalid: boolean;
  errors: any;
  flagDeshabilita:boolean;
  flagValido : boolean;
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: SecuencialesService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.flagDeshabilita=true;
    this.flagValido=false;
  }

  ngOnInit() {
    console.log("inicio");
     this.sub = this.route.params.subscribe(params => {
        this.itemCodigo = params['codTipDoc'];
     });

     if (this.itemCodigo) {
        this.service.buscarPorCodigo(this.itemCodigo).subscribe(
          (response: Response) => this.item = Object.assign(new Secuencial(), <Secuencial>response.resultado),
           (error) => this.controlarError(error)
        );
     } else {
        this.item = this.service.crear();
     }
  }

  Validar(){
    //this.flagDeshabilita=false;
    if (!this.item.correlativo){
      this.toastr.warning('Ingrese correlativo', 'Acción Inválida', {closeButton: true});
      this.flagDeshabilita=true;
      return;
    }

    if (this.item.correlativo && !(this.item.correlativo.toString().match(/^[0-9]*$/)!=null) ){
      this.flagDeshabilita=true;
      this.toastr.warning('Ingrese código numérico válido', 'Acción Inválida', {closeButton: true});

      return;
    }
    this.service.validarCorrelativo(this.item).subscribe(
      (response: Response) =>{
        console.log(response);
        //this.item = response.resultado;
        this.flagDeshabilita = false;
        this.flagValido = true;
        this.toastr.info('El valor de secuencial es válido. Haga clic en Guardar para confirmar el cambio.', 'Trabajador Válido');
      },
      (response: Response) => this.controlarError(response)
      /* (response: HttpErrorResponse) => {
        if(response.status == 500) {
          this.controlarError(response.error)
        } else {
          console.log("Entro");
          this.flagValido = true;
          this.controlarValidacion(response.error);
        }
      } */
    );
  }

  OnGuardar() {

  if (!(this.item.correlativo.toString().match(/^[0-9][0-9 ]*$/)!=null) ){
    this.toastr.warning('Ingrese valor numérico', 'Acción Inválida', {closeButton: true});
    this.flagDeshabilita=true;
    return;
  }
  validate(this.item).then(errors => {
    if (this.item.correlativo==0) {
      this.invalid = true;
      let mensajes = errors.map(e => e.constraints[Object.keys(e.constraints)[0]]);
      this.toastr.error(`Los siguientes campos no son válidos:${mensajes.join('')}`, 'Acción inválida', {closeButton: true});
      this.flagDeshabilita=true;
    } else {
      this.service.guardar(this.item).subscribe(
        (response:Response) => {
          this.item = response.resultado;
          this.toastr.success('El registro se guardó correctamente', 'Acción completada!', {closeButton: true});
          this.router.navigate([`despacho/secuenciales`]);
        },
        (response: Response) => this.controlarError(response)
      );
    }
  });
}

  OnRegresar() {
     this.router.navigate([`despacho/secuenciales`]);
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.flagDeshabilita=true;
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }
  OnAgregar(){
     console.log("Agrega");
  }

  OnEliminar(){
     console.log("Elimina");
  }
  controlarValidacion(response) {
    this.flagDeshabilita=true;
    if (response.error && response.error.mensaje) {
      this.toastr.warning(response.error.mensaje, 'Acción Inválida', {closeButton: true});
    }
  }
}
