import { Component, AfterViewInit, Input, Output, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from '../../../services';
import { Representante, Tipo, Response } from '../../../models';
import { NivelError } from '../../../models/enums';
import {validate} from 'class-validator';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';


@Component({
  selector: 'representantes-editar',
  styleUrls: ['representante-editar.component.scss'],
  templateUrl: 'representante-editar.template.html'
})
export class RepresentantesEditarComponent implements OnInit{
  @Input('item')
  item : Representante;
  listaTiposDocumento : Tipo[];
  listaTiposRepresentante : Tipo[];
  invalid: boolean;
  errors: any;ng;
  fechaRegistro : string;
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private service: EmpresasService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.item = new Representante;
  }
  ngOnInit(){
    this.service.obtenerTipos().subscribe(
      (response: Response) => {
        this.listaTiposDocumento = response.resultado.listaTiposDocumento;
        this.listaTiposRepresentante = response.resultado.listaTiposRepresentante;
      },
      (error) => this.controlarError(error)
    );
  }
  showSuccess() {
    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
  }

  showError() {
    this.toastr.info('Registro eliminado', 'Acción completada!', {closeButton: true});
  }
  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }
  ModificacionTrigger(){
    if(!this.item.estadoModificado){
      this.item.estadoModificado = 1;
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
}
