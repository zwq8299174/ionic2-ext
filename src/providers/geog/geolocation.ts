import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

const defaultOptions: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 20000
};

@Injectable()
export class GeolocationProvider {
  private watch: Subscription;
  private coordinates: Coordinates | any;

  constructor(private geolocation: Geolocation) { }

  start(options: GeolocationOptions = defaultOptions) {
    this.watch = this.watchPosition(options).filter((p) => p.coords !== undefined).subscribe((data) => {
      this.coordinates = data.coords;
    });
  }

  watchPosition(options: GeolocationOptions = defaultOptions): Observable<Geoposition> {
    return this.geolocation.watchPosition(options);
  }

  stop() {
    if (this.watch) {
      this.watch.unsubscribe();
    }
  }

  getCurrentPosition(options: GeolocationOptions = defaultOptions): Promise<Geoposition> {
    return this.geolocation.getCurrentPosition(options);
  }

  getCurrentCoordinates(): Coordinates {
    return this.coordinates || {};
  }
}