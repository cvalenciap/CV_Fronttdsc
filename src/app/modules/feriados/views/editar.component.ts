/**
 * @package       FeriadosModule
 * @class         FeriadosEditarComponent
 * @description   formulario feriados
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
import {FeriadosService} from '../../../services';
import {Tipo, Feriado, Response} from '../../../models';
import {NivelError} from '../../../models/enums';
import {validate} from 'class-validator';
import * as moment from 'moment';

@Component({
  selector: 'feriados-editar',
  templateUrl: 'editar.template.html',
  styleUrls: ['editar.component.scss'],
  providers: [FeriadosService]
})

export class FeriadosEditarComponent implements OnInit {

  /* codigo seleccionado */
  itemCodigo: number;
  /* datos */
  listaTipos: Tipo[];
  //item: Feriado;
  item = new Feriado();
  private sub: any;
  /* validación */
  invalid: boolean;
  errors: any;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: FeriadosService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.service.obtenerTipos().subscribe(
      (response: Response) => {
        this.listaTipos = response.resultado;
        this.item.tipo = this.listaTipos[0];
      },
      (error) => this.controlarError(error)
    );

    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = + params['codigo'];
    });
    if (this.itemCodigo) {
      this.service.buscarPorCodigo(this.itemCodigo).subscribe(
        (response: Response) => {
          this.item = Object.assign(new Feriado(), <Feriado>response.resultado);
          // fix: cuando es fecha actual datepicker muestra 'Invalid Date'
          this.item.fecha = moment(this.item.fecha).toDate();
        },
        (error) => this.controlarError(error)
      );
    }else {
      this.item = this.service.crear();
    }
  }

  Validar(event) {
    validate(this.item).then( errors => {
      this.errors = {};
      this.invalid = errors.length > 0;
      if (errors.length > 0) {
        errors.map(e => {
          this.errors[e.property] = e.constraints[Object.keys(e.constraints)[0]];
        });
      }
    });
  }

  OnGuardar() {
    this.item.descripcion = this.item.descripcion.trim().toUpperCase();
    if(this.item.tipo.codigo.trim()==""){
      this.toastr.warning('Seleccione un tipo de feriado', 'Acción Inválida');
      return;
    }
    validate(this.item).then(errors => {
      if (errors.length > 0) {
        this.invalid = true;
        let mensajes = errors.map(e => e.constraints[Object.keys(e.constraints)[0]]);
        this.toastr.warning(`Los siguientes campos no son válidos: ${mensajes.join('. ')}`, 'Acción inválida');

      } else {
        this.item.descripcion = this.item.descripcion.toUpperCase();
        this.service.guardar(this.item).subscribe(
          (response:Response) => {
            this.item = response.resultado;
            if (this.itemCodigo) {
              this.toastr.success('El registro fue actualizado correctamente', 'Acción completada!');
            } else {
              this.toastr.success('El registro fue creado correctamente', 'Acción completada!');
            }
            this.router.navigate([`mantenimiento/feriados`]);
          },
          (response: Response) => this.controlarError(response)
        );
      }
    });
  }

  OnRegresar() {
   this.router.navigate([`mantenimiento/feriados`]);
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }
}
