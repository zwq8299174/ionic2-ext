import * as _ from 'lodash';
import { Injectable, InjectionToken } from '@angular/core';

import { OpenUrlModalOptions } from '../components/open-url-modal/open-url-modal-options';
import { ImageLoaderOptions } from '../components/image-loader/image-loader-options';
import { BaiduMapOptions } from '../components/baidu-map/baidu-map-options';

export interface LoginConfig {
  appKey?: string;
  url?: string;
}

export interface Config {
  color?: string;
  hotUpdateUrl?: any;
  devMode?: boolean;
  login?: LoginConfig;
  openUrlModal?: OpenUrlModalOptions;
  imageLoader?: ImageLoaderOptions;
  baiduMap?: BaiduMapOptions;
}

const defaultConfig: Config = {
  devMode: false,
  openUrlModal: {
    onmessage: () => { }
  },
  imageLoader: {
    spinnerEnabled: true,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    display: 'block',
    width: '100%',
    height: '100%',
    useImg: true,
    cacheDirectoryName: 'image-loader-cache',
    concurrency: 5,
    maxCacheSize: -1,
    maxCacheAge: 1000 * 60 * 60 * 72,
    imageReturnType: 'uri',
    fallbackAsPlaceholder: false
  },
  baiduMap: {
    navCtrl: true,
    scaleCtrl: true,
    overviewCtrl: true,
    enableScrollWheelZoom: true,
    zoom: 10,
    city: '武汉',
    mass: {
      enabled: false
    }
  }
};

@Injectable()
export class ConfigProvider {
  private _config: Config;

  get(): Config {
    return this._config;
  }

  init(config: Config) {
    this._config = _.isUndefined(config) ? defaultConfig : _.defaultsDeep(config, defaultConfig);
  }
}

export function setupConfig(userConfig: Config): ConfigProvider {
  const conifg = new ConfigProvider();
  conifg.init(userConfig);
  return conifg;
}

export const EXT_IONIC_CONFIG = new InjectionToken<string>('EXT_IONIC_CONFIG');