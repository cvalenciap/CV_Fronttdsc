import {Observable} from 'rxjs';
export interface IFileServerService {
  uploadFile(file: HTMLInputElement): Observable<any>;
  deleteFile(lista: Array<string>): Observable<any>;
  deleteFiles(lista: Array<string>): Observable<any>;
}

