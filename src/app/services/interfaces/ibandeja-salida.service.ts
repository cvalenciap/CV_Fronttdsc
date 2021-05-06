import {Documento, DocumentoComentario} from '../../models';
import {Observable} from 'rxjs';

export interface IBandejaSalidaService {

  crearDocumento(): Documento;

  cargarParametros(): Observable<any>;

  obtenerTrabajador(codigo: string): Observable<any>;

  obtenerTrabajadorGrupo(codigo: number);

  calcularFechaPlazo(fechaRegistro: Date, plazo: number): Observable<any>;

  obtenerEmpresas();

  cambiarRemitente(parametros: {descripcion: string}, pagina: number, registros: number);

  guardarDocumento(documento : Documento): Observable<any>;

  obtenerDocumento(vnumdoc: string);

  buscarPorDocumento(codDocumento: string, codMovimiento: string): Observable<any>;

  cargarComentarios(documento: string): Observable<any>;

  guardarComentarios(codMovimiento :number, comentario: string): Observable<any>;

  visarDocumento(documento: Documento);

  firmarDocumento(documento: Documento);

  observarDocumento(documento: Documento);

  visarDocumentos(documentos: Documento[]);

  firmarDocumentos(documentos: Documento[]);

  observarDocumentos(documentos: Documento[]);

}
