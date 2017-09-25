import { GpsPoint } from '../commons/type/geog';

const X_PI = 3.14159265358979324 * 3000.0 / 180.0;
const PI = 3.1415926535897932384626;
const A = 6378245.0;
const EE = 0.00669342162296594323;

export class CoordTransform {
  static bd09_to_gcj02(point: GpsPoint): GpsPoint {
    const x = point.lng - 0.0065;
    const y = point.lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    return { lng: z * Math.cos(theta), lat: z * Math.sin(theta) };
  }

  static gcj02_to_bd09(point: GpsPoint): GpsPoint {
    const z = Math.sqrt(point.lng * point.lng + point.lat * point.lat) + 0.00002 * Math.sin(point.lat * X_PI);
    const theta = Math.atan2(point.lat, point.lng) + 0.000003 * Math.cos(point.lng * X_PI);
    const bd_lng = z * Math.cos(theta) + 0.0065;
    const bd_lat = z * Math.sin(theta) + 0.006;
    return { lng: bd_lng, lat: bd_lat };
  }

  static wgs84_to_gcj02(point: GpsPoint): GpsPoint {
    if (this.out_of_china(point)) {
      return point;
    }
    let dlat = this.transformLat(point.lng - 105.0, point.lat - 35.0);
    let dlng = this.transformLng(point.lng - 105.0, point.lat - 35.0);
    const radlat = point.lat / 180.0 * PI;
    let magic = Math.sin(radlat);
    magic = 1 - EE * magic * magic;
    const sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((A * (1 - EE)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (A / sqrtmagic * Math.cos(radlat) * PI);
    return { lat: point.lat + dlat, lng: point.lng + dlng };
  }

  static gcj02_to_wgs84(point: GpsPoint): GpsPoint {
    if (this.out_of_china(point)) {
      return point;
    }
    const result: GpsPoint = this.wgs84_to_gcj02(point);
    return { lng: point.lng * 2 - result.lng, lat: point.lat * 2 - result.lat };
  }

  static wgs84_to_bd09(point: GpsPoint): GpsPoint {
    const gcj02 = this.wgs84_to_gcj02(point);
    return this.gcj02_to_bd09(gcj02);
  }

  static bd09_to_wgs84(point: GpsPoint): GpsPoint {
    const gcj02 = this.bd09_to_gcj02(point);
    return this.gcj02_to_wgs84(gcj02);
  }

  static out_of_china(point: GpsPoint): boolean {
    // 纬度3.86~53.55,经度73.66~135.05
    return !(point.lng > 73.66 && point.lng < 135.05 && point.lat > 3.86 && point.lat < 53.55);
  }

  private static transformLat(lng, lat): number {
    var result = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    result += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    result += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    result += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return result;
  }

  private static transformLng(lng, lat): number {
    var result = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    result += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    result += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    result += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return result;
  }
}