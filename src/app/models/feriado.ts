import {IsDateString, MinLength, MaxLength, Matches, IsNotEmpty} from 'class-validator';
import {IsFormattedDate} from '../components/forms/validators';
import {Estado} from './enums/estado';
import {Tipo} from './tipo';

export class Feriado {
  codigo: number;
  @IsFormattedDate(true, {message: 'El valor de Fecha no es válido'})
  fecha: Date;
  @MinLength(1, {message: 'Se requiere Descripción'})
  @MaxLength(100, {message: 'La longitud de Descripción es mayor a $constraint1 caracteres'})
  @Matches(/^[A-Za-z0-9]|\s$/,{ message: 'Descripción tiene caracteres no válidos'})
  descripcion: string;
  tipo: Tipo;
  estado: Estado;
  fechaRegistro: Date;
  responsable: string;
  fechaString: String;
  constructor() {
    this.tipo = new Tipo();
    this.descripcion = "";
    this.estado = Estado.ACTIVO;
    this.fecha = new Date();
    this.responsable = "";
  }
}
