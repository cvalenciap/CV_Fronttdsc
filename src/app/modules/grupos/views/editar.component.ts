import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {GruposService, ParametrosService} from '../../../services';
import {Response, Area, Grupo, Paginacion} from '../../../models';
import {validate} from 'class-validator';
import {NivelError} from '../../../models/enums';
@Component({
  selector: 'grupos-editar',
  templateUrl: 'editar.template.html',
  styleUrls: ['editar.component.scss'],
  providers: [GruposService]
})
export class GruposEditarComponent implements OnInit {

  /* codigo seleccion2ado */
  itemCodigo: number;
  item = new Grupo();
  areas: Area[];
  private sub: any;
  invalid: boolean;
  errors: any;
  pagina: Number = 0;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: GruposService,
              private parametrosService: ParametrosService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }


  ngOnInit() {
     this.parametrosService.buscarAreas().subscribe(
        (response: Response) =>{ this.areas = response.resultado
              this.sub = this.route.params.subscribe(params => {
                this.itemCodigo = params['codigo'];
                if (this.itemCodigo) {
                  this.service.buscarPorCodigo(this.itemCodigo).subscribe(
                    (response: Response) => this.item = Object.assign(new Grupo(), <Grupo>response.resultado),
                    (error) => this.controlarError(error)
                  );
              }else {
                  this.item = this.service.crear();
              }
            });
          }
        );
  }

  Validar(event) {
    validate(this.item).then( errors => {
      this.errors = {};
      this.invalid = false;
      if (errors.length > 0) {
        this.invalid = errors.length > 0;
        errors.map(e => {
          this.errors[e.property] = e.constraints[Object.keys(e.constraints)[0]];
        });
      }
      console.log(this.errors);
    });
  }

  OnGuardar(){
    this.item.descripcion = this.item.descripcion.trim().toUpperCase();
    this.item.abreviatura = this.item.abreviatura.trim().toUpperCase();  
    validate(this.item).then(errors => {
      if(this.item.miembros.length == 0){
        this.toastr.warning('Debe Seleccionar al menos un equipo', 'Acción inválida', {closeButton: true});
      }else if (errors.length > 0) {
        this.invalid = true;
        let mensajes = errors.map(e => e.constraints[Object.keys(e.constraints)[0]]);
        this.toastr.warning(`Los siguientes campos no son válidos: ${mensajes.join ('\n')}`, 'Acción inválida', {closeButton: true});
      } else {
        this.service.guardar(this.item).subscribe(
           (response:Response) => {
              this.item = response.resultado;
              this.toastr.success('El registro se guardó correctamente', 'Acción completada!', {closeButton: true});
              this.router.navigate([`despacho/grupos`]);
           },
           (response: Response) => this.controlarError(response)
        );
      }
    });
  }

  OnBuscarAreas(term: string, item: Area) {
    if (!item || !term) { return false; }
    term = term.toLocaleLowerCase();
    if (item.abreviatura) {
      return item.descripcion.toLowerCase().indexOf(term) > -1 || item.abreviatura.toLowerCase() === term;
    } else {
      return item.descripcion.toLowerCase().indexOf(term);
    }
  }

  OnRegresar() {
    this.router.navigate([`despacho/grupos`]);
  }

  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }
}
