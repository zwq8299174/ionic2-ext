import { ModuleWithProviders, NgModule } from '@angular/core';
import { BaiduMapController } from './baidu-map';
import { BaiduMap } from './baidu-map-component';

export { BaiduMapController } from './baidu-map';
export {
  MarkerSize,
  MarkerInfoWindow,
  MarkerOptions,
  PointCollectionOptions,
  MassOptions,
  BaiduMapOptions
} from './baidu-map-options';

@NgModule({
  exports: [
    BaiduMap
  ],
  declarations: [
    BaiduMap
  ]
})
export class BaiduMapModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: BaiduMapModule,
      providers: [
        BaiduMapController
      ]
    };
  }
}