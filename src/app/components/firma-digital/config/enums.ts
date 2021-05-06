export enum VerFirma {
  Invisible = 0,
  Visible = 1
}

export enum PosicionFirma {
  SuperiorDerecha = 'SD',
  SuperiorIzquierda = 'SI',
  SuperiorMedio = 'SM',
  MedioDerecha = 'MD',
  MedioIzquierda = 'MI',
  MedioMedio = 'MM',
  InferiorDerecha = 'ID',
  InferiorIzquierda = 'II',
  InferiorMedio = 'IM',
  ReemplazarEtiqueta = 'TA'
}

export enum UbicacionPagina {
  PrimeraPagina = 'PP',
  UltimaPagina = 'UP',
  TodasPaginas = 'TP',
  NumeroPagina = 'NP',
  CualquierPagina = 'CP'
}

export enum EstiloFirma {
  Imagen = 'I',
  Descripcion = 'D',
  ImagenDescripcion = 'ID',
  DescripcionImagen = 'DI',
  ImagenSuperiorDescripcionInferior = 'ISDI',
  DescripcionSuperiorImagenInferior = 'DSII'
}

export enum TipoFirma {
  PADES = 1,
  XADES = 2,
  CADES = 3
}
