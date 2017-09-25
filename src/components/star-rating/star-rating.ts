import { Component, ElementRef, Input, OnDestroy, OnInit, Optional, Renderer, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Config, Form, Item } from 'ionic-angular';
import { BaseInput } from 'ionic-angular/util/base-input';
import * as _ from 'lodash';

@Component({
  selector: 'ion-star-rating',
  template: `
    <ul class="rating">
      <li *ngFor="let r of range; let i = index" tappable (click)="rate(i + 1)" attr.index="{{i + 1}}">
        <ion-icon [name]="setIcon(r)"></ion-icon>
      </li>
    </ul>
  `,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: StarRatingCmp, multi: true }]
})
export class StarRatingCmp extends BaseInput<number> implements OnInit, OnDestroy {
  @Input() max: number = 5;
  @Input() readonly: boolean = false;

  range: Array<number>;
  private hammer: HammerManager;

  constructor(
    config: Config,
    private elementRef: ElementRef,
    renderer: Renderer,
    form: Form,
    @Optional() item: Item
  ) {
    super(config, elementRef, renderer, 'star-rating', 0, form, item, null);
  }

  ngOnInit() {
    setTimeout(() => {
      this.setupHammerHandlers();
    });
  }

  ngOnDestroy() {
    if (this.hammer) {
      this.hammer.destroy();
    }
  }

  setIcon(r: number): string {
    if (r === 1) {
      return 'star';
    }

    if (r === 2) {
      return 'star-half';
    }

    return 'star-outline';
  }

  _inputUpdated() {
    this.fullStates();
  }

  rate(amount: number) {
    if (this.readonly) {
      return;
    }

    if (this.range[amount - 1] === 1) {
      amount = amount - 1;
    }

    this.value = amount;
  }

  private setupHammerHandlers() {
    const ratingEle: HTMLElement = this.elementRef.nativeElement.querySelector('.rating');
    if (!ratingEle) return;

    this.hammer = new Hammer(ratingEle, {
      recognizers: [
        [Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }],
      ]
    });

    this.hammer.on('panleft panright', _.throttle((e: any) => {
      let closestEle: Element = document.elementFromPoint(e.center.x, e.center.y);
      if (closestEle && ['LI'].indexOf(closestEle.tagName) > -1) {
        this.rate(Number(closestEle.getAttribute('index')));
      }
    }, 50));
  }

  private fullStates(): void {
    let states: Array<number> = [];
    for (let i = 0; i < this.max; i++) {
      if (this.value > i && this.value < i + 1) {
        states[i] = 2;
      } else if (this.value > i) {
        states[i] = 1;
      } else {
        states[i] = 0;
      }
    }
    this.range = states;
  }
}