/**
 * @package       JefeEquipoModule
 * @class         ActualizarJefeComponent
 * @description   formulario jefe de equipo
 * @author        sayda moises
 * -------------------------------------------------------------------------------------
 * Historia de modificaciones
 * Requerimiento    Autor       Fecha         Descripción
 * -------------------------------------------------------------------------------------
 */
import {Component, OnInit} from '@angular/core';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Router } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {AreasService as AreasService} from '../../../services';
import {Area, Response, Trabajador} from '../../../models';
import {NivelError} from '../../../models/enums';
import {validate,Matches} from 'class-validator';
import { SessionService } from 'src/app/auth/session.service';


@Component({
  selector: 'jefe-equipo-actualizar',
  templateUrl: 'actualizar.template.html',
  providers: [AreasService]
} )
export class ActualizarJefeComponent implements OnInit {

  item:Trabajador;
  itemTemp: Trabajador;
  flagHabilita:boolean;
  flag:number;
  loading:boolean;
  flagValido : boolean;
  errors: any;
  codigoArea : string;
  constructor(private toastr:ToastrService,
    private router:Router,
    private service:AreasService,
    private session:SessionService) {
    this.item = new Trabajador();
    this.item.area = new Area();
    this.itemTemp = new Trabajador();
   // this.itemTemp.area = new Area();
    this.flagHabilita=true;
    this.flagValido=false;
  }

  ngOnInit() {
    this.ObtenerJefe();
  }

  OnGuardar(){
    this.loading = true;
     this.service.actualizarJefe(this.session.User.codArea,this.item).subscribe(
      (response: Response) => {
        this.loading = false;
        this.toastr.success('El jefe de equipo fue actualizado correctamente', 'Acción completada!');
      },
      (response: Response) => this.controlarError(response)
    );

  }

  ObtenerJefe() {
    this.loading = true;
    this.service.obtenerJefe(this.session.User.codArea).subscribe(
    (response: Response) => {
      this.item = response.resultado;
      this.itemTemp = JSON.parse(JSON.stringify(this.item));
      this.loading = false;
    },
    (error) => this.controlarError(error));
  }

  ValidarJefe(ficha: number){
    this.flagHabilita=true;
    this.flagValido=false;
    if (!this.item.ficha){
      this.toastr.warning('Ingrese ficha', 'Acción Inválida');
      return;
    }

    if (this.item.ficha && !(this.item.ficha.toString().match(/^[0-9]{5}$/) != null) ) {
      this.toastr.warning('Ingrese código numérico válido', 'Acción Inválida');
      return;
    }
    this.loading = true;
     this.service.validarJefe(this.session.User.codArea, this.item.ficha).subscribe(
      (response: Response) =>{
        this.loading = false;
        this.item = response.resultado;
        this.flagHabilita = false;
        this.flagValido = true;
        this.toastr.info('El número de ficha es válido. Haga clic en Guardar para confirmar el cambio.', 'Trabajador Válido');
      },
      (response: Response) => this.controlarError(response)
    );
  }
  Restaurar(){
    this.item =  JSON.parse(JSON.stringify(this.itemTemp));
    //this.flagHabilita = true;
    this.flagValido = false;
  }
  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.loading = false;
        this.flagHabilita=true;
        this.flagValido=false;
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }
}
