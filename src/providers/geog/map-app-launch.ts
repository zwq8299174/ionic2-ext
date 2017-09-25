import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';
import { ActionSheetController, Platform } from 'ionic-angular';
import * as _ from 'lodash';
import { AppLauncher, AppLauncherOptions } from '../../native/app-launcher';
import { Dialog } from '../../utils/dialog';
import { BaiduGeogProvider } from './geog';
import { GpsPoint } from '../../commons/type/geog';

interface GeogService {
  transformGps(points: GpsPoint[]): Promise<GpsPoint[]>;
}

class BaiDuGeogService implements GeogService {
  constructor(private geog: BaiduGeogProvider) { }

  transformGps(points: GpsPoint[]): Promise<GpsPoint[]> {
    return this.geog.transformGps(points);
  }
}

class AmapGeogService implements GeogService {
  private appKey: string = '32adf46617be0d1a6a5658cce57cf9e0';

  constructor(
    private jsonp: Jsonp,
  ) { }

  transformGps(points: GpsPoint[]): Promise<GpsPoint[]> {
    let pointsStrs = [];
    points.forEach(coords => {
      pointsStrs.push(coords.lng + ',' + coords.lat);
    });
    let url = `http://restapi.amap.com/v3/assistant/coordinate/convert?callback=JSONP_CALLBACK&coordsys=gps&output=json&key=${this.appKey}&locations=${pointsStrs.join('|')}`;
    return <Promise<GpsPoint[]>>this.jsonp.get(url).map(
      (r => r.json())
    ).toPromise().then(o => {
      let location: string[] = _.split(o.locations, ';');
      let result: GpsPoint[] = [];
      location.forEach(v => {
        let p = _.split(v, ',');
        result.push({ lng: +p[0], lat: +p[1] });
      });
      return result;
    }).catch(e => {
      Promise.reject(e);
    });
  }
}

export const　enum MapType { BAIDU, AMAP }

@Injectable()
export class GeogProvider {
  private serviceMap: Map<MapType, GeogService> = new Map();

  constructor(
    private jsonp: Jsonp,
    private geog: BaiduGeogProvider
  ) {
    this.serviceMap.set(MapType.BAIDU, new BaiDuGeogService(this.geog));
    this.serviceMap.set(MapType.AMAP, new AmapGeogService(this.jsonp));
  }

  transformGps(points: GpsPoint[], mapType?: MapType): Promise<GpsPoint[]> {
    let geogService = this.serviceMap.get(mapType ? mapType : MapType.BAIDU);
    return geogService.transformGps(points);
  }
}

interface MapLaunchService {
  launch(point: GpsPoint): Promise<any>;

  canLaunch(): Promise<any>;

  getMapType(): MapType;

  getName(): string;
}

class BaiDuMapLaunchService implements MapLaunchService {
  constructor(
    private platform: Platform,
    private appLauncher: AppLauncher
  ) { }

  getName(): string {
    return '百度地图';
  }

  getMapType(): MapType {
    return MapType.BAIDU;
  }

  launch(point: GpsPoint): Promise<any> {
    return this.appLauncher.launch({
      uri: `baidumap://map/geocoder?location=${point.lng},${point.lat}&src=webapp.rgeo.whcyit.myApp`
    });
  }

  canLaunch(): Promise<any> {
    let opt: AppLauncherOptions = {};
    if (this.platform.is('ios')) {
      opt.uri = 'baidumap://';
    } else {
      opt.packageName = 'com.baidu.BaiduMap';
    }
    return this.appLauncher.canLaunch(opt).then(() => {
      return true;
    }).catch(() => {
      Promise.resolve(false);
    });
  }
}

class AmapMapLaunchService implements MapLaunchService {
  constructor(
    private platform: Platform,
    private appLauncher: AppLauncher
  ) {
  }

  getName(): string {
    return '高德地图';
  }

  getMapType(): MapType {
    return MapType.AMAP;
  }

  launch(point: GpsPoint): Promise<any> {
    let o = {
      platform: this.platform.is('android') ? 'android' : 'ios',
      dev: this.platform.is('android') ? 0 : 1,
      ...point,
    };
    let uri = `${o.platform}amap://viewReGeo?sourceApplication=myApp&dev=${o.dev}&lon=${o.lng}&lat=${o.lat}`;
    return this.appLauncher.launch({
      uri: uri
    });
  }

  canLaunch(): Promise<any> {
    let opt: AppLauncherOptions = {};
    if (this.platform.is('ios')) {
      opt.uri = 'iosamap://';
    } else {
      opt.packageName = 'com.autonavi.minimap';
    }
    return this.appLauncher.canLaunch(opt).then(() => {
      return true;
    }).catch(() => {
      Promise.resolve(false);
    });
  }
}

@Injectable()
export class MapLaunchProvider {
  private services: MapLaunchService[] = [];

  constructor(
    platform: Platform,
    appLauncher: AppLauncher,
    private geoProvider: GeogProvider,
    private dialog: Dialog,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.services.push(new BaiDuMapLaunchService(platform, appLauncher));
    this.services.push(new AmapMapLaunchService(platform, appLauncher));
  }

  launch(point: GpsPoint): Promise<any> {
    let promises: Promise<any>[] = [];
    this.services.forEach(service => {
      promises.push(service.canLaunch());
    });
    let indexs: number[] = [];
    return Promise.all(promises).then(results => {
      results.forEach((v, index) => {
        if (v === true) {
          indexs.push(index);
        }
      });
      if (indexs.length === 0) {
        this.dialog.alert('错误', '请安装百度地图或高德地图后在使用地图功能');
        return Promise.reject('未安装地图app');
      }
      if (indexs.length === 1) {
        return this._launch(point, indexs[0]);
      }
      this.show(point, indexs);
      return Promise.resolve();
    });
  }

  private show(point: GpsPoint, index: number[]) {
    let buttons = [];
    index.forEach(v => {
      buttons.push({
        text: this.services[v].getName(),
        handler: () => {
          this._launch(point, v);
        }
      });
    });
    let actionSheet = this.actionSheetCtrl.create({
      buttons: buttons
    });
    actionSheet.present();
  }

  private _launch(point: GpsPoint, index: number): Promise<any> {
    let service = this.services[index];
    return this.geoProvider.transformGps([point], service.getMapType()).then(result => {
      service.launch(result[0]);
    }).catch(e => {
      return Promise.reject(e);
    });
  }
}