/**
 * @package       TiposDocumentoModule
 * @class         TiposDocumentoEditarComponent
 * @description   formulario tipo documentos
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import {Component, OnInit} from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { Response, TipoDocumento } from '../../../models';
import { TiposDocumentoService } from '../../../services';
import {validate} from 'class-validator';
import {NivelError} from '../../../models/enums';

@Component({
  selector: 'tipos-documento-editar',
  styleUrls: ['editar.component.scss'],
  templateUrl: 'editar.template.html'
})
export class TiposDocumentoEditarComponent implements OnInit {
  /* codigo seleccionado */
  itemCodigo: string;
  /* datos */
  item: TipoDocumento;
  private sub: any;
  /* validacion */
  invalid: boolean;
  errors: any;
 
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: TiposDocumentoService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.item = new TipoDocumento();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo =  params['codigo'];
    });
    if (this.itemCodigo) {
      this.service.buscarPorCodigo(this.itemCodigo).subscribe(
        (response: Response) => this.item = Object.assign(new TipoDocumento(), <TipoDocumento>response.resultado),
        (error) => this.controlarError(error)
      );
    } else {
      this.item = this.service.crear();
      this.invalid = true;
    }
  }

  Validar(event: string) {
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
    this.item.descripcion = this.item.descripcion.trim().toUpperCase();
    this.item.abreviatura = this.item.abreviatura.trim().toUpperCase();
    validate(this.item).then(errors => {
      if (errors.length > 0) {
        this.invalid = true;
        let mensajes = errors.map(e => e.constraints[Object.keys(e.constraints)[0]]);
        this.toastr.warning(`Los siguientes campos no son válidos: ${mensajes.join(', ')}`, 'Acción inválida', {closeButton: true});
      } else {
        this.service.guardar(this.item).subscribe(
          (response: Response) => {
            if(response.estado == 'OK'){
              this.item = response.resultado;
              if(this.itemCodigo)
                this.toastr.success('El registro fue actualizado correctamente', 'Acción completada', {closeButton: true});
              else
                this.toastr.success('El registro fue creado correctamente', 'Acción completada', {closeButton: true});

              this.router.navigate([`mantenimiento/tipos-documento`]);
            }else{
              this.toastr.error(response.resultado, 'Error!', {closeButton: true});
            }
          },
          (response: Response) => this.controlarError(response)
        );
      }
    });
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }

  OnRegresar() {
    this.router.navigate([`mantenimiento/tipos-documento`]);
  }
}
