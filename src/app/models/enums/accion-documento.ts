export enum AccionDocumento {
  POR_DISPOSICION = '01',
  COORDINAR_CON = '02',
  ACCION_NECESARIA = '03',
  ADJUNTAR_ANTECEDENTES = '04',
  REVISAR_INFORMAR = '05',
  PREPARAR_RESPUESTA = '06',
  CONOCIMIENTO_Y_FINES = '07',
  SU_APROBACION_VB = '08',
  TENER_PENDIENTE = '09',
  RESOLVER = '10',
  ARCHIVAR = '11',
  PARA_DIRECTORIO = '12',
  PREPARAR_RESOLUCION = '13',
  CONTESTAR_DIRECTAMENTE = '14',
  OTROS = '15',
  FIRMAR = 'FR',
  FIRMAR_VB = 'VB'
}

export const AccionesChecked = new Map<AccionDocumento, boolean>([
  [AccionDocumento.POR_DISPOSICION,        false],
  [AccionDocumento.COORDINAR_CON,          false],
  [AccionDocumento.ACCION_NECESARIA,       false],
  [AccionDocumento.ADJUNTAR_ANTECEDENTES,  false],
  [AccionDocumento.REVISAR_INFORMAR,       false],
  [AccionDocumento.PREPARAR_RESPUESTA,     false],
  [AccionDocumento.CONOCIMIENTO_Y_FINES,   false],
  [AccionDocumento.SU_APROBACION_VB,       false],
  [AccionDocumento.TENER_PENDIENTE,        false],
  [AccionDocumento.RESOLVER,               false],
  [AccionDocumento.ARCHIVAR,               false],
  [AccionDocumento.PARA_DIRECTORIO,        false],
  [AccionDocumento.PREPARAR_RESOLUCION,    false],
  [AccionDocumento.CONTESTAR_DIRECTAMENTE, false],
  [AccionDocumento.OTROS,                  false],
  [AccionDocumento.FIRMAR,                 false],
  [AccionDocumento.FIRMAR_VB,              false]
]);


export const AccionesDocumento = new Map<AccionDocumento, string>([
  [AccionDocumento.POR_DISPOSICION,        '01. Por Disposición'],
  [AccionDocumento.COORDINAR_CON,          '02. Coordinar Con'],
  [AccionDocumento.ACCION_NECESARIA,       '03. Acción Necesaria'],
  [AccionDocumento.ADJUNTAR_ANTECEDENTES,  '04. Adjuntar Antecedentes'],
  [AccionDocumento.REVISAR_INFORMAR,       '05. Revisar / Informar'],
  [AccionDocumento.PREPARAR_RESPUESTA,     '06. Preparar Respuesta'],
  [AccionDocumento.CONOCIMIENTO_Y_FINES,    '07. Conocimiento y Fines'],
  [AccionDocumento.SU_APROBACION_VB,        '08. Su Aprobación'],
  [AccionDocumento.TENER_PENDIENTE,        '09. Tener Pendiente'],
  [AccionDocumento.RESOLVER,              '10. Resolver'],
  [AccionDocumento.ARCHIVAR,              '11. Archivar'],
  [AccionDocumento.PARA_DIRECTORIO,        '12. Para Directorio'],
  [AccionDocumento.PREPARAR_RESOLUCION,    '13. Preparar Resolución'],
  [AccionDocumento.CONTESTAR_DIRECTAMENTE, '14. Contestar Directamente'],
  [AccionDocumento.OTROS,                 '15. Otros']
]);
