import { Component, OnInit , AfterViewInit,ViewChild, ElementRef, Inject} from '@angular/core';
import {TootipServiceService} from '../services/tootip-service.service';
import {TooltipComponent} from './tooltip.component'

@Component({
  selector: 'tooltip-container',
 
  template: 
  `
        <div #cont class="tooltip-container" [ngStyle]="{'transform': 'translate('+ transX+'px,'+transY +'px)'}">
        <!--<div #cont class="tooltip-container" [ngStyle]="{'bottom': top, 'left': left}">-->
          <tooltip-content
            *ngFor="let tooltip of tooltipService.components" [title]="tooltip.title" [ref]="tooltip.ref">
          </tooltip-content>
        </div>
  `,
  styles: [
    `
        .tooltip-container{
          margin:auto; 
          padding: 5px;        
          position: fixed;
          z-index: 2; 
        }
    `
  ],
})
export class TooltipContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('cont') cont: ElementRef;
  transX:any ="";
  transY:any= "";

  horizontalAdjust: any= 230; 
  verticalAdjust: any = 160;
  constructor(public tooltipService: TootipServiceService, private contRef: ElementRef, @Inject('tooltipConfig') private config) { }
  
  ngOnInit() {
   /* let coord = this.config.host.getBoundingClientRect();
    let tooltip = this.contRef.nativeElement.getBoundingClientRect();
    let contPos = this.cont.nativeElement.getBoundingClientRect(); */

    let style = getComputedStyle(this.config.host);

    /************get Translate X and Y only *****/
    let mat = style.transform.match(/^matrix3d\((.+)\)$/);
   
    if (mat) {
      this.transX = parseFloat(mat[1].split(', ')[13]);
      this.transY = parseFloat(mat[1].split(', ')[14]);
    }
    else{
      mat = style.transform.match(/^matrix\((.+)\)$/);
      this.transX = (parseFloat(mat[1].split(', ')[4]));
      this. transY = (parseFloat(mat[1].split(', ')[5]));
    }
        

  }
  ngAfterViewInit():void{
    //console.log("transf", this.transf );
  }
}

