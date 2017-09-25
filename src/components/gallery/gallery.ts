import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ImageLoaderController } from '../image-loader/image-loader';
import { ViewController } from 'ionic-angular';

export interface GalleryOptions {
  colWidth?: number;
  colNum?: number;
  urlKey?: string;
  thumbKey?: string;
  thumbnailTitleKey?: string;
  fallbackUrl?: string;
}

@Component({
  selector: 'ion-gallery',
  template: `
		<div class="row">
		  <div *ngFor="let item of items;let i = index;" tappable (click)="itemTapped(item, i)" (press)="itemTappedPress(item, i)" [ngStyle]="colStyle" class="col">
		    <div class="thumbnal">
					<ion-image-loader src="{{item[options.thumbKey]}}" fallback="{{options.fallbackUrl}}"></ion-image-loader>
		      <div *ngIf="options.thumbnailTitleKey" class="thumbnailTitle">{{item[options.thumbnailTitleKey]}} </div>
		    </div>
		  </div>
		</div>
	`,
  styles: [`
		.thumbnailTitle {
		  display: block;
		}
		.row {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      padding: 5px;
      width: 100%;
      flex-flow: row wrap;
		}
		.row .col {
      display: block;
      text-align: center;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1 1 30%;
      padding: 5px;
		}
`],
})
export class Gallery implements OnInit, OnDestroy {
  @Input() items: any[];
  @Input() options: GalleryOptions;
  @Output() itemClick: EventEmitter<any> = new EventEmitter();
  @Output() itemPress: EventEmitter<any> = new EventEmitter();
  colStyle: any;

  private watches: Subscription[] = [];

  constructor(
    private elementRef: ElementRef,
    private imgCtrl: ImageLoaderController,
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
      this.calculateCol();
    }));
  }

  ngOnInit() {
    this.options.colWidth = Math.abs(this.options.colWidth) || 200;
    this.options.urlKey = this.options.urlKey || 'url';
    this.options.thumbKey = this.options.thumbKey || this.options.urlKey;
    this.colStyle = {};

    this.calculateCol();
  }

  ngOnDestroy(): void {
    this.watches.forEach((watch) => {
      watch.unsubscribe && watch.unsubscribe();
    });
  }

  calculateCol() {
    const width = this.elementRef.nativeElement.firstElementChild.clientWidth;
    if (width === 0) {
      return;
    }

    let colWidth = this.options.colWidth;
    let col = Math.trunc(width / colWidth);
    if (this.options.colNum) {
      col = this.options.colNum;
    }
    if (col <= 1) col = 1;
    let percent = 100 / col + '%';
    this.colStyle.flexBasis = percent;
    this.colStyle.maxWidth = percent;
  }

  itemTapped(item: any, index: number) {
    item.index = index;
    this.imgCtrl.getImagePath(item[this.options.thumbKey]).then((path) => {
      item['localPath'] = path;
      this.itemClick.emit(item);
    }).catch(() => {
      this.itemClick.emit(item);
    });
  }

  itemTappedPress(item: any, index: number) {
    item.index = index;
    this.imgCtrl.getImagePath(item[this.options.thumbKey]).then((path) => {
      item['localPath'] = path;
      this.itemPress.emit(item);
    }).catch(() => {
      this.itemPress.emit(item);
    });
  }
}
