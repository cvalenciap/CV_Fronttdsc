import {Representante} from "./representante";
import {MinLength, MaxLength, ValidateNested} from 'class-validator';
export class Empresa {
  codigo: number;
  @MinLength(1, {message: 'Se requiere Descripción'})
  @MaxLength(1000, {message: 'La longitud de Descripción es mayor a $constraint1 caracteres'})
  descripcion: string;
  fechaRegistro: Date;
  estado: string;
  responsable: string;
  //@ValidateNested()
  representantes: Representante[];

  constructor(){
    this.codigo = null;
    this.responsable = "";
    this.representantes = new Array<Representante>();
    let item = new Representante;
    this.representantes.push(item);
    this.descripcion="";
    this.estado = "ACTIVO";
  }
}
