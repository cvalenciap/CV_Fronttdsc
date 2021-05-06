import {IsInt, IsNumber, Matches, MinLength, MaxLength, IsNumberString} from 'class-validator';
import {Estado} from './enums/estado';
import {TipoDocumento} from './tipo-documento';
import {Area} from './area';

export class Secuencial {
 // @Matches(/[0-9](4)/)//{pattern: /[0-9](4)/, message: "EIC code must be at least 32 charatcers"})
  nano:string;
  area:Area;
  tipoDocumento:TipoDocumento;
  @IsNumberString({message:'Se requiere Valor Secuencial'})
  correlativo:number;
  estado:Estado;
  responsable:string;

 constructor() {
    this.correlativo = 0;
    this.responsable = "";

  }
}

/*export class Secuencial {
  anno : string;
  codigo: string;
  fecha: Date;
  descripcion: string;
  abreviatura: string;
  area: Area;
  valsecuencial: number;
  tipo: Tipo;
  estado: Estado;
  fechaRegistro: Date;
  responsable: string;
}*/
