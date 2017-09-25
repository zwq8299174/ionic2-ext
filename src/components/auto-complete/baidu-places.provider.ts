import { Injectable } from '@angular/core';
import { AutoCompleteDataProvider } from './auto-complete';
import { BaiduGeogProvider } from '../../providers/geog/geog';

@Injectable()
export class BaiduPlacesProvider implements AutoCompleteDataProvider {
  constructor(private baiduGeogProvider: BaiduGeogProvider) { }

  loadItems(params: any): Promise<any[]> {
    return this.baiduGeogProvider.suggestion(params);
  }

  init(params: any): Promise<any> {
    if (!params.initValue) {
      return Promise.resolve('');
    }

    params = {
      coordType: params.retCoordType ? params.retCoordType : 'gcj02ll',
      ...params.initValue
    };
    return this.baiduGeogProvider.geocoder(params).then(data => {
      return data.addressComponent.street || data.formatted_address;
    });
  }
}