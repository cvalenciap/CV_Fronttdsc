import { OnInit, OnChanges, ElementRef, Input, NgModule, Directive } from '@angular/core';
import * as moment from 'moment';

// Import GitGraph
declare var GitGraph:any;

@Directive({
  selector: 'canvas[gitgraph]',
  exportAs: 'gitgraph',
})
export class GitGraphDirective implements OnChanges, OnInit {

  // Properties
  @Input() private  options:any;
  @Input() private  type:any;
  @Input() private  data:any;

  public gitgraph:any;
  private element:ElementRef;
  private template:any;
  private branches:Map<string, any>;
  private commits:Map<number, any>;

  public constructor(element:ElementRef) {
    this.element = element;
  }

  // Initialise
  public ngOnInit():any {
    const id = this.element.nativeElement.id;
    this.template = new GitGraph.Template({
      colors: ['#0065a4', '#f7941d', '#006eaa', '#1ab394', '#ED5565', '#b1d349', '#0f85bc', '#8da0ab'],
      branch: {
        /* lineWidth: 7, */
        lineWidth: 4,
        /* spacingX: 40, */
        spacingX: 20,
        showLabel: true,
        labelColor: 'white',
        mergeStyle: 'straight',
        /* labelFont: 'bold 12pt Arial', */
        labelFont: 'bold 9pt Arial',
        labelRotation: 0
      },
      commit: {
        /* spacingY: -35, */
        spacingY: -25,
        dot: {
          size: 10
        },
        message: {
          displayAuthor: true,
          displayBranch: true,
          displayHash: false,
         /*  font: 'normal 11pt Open Sans', */
         font: 'normal 8pt Open Sans',
        },
        tooltipHTMLFormatter: function(commit) {
          return "<b>" + commit.sha1 + "</b>" + ": " + commit.message;
        }
      }
    });
    const t = this.template;
    this.gitgraph = new GitGraph({
      template: t,
      mode : "extended",
      reverseArrow: false,
      orientation: "vertical",
      elementId: id
    });
    this.branches = new Map<string, any>();
    this.commits = new Map<number, any>();
  }

  // Build
  private build(): any {
    let fichaTrabajadorAux: string = '';
    let movimientoAux: number = 0;
    let indice: number = 0;
   
    if (this.data) {
      console.log('DATA => ', this.data);
      for (const item of this.data) {
        if (indice === 0) {
          fichaTrabajadorAux = item.fichaDestino;
          movimientoAux = item.movimientoAnterior;
        }
        /*if(item.movimientoAnterior === 0) {
          let b = this.gitgraph.branch({name: item.areaOrigen.abreviatura});
          this.branches.set(item.areaOrigen.abreviatura, b);
          this.commits.set(item.movimientoAnterior, b.commit({
            date: moment(item.fechaMovimiento).toDate(),
            sha1: 0,
            message: moment(item.fechaMovimiento).format('D/MM/Y hh:mm a'),
            author: `[${item.fichaOrigen}] ${item.nombreOrigen}`
          }));
        }*/


        /*if (!this.branches.get(item.areaDestino.abreviatura)) {
          const a = this.gitgraph.branch({
            name: item.areaDestino.abreviatura,
            parentBranch: this.branches.get(item.areaOrigen.abreviatura)
          });
          this.branches.set(item.areaDestino.abreviatura, a);
        }*/

        if (!this.branches.get(item.areaDestino.abreviatura+item.movimiento)) {
          const a = this.gitgraph.branch({
            name: (item.codSeguimiento==0) ?item.areaDestino.abreviatura : item.codSeguimiento+":"+item.areaDestino.abreviatura,
            parentBranch: this.branches.get(item.areaOrigen.abreviatura+item.movimientoAnterior)
          });
          this.branches.set(item.areaDestino.abreviatura+item.movimiento, a);
        }


        /* if (fichaTrabajadorAux !== item.fichaOrigen) {
          fichaTrabajadorAux = item.fichaDestino;
          if (movimientoAux !== item.movimientoAnterior) { */
            /* const c = this.branches.get(item.areaOrigen.abreviatura); */
            /* const c = this.branches.get(item.areaOrigen.abreviatura+item.movimientoAnterior);
            movimientoAux = item.movimientoAnterior;
            this.commits.set(item.movimiento, c.commit({
              date: moment(item.fechaMovimiento).toDate(),
              sha1: item.movimiento,
              message: moment(item.fechaMovimiento).format('D/MM/Y hh:mm a'),
              author: `[${item.fichaOrigen}] ${item.nombreOrigen}`,
              parentCommit: this.branches.get(item.movimientoAnterior)
            }));
          
          } */
         /*  else{
            const a = this.gitgraph.branch({
              name: item.codSeguimiento+":"+item.areaDestino.abreviatura,
              parentBranch: this.branches.get(item.areaOrigen.abreviatura+item.movimientoAnterior)
            });
            this.branches.set(item.areaDestino.abreviatura+item.movimiento, a);
          } */
          
       /*  } */

        /* const b = this.branches.get(item.areaDestino.abreviatura); */
        const b = this.branches.get(item.areaDestino.abreviatura+item.movimiento);

        if (item.estado === 'ELIMINADO') {
          this.commits.set(item.movimiento, b.commit({
            date: moment(item.fechaMovimiento).toDate(),
            sha1: item.movimiento,
            message: moment(item.fechaMovimiento).format('D/MM/Y hh:mm a'),
            author: `✖ ${item.estado} [${item.fichaDestino}] ${item.nombreDestino}`,
            parentCommit: this.branches.get(item.movimientoAnterior)
          }));
        } else {
         
            this.commits.set(item.movimiento, b.commit({
              date: moment(item.fechaMovimiento).toDate(),
              sha1: item.movimiento,
              message: moment(item.fechaMovimiento).format('D/MM/Y hh:mm a'),
              author: `[${item.fichaDestino}] ${item.nombreDestino}`,
              parentCommit: this.branches.get(item.movimientoAnterior)
            }));
         
        }

        indice++;
      }
    }
  }

  // Change
  public ngOnChanges():void {
    this.build();
  }

  public branch(name: string) {
    this.gitgraph.branch(name);
  }

  public commit(message: string) {
    this.gitgraph.commit(message);
  }

}

@NgModule({
  declarations: [
    GitGraphDirective
  ],
  exports: [
    GitGraphDirective
  ],
  imports: []
})
export class GitGraphModule {
}
