import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {SwalComponent, SwalPartialTargets} from '@toverux/ngx-sweetalert2';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import {TipoDocumento, Empresa, Representante, Documento, Response, UploadResponse, DocumentoAdjunto} from '../../../models';
import { MesaPartesService, FileServerService} from '../../../services';
import {environment} from '../../../../environments/environment';
import { ItemDirigidoComponent } from '../../bandeja-salida/components/item-dirigido.component';
import { EstadoDocumento, NivelError } from '../../../models/enums';

@Component({
  selector: 'mesa-partes-editar',
  templateUrl: 'editar.template.html',
  styleUrls: ['editar.component.scss']
})
export class EditarDocumentoComponent implements OnInit {
  item : Documento;
  nano: number;
  correlativo: number;
  adjuntos: DocumentoAdjunto[] =  new Array<DocumentoAdjunto>();
  adjunto: DocumentoAdjunto;
  totalDocumentos: number;
  items = [];
  arreg: String;
  itemsArbol = [];
  loadingArbol: boolean = false;
  docAnterior: string = null;
  loading: boolean = false;
  urlPDF: string;
  acciones: string[]; // acciones permitidas para el usuario
  private sub: any;

  public urlReportePdf: string;
  @ViewChild('reportePdfSwal') private reportePdfSwal: SwalComponent;

  constructor(private router: Router,
              public readonly swalTargets: SwalPartialTargets,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private bandejaService: MesaPartesService,
  private bandejaFileServerService: FileServerService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.nano = + params['nano'];
      this.correlativo = + params['correlativo'];
    });

    if (this.nano && this.correlativo) {
      this.item = new Documento();
      this.item.tipoDocumento = new TipoDocumento();
      this.item.remitente = new Empresa();
      this.item.representante = new Representante();
      this.item.anexos = new Array<DocumentoAdjunto>();
      this.bandejaService.obtenerDocumento(this.nano, this.correlativo).subscribe(
        (response: Response) => {
          this.acciones = response.acciones; // seguridad

          this.item = response.resultado;
          this.adjuntos=this.item.anexos;
          if(this.adjuntos!=null) {
            this.totalDocumentos=this.adjuntos.length
          } else {this.totalDocumentos=0};
          },
        (error) => this.controlarError(error)
      );

    } else {
      this.item = this.bandejaService.crearDocumento();
    }
  }

  OnHtml() {
    const toastr = this.toastr;
    const this_ = this;
    this.bandejaService.generarHtml(this.item).subscribe(function (data) {
      const file = new Blob([data], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(file);
      this_.urlReportePdf = fileURL;
      this_.reportePdfSwal.show();
      // window.open(fileURL); // Abrir nueva pestaña
      toastr.info('Documento generado', 'Confirmación', {closeButton: true});

      },
      (error) => this.controlarError(error)
    );
  }

  OnHoja() {
    const toastr = this.toastr;
    const this_ = this;
    this.bandejaService.generarHoja(this.item).subscribe(function (data) {
      const file = new Blob([data], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(file);
      this_.urlReportePdf = fileURL;
      this_.reportePdfSwal.show();
      // window.open(fileURL); // Abrir nueva pestaña
      toastr.info('Documento generado', 'Confirmación', {closeButton: true});
    },
      (error) => this.controlarError(error)
    );
  }

  OnArbol() {
    if (this.itemsArbol && this.itemsArbol.length > 0) { return; }
    this.loadingArbol = true;
    this.bandejaService.obtenerArbolDocumento(this.item.nano, this.item.correlativo).subscribe(
      (response: Response) => {
          this.itemsArbol = response.resultado;
          this.loadingArbol = false;
          console.log(this.itemsArbol);
        },
      (error) => this.controlarError(error)
    );
  }

  OnRegresar() {
    this.router.navigate(['mesa-partes']);
  }

  OnEditar() {
    this.sub = this.route.params.subscribe(params => {
      this.nano = + params['nano'];
      this.correlativo = + params['correlativo'];
    })
    this.router.navigate(['mesa-partes/editar/'+this.nano.toString()+'/'+this.correlativo.toString()]);
  }

  OnEliminar() {
    this.sub = this.route.params.subscribe(params => {
      this.nano = + params['nano'];
      this.correlativo = + params['correlativo'];
    });
    if (this.nano && this.correlativo) {
      let i = 0;
      if(this.adjuntos) {
        if(this.adjuntos.length>0){
          for(i=0;i<=this.adjuntos[i];i++) {
            this.bandejaService.eliminarAnexo(this.adjuntos[i]).subscribe(
              (response:Response) => {
                let obj = response.resultado;
              },
              (error) => this.controlarError(error)
            );

            this.bandejaFileServerService.deleteFile(this.adjuntos[i].ubicacion).subscribe(
              (response: Response) => {
                console.log(response.resultado);
              },
              (error) => this.controlarError(error)
            );
          }
        }
      }
      this.bandejaService.eliminarDocumento(this.nano, this.correlativo).subscribe(
        (response: Response) => { this.router.navigate(['mesa-partes']);
         this.toastr.info('Registro eliminado', 'Acción completada!', {closeButton: true});
        },
        (error) => this.controlarError(error)
      );
    }
  }

  OnAdjuntar(file: HTMLInputElement) {
    this.loading=true;
    this.docAnterior = this.item.urlDocumento;
    this.bandejaFileServerService.uploadFile(file, environment.pathMesaPartes).subscribe(
      (response : UploadResponse) => {
        this.item.urlDocumento = response.url;
        this.bandejaService.actualizarArchivo(this.item, this.item.nano, this.item.correlativo).subscribe(
          (data: any) => {
            if (data != null && data.toString() === '0') {
              if(this.item.estado == EstadoDocumento.INGRESADO) {
                this.item.estado = EstadoDocumento.PENDIENTE;
              }
              this.loading=false;
              var lista: Array<string>;
              lista = new Array<string>();
              if(this.docAnterior!=null) {
                lista.push(this.docAnterior.replace(environment.serviceFileServerEndPoint + '/', ''));
                this.bandejaFileServerService.deleteFiles(lista).subscribe(
                  (response: Response) => {},
                  (error) => { console.error(error); }
                );
              }
              this.toastr.success('El archivo se cargó correctamente.', 'Acción completada!', {closeButton: true});
            } else {
              this.toastr.error('No se pudo completar la operación.', 'Error', {closeButton: true});
            }
          },
          (error) => this.controlarError(error)
        );
      },
      (error) => this.controlarError(error)
    );
  }

  controlarError(response: Response) {
     this.loadingArbol = false;
    if (response instanceof Response) {
      if (response.error.nivel === NivelError.REQUEST) {
        this.toastr.warning(response.error.mensaje, 'Acción inválida');
      }
    }
  }
}
