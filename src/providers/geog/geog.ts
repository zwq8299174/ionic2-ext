import { Jsonp } from '@angular/http';
import { Injectable } from '@angular/core';
import { GpsPoint } from '../../commons/type/geog';

export interface Geocoder extends GpsPoint {
  coordType?: 'bd09ll' | 'bd09mc' | 'gcj02ll' | 'wgs84ll' | 'wgs84';
  pois?: '0' | '1';
  radius?: number;
}

export interface Suggestion {
  keyword: string;
  region?: string;
  coordType?: 'wgs84' | 'gcj02' | 'bd09';
  retCoordType?: 'gcj02ll' | 'gcj02' | 'bd09';
  location?: string;
}

@Injectable()
export class BaiduGeogProvider {
  private appKey: string = '12c17c924871a04f1dbac75e1824edb7';

  constructor(private jsonp: Jsonp) {
  }

  geocoder(params: Geocoder): Promise<any> {
    params = {
      pois: '0',
      coordType: 'wgs84ll',
      radius: 250,
      ...params
    };
    const url = `http://api.map.baidu.com/geocoder/v2/?coordtype=${params.coordType}&radius=${params.radius}&location=${params.lat},${params.lng}&output=json&pois=${params.pois}&ak=${this.appKey}`;
    return this.jsonp.get(url, { params: { 'callback': 'JSONP_CALLBACK' } }).map(r => r.json()).toPromise().then(r => {
      if (r.status !== 0) {
        return Promise.reject(r.message);
      }
      return r.result;
    }).catch(e => Promise.reject(e));
  }

  suggestion(params: Suggestion): Promise<any> {
    params = {
      region: '湖北省',
      coordType: 'wgs84',
      retCoordType: 'gcj02ll',
      location: '',
      ...params
    };
    const url = `http://api.map.baidu.com/place/v2/suggestion?q=${params.keyword}&region=${params.region}&location=${params.location}&city_limit=true&coord_type=${params.coordType}&ret_coordtype=${params.retCoordType}&output=json&ak=${this.appKey}`;
    return this.jsonp.get(url, { params: { 'callback': 'JSONP_CALLBACK' } }).map(r => r.json()).toPromise().then(r => {
      if (r.status !== 0) {
        return Promise.reject(r.message);
      }
      return r.result;
    }).catch(e => Promise.reject(e));
  }

  transformGps(points: GpsPoint[]): Promise<GpsPoint[]> {
    let coordsStrs = [];
    points.forEach(coords => {
      coordsStrs.push(coords.lng + ',' + coords.lat);
    });
    const url = `http://api.map.baidu.com/geoconv/v1/?output=json&from=1&to=5&ak=${this.appKey}&coords=${coordsStrs.join(';')}`;
    return this.jsonp.get(url, { params: { 'callback': 'JSONP_CALLBACK' } }).map(r => r.json()).toPromise().then(r => {
      if (r.status !== 0) {
        return Promise.reject<any>('转换 gps 失败');
      }

      let result: GpsPoint[] = [];
      r.result.forEach(p => {
        result.push({ lng: p.y, lat: p.x });
      });
      return result;
    }).catch(e => Promise.reject(e));
  }
}