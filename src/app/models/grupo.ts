import {MinLength, MaxLength, Matches} from 'class-validator';
import {Estado} from './enums';
import {Area} from './area';

export class Grupo {
  codigo: number;
  @MinLength(1, {message: 'Se requiere Descripción'})
  @MaxLength(100, {message: 'La longitud de Descripción es mayor a $constraint1 caracteres'})
  @Matches(/^[A-Za-z0-9]|\s$/,{ message: 'Descripción tiene caracteres no válidos'})
  descripcion: string;
  estado: Estado;
  miembros: Area[];
  @MinLength(1, {message: 'Se requiere Abreviatura'})
  @MaxLength(20, {message: 'La longitud de Abreviatura es mayor a $constraint1 caracteres'})
  @Matches(/^[A-Za-z]|\-/,{ message: 'Descripción tiene caracteres no válidos'})
  abreviatura: string;
  fechaRegistro: Date;
  /*@MinLength(1, {message: 'Se requiere Responsable'})
  @MaxLength(25, {message: 'La longitud de Responsable es mayor a $constraint1 caracteres'})*/
  responsable: string;
  constructor() {
    this.descripcion = "";
    this.abreviatura = "";
    this.responsable = "";
    this.miembros = new Array<Area>();
    this.fechaRegistro = new Date();
  }
}
