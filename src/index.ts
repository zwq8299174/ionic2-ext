export { GpsPoint } from './commons/type/geog';

export { Immerse } from './native/immerse-plugin';
export { ExtILocalNotification, ExtLocalNotifications } from './native/local-notifications';
export { HotCodePushConifg, HotCodePushOptions, HotCodeCallback, HotCodePush } from './native/hot-code-push';
export { AppLauncher, AppLauncherOptions, ExtraOptions } from './native/app-launcher';
export { GeolocationProvider } from './providers/geog/geolocation';

export { LoginConfig, Config, ConfigProvider } from './config/config';
export { ResponseResult, Pagination } from './utils/http/response/response-result';
export { URLParamsBuilder } from './utils/http/url-params-builder';
export { ConsoleErrorHandler } from './utils/console-error-handler';

export { HotUpdater } from './providers/hot-updater';
export { ComponentRegistar } from './providers/component-registar';

export { Storage, SaveOptions, LoadOptions, RemoveOptions } from './providers/storage/storage';
export { MemoryStorage } from './providers/storage/mem-storage';
export { TextFileStorage } from './providers/storage/file-storage';
export { JsonFileStorage } from './providers/storage/json-file-storage';

export * from './pipes/pipes.module';

export * from './components/alpha-scroll/alpha-scroll.module';
export * from './components/open-url-modal/open-url-modal.module';
export * from './components/baidu-map/baidu-map.module';
export * from './components/image-loader/image-loader.module';
export * from './components/star-rating/star-rating.module';
export * from './components/ribbon/ribbon.module';
export * from './components/super-tabs/super-tabs.module';
export * from './components/download-manager/download-manager.module';
export * from './components/nav-button-bar/nav-button-bar.module';
export * from './components/gallery/gallery.module';
export * from './components/select/lazy-select.module';
export * from './components/auto-complete/auto-complete.module';

export { StringUtils } from './utils/string';
export * from './utils/util';
export { Dialog } from './utils/dialog';
export { CoordTransform } from './utils/coord-transform';

export {
  HttpProviderOptionsArgs,
  HttpProviderOptions,
  LoginOptions,
  LoginResult,
  SubAcount,
  HttpProvider,
  CorsHttpProvider,
  ticket_expired
} from './providers/http/http';
export { FileUploder, FileUploderOptions } from './providers/http/file-uploader';
export * from './providers/geog/geog';
export * from './providers/geog/geolocation';
export * from './providers/geog/map-app-launch';

import './rxjs-extensions';

import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';
import { Immerse } from './native/immerse-plugin';
import { HotCodePush } from './native/hot-code-push';
import { ExtLocalNotifications } from './native/local-notifications';
import { AppLauncher } from './native/app-launcher';

import { ModuleWithProviders, NgModule } from '@angular/core';

import { Config, ConfigProvider, EXT_IONIC_CONFIG, setupConfig } from './config/config';
import { Dialog } from './utils/dialog';
import { CorsHttpProvider, HttpProvider } from './providers/http/http';
import { FileUploder } from './providers/http/file-uploader';

import { HotUpdater } from './providers/hot-updater';
import { ComponentRegistar } from './providers/component-registar';

import { MemoryStorage } from './providers/storage/mem-storage';
import { TextFileStorage } from './providers/storage/file-storage';
import { JsonFileStorage } from './providers/storage/json-file-storage';

import { BaiduGeogProvider } from './providers/geog/geog';
import { GeogProvider, MapLaunchProvider } from './providers/geog/map-app-launch';
import { GeolocationProvider } from './providers/geog/geolocation';

import { PipesModule } from './pipes/pipes.module';

import { AlphaScrollModule } from './components/alpha-scroll/alpha-scroll.module';
import { OpenUrlModalModule } from './components/open-url-modal/open-url-modal.module';
import { BaiduMapModule } from './components/baidu-map/baidu-map.module';
import { ImageLoaderModule } from './components/image-loader/image-loader.module';
import { StarRatingModule } from './components/star-rating/star-rating.module';
import { RibbonModule } from './components/ribbon/ribbon.module';
import { SuperTabsModule } from './components/super-tabs/super-tabs.module';
import { DownloadManagerModule } from './components/download-manager/download-manager.module';
import { NavButtonBarModule } from './components/nav-button-bar/nav-button-bar.module';
import { GalleryModule } from './components/gallery/gallery.module';
import { LazySelectModule } from './components/select/lazy-select.module';
import { AutoCompleteModule } from './components/auto-complete/auto-complete.module';

const PROVIDERS: Array<any> = [
  FileTransfer,
  File,
  FileOpener,
  Device,
  Geolocation,

  Dialog,
  HttpProvider,
  CorsHttpProvider,
  FileUploder,
  HotUpdater,
  ComponentRegistar,
  MemoryStorage,
  TextFileStorage,
  JsonFileStorage,
  BaiduGeogProvider,
  GeogProvider,

  Immerse,
  HotCodePush,
  ExtLocalNotifications,
  GeolocationProvider,
  MapLaunchProvider,
  AppLauncher
];

@NgModule({
  imports: [
    AlphaScrollModule.forRoot(),
    BaiduMapModule.forRoot(),
    ImageLoaderModule.forRoot(),
    DownloadManagerModule.forRoot(),
    OpenUrlModalModule.forRoot(),
    RibbonModule.forRoot(),
    SuperTabsModule.forRoot(),
    StarRatingModule.forRoot(),
    PipesModule.forRoot(),
    NavButtonBarModule.forRoot(),
    GalleryModule.forRoot(),
    LazySelectModule.forRoot(),
    AutoCompleteModule.forRoot()
  ],
  exports: [
    AlphaScrollModule,
    BaiduMapModule,
    ImageLoaderModule,
    DownloadManagerModule,
    OpenUrlModalModule,
    RibbonModule,
    SuperTabsModule,
    StarRatingModule,
    PipesModule,
    NavButtonBarModule,
    GalleryModule,
    LazySelectModule,
    AutoCompleteModule
  ]
})
export class ExtIonicModule {
  static forRoot(config?: Config): ModuleWithProviders {
    return {
      ngModule: ExtIonicModule,
      providers: [
        { provide: EXT_IONIC_CONFIG, useValue: config },
        { provide: ConfigProvider, useFactory: setupConfig, deps: [EXT_IONIC_CONFIG] },
        PROVIDERS
      ]
    };
  }
}
