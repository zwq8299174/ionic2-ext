import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { Page } from 'ionic-angular/navigation/nav-util';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { ViewController } from 'ionic-angular';

export interface NavButton {
  label: string;
  page?: Page | string;
  params?: any;
  icon?: string;
  iconColor?: string;
  number?: number;
}

@Component({
  selector: 'nav-button-bar',
  styles: [`
    .row {
      width: 100%;
    }

    .btn-group {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
    }

    .btn-group>.btn-box {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .btn-box>.btn-box-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .btn-box-content>ion-icon {
      font-size: 2.5em;
    }

    .btn-box-content>.btn-text {
      width: 100%;
      bottom: 1vmin;
      text-align: center;
      color: black;
      font-size: 0.8em;
    }

    .notify-bar{
      display: -webkit-flex;
      display: flex;
      flex-flow: row;
      width: 100%;
      margin-top: 10px;
      margin-bottom: 10px;
      overflow-x: scroll;
      overflow-y: hidden;
    }

    .notify-bar > .notify-bar-box{
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-right:1px solid #F2F3F5;
      text-align: center;
    }

    .notify-bar > .notify-bar-box:last-child{
      border-right: none;
    }

    .notify-bar-box > button{
      color: black;
      font-size: 2em;
      border-radius: 15px;
    }
  `],
  template: `
  <div class="row">
    <div *ngIf="type === 'icon'" class="btn-group">
      <a [ngStyle]="boxStyle" class="btn-box" *ngFor="let item of items" (click)="onClick(item)">
        <div class="btn-box-content" [ngStyle]="contentStyle">
          <ion-icon name="{{item.icon}}" [style.color]="item.iconColor"></ion-icon>
          <div class="btn-text">{{item.label}}</div>
        </div>
        <div class="button-effect"></div>
      </a>
    </div>

    <div *ngIf="type === 'number'" class="notify-bar">
      <div *ngFor="let item of items" class="notify-bar-box" [ngStyle]="boxStyle">
        <button ion-button [ngStyle]="contentStyle" color="light" outline (click)="onClick(item)">{{item.number}}</button>
        <label>{{item.label}}</label>
      </div>
    </div>
  </div>
  `,
})
export class NavButtonBar implements OnInit, OnDestroy {
  @Input()
  type: string = 'icon';

  @Input()
  items: Array<NavButton>;

  @Output()
  itemClick: EventEmitter<NavButton> = new EventEmitter<NavButton>();

  private watches: Subscription[] = [];

  boxStyle: any;

  contentStyle: any;

  constructor(
    private elRef: ElementRef,
    @Optional() public viewCtrl: ViewController
  ) {
    let obsToMerge: Observable<any>[] = [
      Observable.fromEvent(window, 'orientationchange'),
      Observable.fromEvent(window, 'resize')
    ];
    if (viewCtrl) {
      obsToMerge.push(viewCtrl.didEnter);
    }
    this.watches.push(Observable.merge.apply(
      this,
      obsToMerge
    ).debounceTime(10).subscribe(() => {
      this.calculate();
    }));
  }

  ngOnInit(): void {
    this.boxStyle = {};
    this.contentStyle = {};
    this.calculate();
  }

  ngOnDestroy(): void {
    this.watches.forEach((watch) => {
      watch.unsubscribe && watch.unsubscribe();
    });
  }

  calculate(): void {
    let width = this.elRef.nativeElement.firstElementChild.clientWidth;
    if (width === 0) return;
    let num = window.screen.width > window.screen.height ? 8 : 4;
    let gpx = width / num + 'px';
    this.boxStyle.width = gpx;
    this.boxStyle.height = gpx;
    let bpx = (width / num) / 1.5 + 'px';
    this.contentStyle.width = bpx;
    this.contentStyle.height = bpx;
  }

  onClick(item: NavButton) {
    this.itemClick.emit(item);
  }
}