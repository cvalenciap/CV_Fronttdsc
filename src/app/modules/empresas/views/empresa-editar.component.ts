import { Component,AfterViewInit,OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute} from '@angular/router';
import { EmpresasService } from '../../../services';
import { Response, Empresa, Representante } from '../../../models';
import {NivelError} from '../../../models/enums';
import { validate}  from 'class-validator';
import { ItemDirigidoComponent } from '../../bandeja-salida/components/item-dirigido.component';
import { SessionService } from '../../../auth/session.service';
/*EmpresasMockService */
declare var jQuery:any;

@Component({
  selector: 'empresas-editar',
  styleUrls: ['empresa-editar.component.scss'],
  templateUrl: 'empresa-editar.template.html'
})

export class EmpresasEditarComponent implements AfterViewInit,OnInit{

  /* codigo seleccionado */
  itemCodigo : number;
  /* datos */
  item: Empresa = new Empresa();
  itemSeleccionado : Representante = new Representante();
  itemNuevoRep : Representante;
  selectedRow : number;
  /*Contador de nuevos representantes*/
  chain: string;
  mensaje: string;
  counter: number;
  errors: any;ng;
  text : string;
  private sub: any;
  invalid : boolean;
  fechaRegistro: string;
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: EmpresasService,
              private session : SessionService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = 0;
    this.counter = 0;
    this.fechaRegistro = "";
  }
  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }
  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = + params['codigo'];
    });
    if (this.itemCodigo) {
      this.text = "edicion";
      this.service.buscarPorCodigo(this.itemCodigo).subscribe(
        (response: Response) => {
          this.item =  Object.assign(response.resultado, <Empresa>response.resultado);
          this.counter = this.item.representantes.length;
          if(this.counter>0){
            this.itemSeleccionado=this.item.representantes[0];
          }
        },
        (error) => this.controlarError(error)
      );
    } else {
      this.text = "creacion";
      this.item = this.service.crear();
      this.item.fechaRegistro = new Date();
      this.item.representantes[0].responsable = this.session.User.codUsuario;
      this.itemSeleccionado = this.item.representantes[0];
      this.counter = this.item.representantes.length;
    }
  }
  OnRegresar(){
    this.router.navigate([`mantenimiento/empresas`]);
  }

  DetectChange(){
    if(this.item.fechaRegistro.toString()=='Invalid Date' || this.item.fechaRegistro.toString()==''){
      this.item.fechaRegistro = new Date();
      this.toastr.warning('Fecha ingresada no valida','Advertencia',{closeButton:true});
      return;
    } 
  }

  VerificarRepresentantes():string{
    let str = "";
    this.item.representantes.forEach((element,index) => {
      let number = index+1;
      if(element.nombre)
        element.nombre= element.nombre.trim().toUpperCase();
      if(element.correo)
        element.correo = element.correo.trim();
      if(element.direccion)
        element.direccion = element.direccion.trim().toUpperCase();
      if(element.fax)
        element.fax = element.fax.trim();
      if(element.numeroDocumento)
        element.numeroDocumento = element.numeroDocumento.trim().toUpperCase();
      if(element.telefono)
        element.telefono = element.telefono.trim();

      if(!element.nombre || element.nombre=="" || element.nombre.length>200){
        if(this.item.representantes.length==index+1)
          str += "Representante #" + number;
        else
          str += "Representante #" + number +", ";
      }else
      /*if(!element.nombre && ){
        element.nombre= element.nombre.trim();


      }else*/
      if((element.correo && element.correo!="") && element.correo.length>100){
        //element.correo = element.correo.trim();
        if(this.item.representantes.length==index+1)
          str += "Representante #" + number;
        else
          str += "Representante #" + number +", ";
      }else
      if((element.direccion && element.direccion!="")&& element.direccion.length>200){
        //element.direccion = element.direccion.trim();
        if(this.item.representantes.length==index+1)
          str += "Representante #" + number;
        else
          str += "Representante #" + number +", ";
      }else
      if((element.fax && element.fax!="")&& element.fax.length>20){
        //element.fax = element.fax.trim();
        if(this.item.representantes.length==index+1)
          str += "Representante #" + number;
        else
          str += "Representante #" + number +", ";
      }else
      if((element.numeroDocumento && element.numeroDocumento!="")&& element.numeroDocumento.length>50){
        //element.numeroDocumento = element.numeroDocumento.trim();
        if(this.item.representantes.length==index+1)
          str += "Representante #" + number;
        else
          str += "Representante #" + number +", ";
      }else
      if((element.telefono && element.telefono!="")  &&  element.telefono.length>20){
        //element.telefono = element.telefono.trim();
        if(this.item.representantes.length==index+1)
          str += "Representante #" + number;
        else
          str += "Representante #" + number +", ";
      }else
      if((element.celular && element.celular!="")  &&  element.celular.length>20){
        //element.telefono = element.telefono.trim();
        if(this.item.representantes.length==index+1)
          str += "Representante #" + number;
        else
          str += "Representante #" + number +", ";
      }
    });
    return str;
  }

  OnGuardar() {
      //console.log(this.item);
      let str = this.VerificarRepresentantes();
      if(str!=""){
        this.toastr.warning(`Los siguientes representantes estan invalidos: ` +str, 'Acción inválida', {closeButton: true});
        return;
      }
      if(this.item.descripcion.trim()==""){
        this.toastr.warning(`La descripcion de empresa no es valida`, 'Acción inválida', {closeButton: true});
        return;
      }
      this.item.descripcion = this.item.descripcion.trim();
      validate (this.item).then(errors => {
        if (errors.length > 0) {
          this.invalid = true;
            let mensajes = errors.map(e => e.constraints[Object.keys(e.constraints)[0]]);
              this.toastr.warning(`Los siguientes campos son inválidos: ${mensajes.join('. ')}`, 'Acción inválida', {closeButton: true});

        }else{
            let str = this.item.codigo==null?(""):(this.item.codigo.toString());
            this.service.guardar(this.item).subscribe(
              (response: Response) => {
               // console.log(response);
                this.item= response.resultado;
                if(str=="")
                  this.toastr.success('El registro fue creado correctamente', 'Acción completada', {closeButton: true});
                else
                  this.toastr.success('El registro fue actualizado correctamente', 'Acción completada', {closeButton: true});
                this.router.navigate([`mantenimiento/empresas`]);
              },
              (response: Response) => this.controlarError(response)
            );
          }
        }
      );
  }
  
  controlarError(response: Response) {
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }
  displayItem(representante : Representante){
    this.itemSeleccionado = representante;
  }
  sendIndex(selectedRow : number){
    this.selectedRow = selectedRow;
  }
  OnNuevo(){
    if(this.item.representantes == null || this.item.representantes == undefined){
      /* Nueva Empresa */
      var listaRepresentantes:Representante[] = new Array<Representante>();
      this.item.representantes = listaRepresentantes;
    }
    this.itemNuevoRep = new Representante();
    this.itemNuevoRep.responsable = this.session.User.codUsuario;
    this.counter = this.item.representantes.push(this.itemNuevoRep);
    this.itemSeleccionado = this.item.representantes[this.counter-1];
    this.selectedRow=this.item.representantes.length-1;

  }
  OnEliminar(){
    if(this.itemSeleccionado.codigo==0){
      if(this.selectedRow==0){
        return;
      }else if (this.selectedRow > -1) {
        this.item.representantes.splice(this.selectedRow, 1);
        this.counter = this.item.representantes.length;
        this.itemSeleccionado = this.item.representantes[this.item.representantes.length-1];
        this.selectedRow=this.item.representantes.length-1;
     }
    }else{
      if (this.selectedRow > -1) {
        this.item.representantes[this.selectedRow].estado="INACTIVO";
     }
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
