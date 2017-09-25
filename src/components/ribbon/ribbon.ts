import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer } from '@angular/core';
import { isPresent } from '../../utils/util';

export interface RibbnOptions {
  backgroundColor: string;
  ribbonColor: string;
  ribbonText: string;
  fontSize: string;
  heightAmend: number;
}

@Component({
  selector: '[ribbon]',
  template: `
    <div class="triangle" [ngStyle]="riangleStyleOne"></div>
    <div class="triangle" [ngStyle]="triangleStyleTwo"></div>
    <div class="ribbon-text-box" [ngStyle]="textStyle">
      <div>{{ribbonOption.ribbonText}}</div>
    </div>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ribbon implements OnInit {
  riangleStyleOne: any;
  triangleStyleTwo: any;
  textStyle: any;

  @Input('ribbon-option')
  ribbonOption: RibbnOptions;

  constructor(private renderer: Renderer, private elementRef: ElementRef) {
  }

  ngOnInit() {
    if (!isPresent(this.ribbonOption.backgroundColor)) {
      this.ribbonOption.backgroundColor = 'white';
    }
    if (!isPresent(this.ribbonOption.ribbonColor)) {
      this.ribbonOption.ribbonColor = 'red';
    }
    if (!isPresent(this.ribbonOption.heightAmend)) {
      this.ribbonOption.heightAmend = 0;
    }
    this.renderer.setElementClass(this.elementRef.nativeElement, 'ribbon-bar', true);
    let height = this.elementRef.nativeElement.offsetHeight + this.ribbonOption.heightAmend;
    this.riangleStyleOne = { borderTop: height * 0.52 + 'px solid ' + this.ribbonOption.ribbonColor, borderLeft: height * 0.52 + 'px solid transparent' };
    this.triangleStyleTwo = { borderTop: height * 0.2 + 'px solid ' + this.ribbonOption.backgroundColor, borderLeft: height * 0.2 + 'px solid transparent' };
    this.textStyle = { width: height * 0.52 + 'px', height: height * 0.23 + 'px', top: height * 0.07 + 'px', right: '-' + height * 0.09 + 'px' };
    if (isPresent(this.ribbonOption.fontSize)) {
      this.textStyle['font-size'] = this.ribbonOption.fontSize;
    }
  }
}