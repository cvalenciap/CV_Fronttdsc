import {IsInt,Matches,IsDate, MinLength, MaxLength, IsEmail,Allow} from 'class-validator';
//import {isEmail} from 'validator/lib/isEmail';
import {Tipo} from '../models';

export class Representante {
  codigo: number;
  @MinLength(1, {message: 'Se requiere Nombre.'})
  @MaxLength(200, {message: 'La longitud del Nombre es mayor a $constraint1 caracteres'})
  nombre: string;
  tipoRepresentante: Tipo;
  tipoDocumento: Tipo;
  @MaxLength(50, {message: 'La longitud del Numero de Documento es mayor a $constraint1 caracteres'})
  numeroDocumento: string;
  @MaxLength(200, {message: 'La longitud de la Direccion es mayor a $constraint1 caracteres'})
  direccion: string;
  @MaxLength(20, {message: 'La longitud del Telefono es mayor a $constraint1 caracteres'})
  telefono: string;
  /*@IsEmail()
  @Allow()*/
  @MaxLength(100, {message: 'La longitud del Correo es mayor a $constraint1 caracteres'})
  correo: string;
  @MaxLength(20, {message: 'La longitud del Fax es mayor a $constraint1 caracteres'})
  fax: string;
  @MaxLength(20, {message: 'La longitud del Celular es mayor a $constraint1 caracteres'})
  celular: string;
  fechaRegistro: Date;
  estado: string;
  responsable: string;
  indicador: number;
  /* Flags */
  estadoModificado: number = 0; // Modificado/Eliminado
  estadoRepresentante: number = 0; //Estado Base de Datos
  indexRow: number = 0;
  /* Fin Flags */

  constructor() {
    const tipoDocumento = new Tipo();
    const tipoRepresentante = new Tipo();
    tipoDocumento.codigo = null;
    tipoDocumento.descripcion = null;
    tipoRepresentante.codigo = null;
    tipoRepresentante.descripcion = null;
    this.codigo = 0;
    this.correo = "";
    this.direccion = "";
    this.estado = "ACTIVO";
    this.fax = "";
    this.nombre = "";
    this.numeroDocumento = "";
    this.responsable = "";
    this.telefono = "";
    this.celular = "";
    this.tipoDocumento = tipoDocumento;
    this.tipoRepresentante = tipoRepresentante;
    this.indicador = 1;
    this.indexRow= 0;
    this.estadoModificado = 0;
    this.fechaRegistro = new Date();
  }
}
