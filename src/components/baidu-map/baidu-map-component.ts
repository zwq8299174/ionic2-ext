import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';

import { ConfigProvider } from '../../config/config';

import { BaiduMapOptions, MarkerOptions } from './baidu-map-options';
import { BMap, BaiduMapController } from './baidu-map';

@Component({
  selector: 'ion-baidu-map',
  template: `
    <div class="offlinePanel" [style.opacity]="opacity">
      <label>唉呀，网络出问题了</label>
    </div>
  `
})
export class BaiduMap implements AfterViewInit, OnChanges {
  @Input() options: BaiduMapOptions;

  @Output() onMapLoaded: EventEmitter<void> = new EventEmitter<void>();
  @Output() onMapLoadFialed: EventEmitter<any> = new EventEmitter<any>();
  @Output() onMapClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onMarkerClick: EventEmitter<any> = new EventEmitter<any>();

  opacity: number = 0;

  private mapLoaded: boolean = false;

  constructor(
    private _elementRef: ElementRef,
    private baiduMapCtrl: BaiduMapController,
    private config: ConfigProvider
  ) { }

  ngAfterViewInit() {
    let opts: BaiduMapOptions = this.getOptions();
    this.baiduMapCtrl.init(
      opts,
      this._elementRef.nativeElement
    ).then(() => {
      this.baiduMapCtrl.addEventListener('click', this.onMapClick);
      this.draw(opts.markers);
      this.mapLoaded = true;
      this.onMapLoaded.emit();
    }, e => {
      this.opacity = 1;
      this.onMapLoadFialed.emit(e);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.mapLoaded) {
      return;
    }

    let options: SimpleChange = changes['options'];
    if (options.isFirstChange) {
      return;
    }

    if (options && !_.isEqual(options.previousValue, options.currentValue)) {
      this.reDraw(this.getOptions());
    }
  }

  private reDraw(opts: BaiduMapOptions) {
    if (_.isString(opts.center)) {
      this.baiduMapCtrl.map.setCenter(opts.center);
    } else {
      this.baiduMapCtrl.map.setCenter(new BMap.Point(opts.center.lng, opts.center.lat));
    }
    this.draw(opts.markers);
  }

  private draw(markers: Array<MarkerOptions>) {
    let opts: BaiduMapOptions = this.getOptions();
    if (opts.mass.enabled) {
      this.baiduMapCtrl.drawMassPoints(markers, opts.mass.options, this.onMarkerClick);
      return;
    }
    this.baiduMapCtrl.drawMarkers(markers, this.onMarkerClick);
  }

  private getOptions(): BaiduMapOptions {
    return { ...this.config.get().baiduMap, ...this.options };
  }
}