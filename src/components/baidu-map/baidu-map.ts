// 封装参考官方API，http://developer.baidu.com/map/reference/index.php
import { EventEmitter, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { baiduMapLoader } from './baidu-map-loader';
import {
  BaiduMapOptions,
  MarkerOptions,
  PointCollectionOptions
} from './baidu-map-options';
import { GpsPoint } from '../../commons/type/geog';

export var BMap: any;
var BMAP_STATUS_SUCCESS: any;
var BMAP_POINT_SIZE_SMALL: any;
var BMAP_POINT_SHAPE_CIRCLE: any;

@Injectable()
export class BaiduMapController {
  private _map: any;

  get map() {
    return this._map;
  }

  init(opts?: BaiduMapOptions, ele?: HTMLElement): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      baiduMapLoader().then(() => {
        this.initDeclarations();

        if (!ele || !opts) {
          resolve();
          return;
        }

        this._map = new BMap.Map(ele);
        setTimeout(() => {
          if (_.isString(opts.center)) {
            this._map.centerAndZoom(opts.center, opts.zoom);
          } else {
            this._map.centerAndZoom(new BMap.Point(opts.center.lng, opts.center.lat), opts.zoom);
          }
          if (opts.navCtrl) {
            this._map.addControl(new BMap.NavigationControl());
          }
          if (opts.scaleCtrl) {
            this._map.addControl(new BMap.ScaleControl());
          }
          if (opts.overviewCtrl) {
            this._map.addControl(new BMap.OverviewMapControl());
          }
          if (opts.enableScrollWheelZoom) {
            this._map.enableScrollWheelZoom();
          }
          this._map.setCurrentCity(opts.city);
          resolve();
        });
      }, reject);
    });
  }

  translateGps(gpsData: Array<GpsPoint> = []): Promise<any> {
    return new Promise<any>(resolve => {
      let points: Array<any> = [];
      gpsData.forEach(value => {
        points.push(new BMap.Point(value.lng, value.lat));
      });

      let convertor = new BMap.Convertor();
      convertor.translate(points, 1, 5, resolve);
    });
  }

  geoLocation(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let location = new BMap.Geolocation();
      location.getCurrentPosition((result: any) => {
        if (location.getStatus() === BMAP_STATUS_SUCCESS) {
          resolve(result);
        } else {
          reject('不能获取位置');
        }
      }, () => {
        reject('定位失败');
      });
    });
  }

  clearOverlays() {
    this._map.clearOverlays();
  }

  panTo(point: any) {
    this._map.panTo(point);
  }

  geoLocationAndCenter(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.geoLocation().then(result => {
        this.panTo(result.point);
        resolve(result);
      }, () => reject('定位失败'));
    });
  }

  addEventListener(event: string, handler: EventEmitter<any>) {
    this._map.addEventListener(event, (e: any) => {
      handler.emit(e);
    });
  }

  addMarker(markerOpts: MarkerOptions, clickHandler: EventEmitter<any>) {
    let marker = this.createMarker(markerOpts);
    let infoWindow = this.createInfoWindow(markerOpts);
    if (infoWindow) {
      marker.addEventListener('click', () => {
        marker.openInfoWindow(infoWindow);
      });
    } else {
      marker.addEventListener('click', (e: any) => {
        clickHandler.emit(e);
      });
    }
    this._map.addOverlay(marker);
    return marker;
  }

  drawMarkers(markers: Array<MarkerOptions>, clickHandler: EventEmitter<any>): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        // 判断是否含有定位点
        if (!markers || markers.length === 0) {
          reject('没有传入兴趣点');
          return;
        }

        this.clearOverlays();
        let result = [];
        markers.forEach(marker => {
          result.push(this.addMarker(marker, clickHandler));
        });
        resolve(result);
      });
    });
  }

  drawMassPoints(markers: Array<MarkerOptions>, opts: PointCollectionOptions, clickHandler: EventEmitter<any>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!markers || markers.length === 0) {
          reject('没有传入兴趣点');
          return;
        }

        this.clearOverlays();

        let points: Array<any> = [];
        markers.forEach(marker => {
          points.push(new BMap.Point(marker.point.lng, marker.point.lat));
        });

        let pointCollection = new BMap.PointCollection(points, {
          size: BMAP_POINT_SIZE_SMALL,
          shape: BMAP_POINT_SHAPE_CIRCLE,
          color: '#d340c3',
          ...opts
        });
        pointCollection.addEventListener('click', (e: any) => {
          clickHandler.emit(e);
        });
        this._map.addOverlay(pointCollection);
        resolve();
      });
    });
  }

  drawLine(markers: Array<MarkerOptions>, clickHandler: EventEmitter<any>): Promise<any> {
    return this.drawMarkers(markers, clickHandler).then(result => {
      let points = [];
      result.forEach(marker => {
        points.push(marker.getPosition());
      });
      this._map.addOverlay(new BMap.Polyline(points, {
        strokeColor: 'blue',
        strokeWeight: 3,
        strokeOpacity: 0.5
      }));
      return result;
    });
  }

  private initDeclarations() {
    BMap = window['BMap'];
    BMAP_STATUS_SUCCESS = window['BMAP_STATUS_SUCCESS'];
    BMAP_POINT_SIZE_SMALL = window['BMAP_POINT_SIZE_SMALL'];
    BMAP_POINT_SHAPE_CIRCLE = window['BMAP_POINT_SHAPE_CIRCLE'];
  }

  private createIcon(marker: MarkerOptions): any {
    if (marker.icon) {
      if (marker.size) {
        return new BMap.Icon(marker.icon, new BMap.Size(marker.size.width, marker.size.height));
      }
      return new BMap.Icon(marker.icon);
    }

    return null;
  }

  private createInfoWindow(marker: MarkerOptions): any {
    if (marker.infoWindow) {
      let msg = '<p>' + marker.infoWindow.title + '</p><p>' + marker.infoWindow.content + '</p>';
      return new BMap.InfoWindow(msg, {
        enableMessage: !!marker.infoWindow.enableMessage,
        enableCloseOnClick: true
      });
    }

    return null;
  }

  private createMarker(marker: MarkerOptions): any {
    let icon = this.createIcon(marker);
    let pt = new BMap.Point(marker.point.lng, marker.point.lat);
    let result = new BMap.Marker(pt);
    if (icon) {
      result.setIcon(icon);
    }
    if (marker.title) {
      result.setTitle(marker.title);
    }
    return result;
  }
}