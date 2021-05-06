/**
 * @package       AsuntosModule
 * @class         AsuntosEditarComponent
 * @description   formulario asuntos
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { AsuntosService as AsuntosService } from '../../../services';
import { Response, Asunto } from '../../../models';
import { Estado, NivelError } from '../../../models/enums';
import {validate} from 'class-validator';

@Component({
  selector: 'asuntos-editar',
  templateUrl: 'editar.template.html',
  styleUrls: ['editar.component.scss'],
  providers: [AsuntosService]
})
export class AsuntosEditarComponent implements OnInit {

  itemCodigo: number;
  item = new Asunto();
  private sub: any;
  invalid: boolean;
  errors: any;

  constructor(private localeService: BsLocaleService, private toastr: ToastrService, private router: Router,
              private route: ActivatedRoute, private service: AsuntosService){
              defineLocale('es', esLocale);
              this.localeService.use('es');
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = +params['codigo'];
    });
    if (this.itemCodigo) {
      this.service.buscarPorCodigo(this.itemCodigo).subscribe(
        (response:Response) => this.item = Object.assign(new Asunto(), <Asunto>response.resultado),
        (error) => this.controlarError(error)
      );
    } else {
      this.item = this.service.crear();
    }
  }

  Validar(event) {
    console.log(event);
    validate(this.item).then( errors => {
      console.log(errors);
      this.errors = {};
      this.invalid = errors.length > 0;
      if (errors.length > 0) {
        errors.map(e => {
          this.errors[e.property] = e.constraints[Object.keys(e.constraints)[0]];
        });
      }
      console.log(this.errors);
    });
  }

  OnGuardar() {
    /* validar objeto */
    this.item.descripcion = this.item.descripcion.trim().toUpperCase();
    validate(this.item).then(errors => {
      if (errors.length > 0) {
        this.invalid = true;
        let mensajes = errors.map(e => e.constraints[Object.keys(e.constraints)[0]]);
        this.toastr.warning(`Los siguientes campos no son válidos: ${mensajes.join('\n')}`, 'Acción inválida');
      } else {
        this.service.guardar(this.item).subscribe(
          (response: Response) => {
            this.item = response.resultado;
            if (this.itemCodigo) {
              this.toastr.success('El registro fue actualizado correctamente', 'Acción completada!');
            } else {
              this.toastr.success('El registro se guardó correctamente', 'Acción completada!');
            }
            this.router.navigate([`mantenimiento/asuntos`]);
          },
          (response: Response) => this.controlarError(response)
        );
      }
    });
  }

  OnRegresar() {
    this.router.navigate([`mantenimiento/asuntos`]);
    }

  controlarError(response){
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }
}

