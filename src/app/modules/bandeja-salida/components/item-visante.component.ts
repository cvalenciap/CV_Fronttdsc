import { Component, OnInit, Renderer2, ElementRef, ViewChild, Output, Input, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import {SwalPartialTargets} from '@toverux/ngx-sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {TipoDocumento, Trabajador, Empresa,Representante, Area, Documento, Response, DocumentoFirmante, Tipo} from '../../../models';
import {BandejaSalidaService, AreasService} from '../../../services';
import { throwError } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { TipoFirma } from '../../../models/enums';


@Component({
  selector: 'item-visante',
  template: `
    <div class="form-group">
        <label class="col-sm-1 col-sm-offset-1 control-label">Visante:</label>
        <div class="col-sm-1"><input type="text" class="form-control" disabled="disabled" name="indice" [ngModel]="index+1"></div>
        <div class="col-sm-7">
            <ng-select [items]="listaAreas"
                    bindLabel="descripcion"
                    placeholder="Seleccione área que visará documento"
                    [(ngModel)]="item.areaFirmante"
                    [clearable]="false"
                    [searchFn]="OnBuscarAreas"
                    (change)="modelChanged($event)"
                    >
                    <ng-template ng-label-tmp let-clear="clear" let-item="item">
                      <span class="m-xs"><span class="label label-primary">{{item.abreviatura}}</span> {{item.descripcion}}</span>
                      <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
                    </ng-template>
                    <ng-template ng-option-tmp let-item="item" let-index="index">
                      <span class="label label-primary">{{item.abreviatura}}</span> {{item.descripcion}}
                    </ng-template>
            </ng-select>
        </div>
        <div class="col-sm-1">
            <button *ngIf="listCombos.indexOf(this.item)==0" class="btn btn-info btn-sm" [disabled]="loading" (click)="OnAgregar()"><i class="fa fa-plus"></i> Añadir Visante</button>
            <button *ngIf="listCombos.indexOf(this.item)>0" class="btn btn-warning" [disabled]="loading" (click)="OnEliminar()"><i class="fa fa-minus"></i></button>
        </div>
    </div>
  `
})

export class ItemVisanteComponent implements OnInit{
    
  @Input('item')
  item: DocumentoFirmante;
  @Input('listaAreas')
  listaAreas: Area[];
  @Input('listCombos')
  listCombos: DocumentoFirmante[];
  @Output() itemEliminar = new EventEmitter<any>();
  @Output() itemAgregar = new EventEmitter<any>();
  destinos: Area[];
  @Input('index')
  index: number;
  @Input('loading')
  loading: boolean;
  @Input('firmanteArea')
  firmanteArea: Area;
  remitente : Trabajador;
  private itemTemp : DocumentoFirmante;
  private secuencial : number = null;
  private areaAux : Area;
  private documentoFirmanteAux: DocumentoFirmante;
  constructor(private router: Router,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    public readonly swalTargets: SwalPartialTargets,
    private bandejaSalidaService: BandejaSalidaService,
    private areasService: AreasService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.areaAux = null;
    }
    ngOnInit(){
        
        this.item.nivel = this.listCombos.indexOf(this.item) + 1;
        if(this.item.trabajador.secuencial){
            this.secuencial = this.item.trabajador.secuencial;
            this.itemTemp = JSON.parse(JSON.stringify(this.item));
        }else{
            this.itemTemp = new DocumentoFirmante();
        }
    }
    reset(){
        this.item.areaFirmante = new Area();
    }
    modelChanged(area: Area){
        //console.log(this.itemTemp);
        let codigo = area.codigo;
        this.documentoFirmanteAux = null;
        if(codigo==-1){
            this.reset();
        }else{
            let i = 0;
            /*
            for(i;i<this.listCombos.length;i++){
                this.areaAux = this.listCombos[i].areaFirmante;
                if(i!=this.index && (this.areaAux.codigo!=-1 && codigo==this.areaAux.codigo)){
                    i=-1;
                    break;
                }
            }*/
            let areaPrev : Area = new Area();
            let areaNext : Area = new Area();
            if(this.index!=0)
              areaPrev = this.listCombos[this.index-1].areaFirmante;
            if(this.index!=this.listCombos.length-1)
              areaNext = this.listCombos[this.index+1].areaFirmante;
            
            if(areaNext.codigo!=-1 && areaNext.codigo==this.listCombos[this.index].areaFirmante.codigo)
              i=-1;
            else if(areaPrev.codigo!=-1 && areaPrev.codigo==this.listCombos[this.index].areaFirmante.codigo)
              i=-1;
            else if(this.index==this.listCombos.length-1 && this.firmanteArea.codigo==this.listCombos[this.index].areaFirmante.codigo)
              i=-1;

            if(i!=-1){
                this.item.areaFirmante.codigo=codigo;
                this.ObtenerTrabajador();
            }else{
                this.toastr.info('El área ya ha sido añadida', 'Informacion', {closeButton: true});
                this.reset();
            }
        }
    }
    OnBuscarAreas(term: string, item: Area) {
        if (!item || !term) { return false; }
        term = term.toLocaleLowerCase();
        if (item.abreviatura) {
          return item.descripcion.toLowerCase().indexOf(term) > -1 || item.abreviatura.toLowerCase() === term;
        } else {
          return item.descripcion.toLowerCase().indexOf(term);
        }
      }
    private ObtenerTrabajador(){
        this.item.trabajador = null;
        //console.log(this.item.areaFirmante.codigo);
        this.areasService.obtenerJefe(this.item.areaFirmante.codigo).subscribe(
          (response : Response) => {
            this.remitente = response.resultado;
            if(this.remitente==null){
                this.toastr.info('El area no contiene jefe', 'Informacion', {closeButton: true});
                this.reset();
                return;
            }
            this.item.trabajador = this.remitente;
            this.item.nivel = this.index+1;
            this.item.tipoFirma = TipoFirma.VISADO;
            this.item.trabajador.estado = 1,
            this.item.trabajador.estadoModificado = 0;
          }
        );
    }

    OnEliminar(){
        //console.log(this.item.nivel);
        this.itemEliminar.emit(this.index);
    }
    OnAgregar(){
        this.itemAgregar.emit();
    }
}
