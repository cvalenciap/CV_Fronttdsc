import {MinLength, MaxLength} from 'class-validator';

export class Asunto {
  codigo: number;
  @MinLength(1, {message: 'Se requiere Descripción'})
  @MaxLength(80, {message: 'La longitud de Descripción es mayor a $constraint1 caracteres'})
  descripcion: string;
  fechaRegistro: string;
  estado: string;
  responsable: string;
  constructor() {
    this.descripcion = "";
  }
}

