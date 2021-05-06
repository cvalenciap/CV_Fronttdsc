import {MinLength, MaxLength,Matches} from 'class-validator';
export class TipoDocumento {
  codigo: string;
  @Matches(/^[A-Za-z0-9]|\s$/,{ message: 'Descripción tiene caracteres no válidos'})
  @MinLength(1, {message: ' Descripción vacio'})
  @MaxLength(100, {message: 'La longitud de Descripción es mayor a $constraint1 caracteres'})
  descripcion: string;
  estado: string;
  @Matches(/^[A-Za-z]*$/,{ message: 'Descripción tiene caracteres no válidos'})
  @MinLength(1, {message: ' Abreviatura vacia'})
  @MaxLength(20, {message: 'La longitud de Abreviatura es mayor a $constraint1 caracteres'})
  abreviatura: string;
  fechaRegistro: string;
  responsable: string;
  constructor() {
    this.codigo = null;
    this.descripcion = "";
    this.abreviatura = "";
    this.estado = "";
  }
}
