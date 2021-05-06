import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEventType, HttpResponse,} from '@angular/common/http';
import {RequestOptions, Request, RequestMethod, Headers, ResponseContentType, ResponseType} from '@angular/http';
import {environment} from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import {Observable} from 'rxjs';
import { Subject } from 'rxjs/Subject';
import {Response, UploadResponse} from '../../models';
import { TipoArchivo } from '../../models/enums';

@Injectable({
  providedIn: 'root',
})

export class FileServerService {

  private apiEndpoint: string;

  private httpHeaders = new HttpHeaders({'Content-Type': 'multipart/form-data'});
  constructor(public http: HttpClient,
    private toastr: ToastrService,) {
    this.apiEndpoint = environment.serviceFileServerEndPoint;
  }

  validateFile(file: HTMLInputElement, allowed?:string[]){
    const type = file.files[0].type;
    if(!allowed){
      allowed=[TipoArchivo.pdf,TipoArchivo.doc,TipoArchivo.docx,TipoArchivo.img,TipoArchivo.xls,TipoArchivo.xlsx];
    }
    return allowed.includes(type);
  }

  downloadFileByURL(url: string, name?:string){
    var link = document.createElement('a');
    link.href = url;
    link.download = name;
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
   
  }

  downloadFile(blob:Blob, name?:string){
      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob,name || 'descarga');
        return;
      }
      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = data;
      link.download = name;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  }

  deleteFile(path: string) {
    return this.http.delete(path);
  }

  deleteFiles(lista: Array<string>) {
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: lista
    };
    console.log(httpOptions);
    console.log(this.apiEndpoint);  
    return this.http.delete(this.apiEndpoint+"/", httpOptions);
  }

  uploadFile(file: HTMLInputElement, path: string) {
    const status = {};
    const formData: FormData = new FormData();
    formData.append('file', file.files[0], file.files[0].name);
    const urlstring = `${this.apiEndpoint}/${path}`;
    const req = new HttpRequest('PUT', urlstring, formData,  {
      reportProgress: true
    });
    const progress = new Subject<number>();
    const data = new Subject<UploadResponse>();
    
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          data.next(<UploadResponse>(event.body));
          progress.complete();
          data.complete();
        }
    },(error) => this.controlarError(error)
    );
    status[file.name] = {
      progress: progress.asObservable()
    };
    return data;
    //return status[file.name].progress;
  }
  controlarError(error) {
    console.log(error);
    //console.log(error.error.mensaje)
    this.toastr.error(error.error.mensaje, 'Error', {closeButton: true});
    return null;
    //this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
}
