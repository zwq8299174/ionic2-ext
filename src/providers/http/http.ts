import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Headers,
  Http,
  Request,
  RequestMethod,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  ResponseContentType,
  URLSearchParams
} from '@angular/http';
import { Events, Loading } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import * as _ from 'lodash';

import { ConfigProvider } from '../../config/config';
import { Dialog } from '../../utils/dialog';
import { isPresent } from '../../utils/util';
import { ResponseResult } from '../../utils/http/response/response-result';
import { URLParamsBuilder } from '../../utils/http/url-params-builder';
import { StringUtils } from '../../utils/string';
import { JsonFileStorage } from '../storage/json-file-storage';
import { MemoryStorage } from '../storage/mem-storage';

export const ticket_expired: string = 'ticket-expired';

export interface HttpProviderOptionsArgs extends RequestOptionsArgs {
  showLoading?: boolean;
  loadingContent?: string;
  showErrorAlert?: boolean;
  cache?: boolean;
  cacheOnly?: boolean;
  memCache?: boolean;
  maxCacheAge?: number;
}

export class HttpProviderOptions extends RequestOptions {
  showLoading: boolean;
  loadingContent: string;
  showErrorAlert: boolean;
  cache: boolean;
  cacheOnly: boolean;
  memCache: boolean;
  maxCacheAge: number;

  constructor(options: HttpProviderOptionsArgs) {
    super(options);

    this.showLoading = options.showLoading;
    this.loadingContent = options.loadingContent;
    this.showErrorAlert = options.showErrorAlert;
    this.cache = options.cache;
    this.cacheOnly = options.cacheOnly;
    this.memCache = options.memCache;
    this.maxCacheAge = options.maxCacheAge;
  }

  merge(options?: HttpProviderOptionsArgs): HttpProviderOptions {
    let result = <HttpProviderOptions>super.merge(options);

    result.showLoading = isPresent(options.showLoading) ? options.showLoading : this.showLoading;
    result.showErrorAlert = isPresent(options.showErrorAlert) ? options.showErrorAlert : this.showErrorAlert;
    result.loadingContent = options.loadingContent ? options.loadingContent : this.loadingContent;
    result.cache = isPresent(options.cache) ? options.cache : this.cache;
    result.cacheOnly = isPresent(options.cacheOnly) ? options.cacheOnly : this.cacheOnly;
    result.memCache = isPresent(options.memCache) ? options.memCache : this.memCache;
    result.maxCacheAge = isPresent(options.maxCacheAge) ? options.maxCacheAge : this.maxCacheAge;

    return result;
  }
}

const HTTP_CACHE_DIR = 'whc';

const defaultRequestOptions: HttpProviderOptions = new HttpProviderOptions({
  showLoading: true,
  loadingContent: '正在加载...',
  showErrorAlert: true,
  withCredentials: true,
  cache: false,
  cacheOnly: false,
  memCache: false,
  maxCacheAge: 1000 * 60 * 60 * 6,
  method: RequestMethod.Get,
  responseType: ResponseContentType.Json
});

export interface LoginOptions {
  username: string;
  password: string;
  appId?: string;
  jpushId?: string;
}

export interface SubAcount {
  type?: string;
  name?: string;
  password?: string;
}

export interface LoginResult {
  successToken?: string;
  subAccounts?: Array<SubAcount>;
}

const APP_JSON_TYPE = 'application/json';

@Injectable()
export class HttpProvider {
  constructor(
    private _http: Http,
    private jsonCache: JsonFileStorage,
    private memCache: MemoryStorage,
    private dialog: Dialog
  ) { }

  get http(): Http {
    return this._http;
  }

  requestWithError<T>(
    url: string,
    options?: HttpProviderOptionsArgs,
    foundCacheCallback: (result: T) => void = (_result: T) => { }
  ): Promise<T> {
    options = options ? defaultRequestOptions.merge(options) : defaultRequestOptions;

    let cache = options.memCache ? this.memCache : this.jsonCache;

    let innerRequest = (url: string, options?: HttpProviderOptionsArgs): Promise<T> => {
      return this.request<T>(url, options).then((result: ResponseResult<T>) => {
        if (result.status === 1) {
          if (options.showErrorAlert) {
            this.dialog.alert('系统提示', result.msg);
          }
          if (isPresent(result.data) && !_.isEqual({}, result.data)) {
            return Promise.reject(result);
          }
          return Promise.reject(result.msg);
        }

        if (options.cache && options.method === RequestMethod.Get && cacheKey) {
          cache.save({ dirname: HTTP_CACHE_DIR, filename: cacheKey, content: result.data });
        }

        return result.data;
      }).catch(err => {
        return Promise.reject(err);
      });
    };

    let cacheKey;
    if (options.cache && options.method === RequestMethod.Get) {
      cacheKey = this.hashUrl(url, <URLSearchParams>(options.params || options.search));

      if (options.cacheOnly) {
        return cache.load<T>(
          { dirname: HTTP_CACHE_DIR, filename: cacheKey, maxAge: options.maxCacheAge }
        ).catch(() => { return innerRequest(url, options); });
      }

      cache.load<T>({ dirname: HTTP_CACHE_DIR, filename: cacheKey }).then(result => {
        foundCacheCallback(result);
      }).catch(error => console.log(error));
    }

    return innerRequest(url, options);
  }

  request<T>(url: string, options?: HttpProviderOptionsArgs): Promise<ResponseResult<T>> {
    options = options || defaultRequestOptions;
    let loading: Loading;
    if (options.showLoading) {
      loading = this.dialog.loading(options.loadingContent);
      loading.present();
    }
    return this.ajax(url, options).toPromise().then(result => {
      if (loading) loading.dismiss().catch(() => { });
      return result;
    }).catch(err => {
      if (loading) loading.dismiss().catch(() => { });
      return Promise.reject(err);
    });
  }

  ajax<T>(url: string | Request, options?: HttpProviderOptionsArgs): Observable<ResponseResult<T>> {
    options = options || defaultRequestOptions;
    let params = URLParamsBuilder.build({ '__cors-request__': true });
    if (options.search) {
      params.replaceAll(<URLSearchParams>options.search);
    }
    if (options.params) {
      params.replaceAll(<URLSearchParams>options.params);
    }
    options.params = params;

    if (options.method === RequestMethod.Post && !(options.body instanceof FormData)) {
      options.body = options.body || {};
      options.headers = options.headers || new Headers();

      let contentType = options.headers.get('Content-Type');
      if (!contentType) {
        contentType = APP_JSON_TYPE;
        options.headers.set('Content-Type', contentType);
      }

      if (!_.isString(options.body)) {
        if (APP_JSON_TYPE === contentType.toLowerCase()) {
          options.body = JSON.stringify(options.body);
        } else {
          options.body = URLParamsBuilder.build(options.body).toString();
        }
      }
    }

    return this.http.request(url, options).map(
      (r: Response) => new ResponseResult<T>(r.json())
    );
  }

  private hashUrl(url: string, params: URLSearchParams): string {
    let q = params ? params.toString() : '';
    return StringUtils.hash(url + q).toString();
  }
}

@Injectable()
export class CorsHttpProvider {
  private _ticket: string = null;

  get ticket(): string {
    return this._ticket;
  }

  set ticket(t: string) {
    this._ticket = t;
  }

  get httpProvider(): HttpProvider {
    return this.http;
  }

  constructor(
    private http: HttpProvider,
    private events: Events,
    private config: ConfigProvider,
    private device: Device
  ) { }

  login(options: LoginOptions): Promise<LoginResult> {
    return this.request<LoginResult>(this.config.get().login.url, {
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        '__login__': 'true',
        '__uuid__': this.device.uuid,
        '__model__': this.device.model
      }),
      method: RequestMethod.Post,
      showErrorAlert: false,
      body: options
    });
  }

  logout(): Promise<string> {
    return this.request<string>(this.config.get().login.url, {
      cache: false,
      headers: new Headers({
        '__logout__': 'true'
      })
    }).then(result => {
      this.ticket = null;
      return result;
    });
  }

  request<T>(
    url: string,
    options?: HttpProviderOptionsArgs,
    foundCacheCallback: (result: T) => void = (_result: T) => { }
  ): Promise<T> {
    options = options || {};
    options.headers = options.headers || new Headers();

    options.headers.set('__app-key__', this.config.get().login.appKey);
    options.headers.set('__dev-mode__', this.config.get().devMode + '');
    options.headers.set('__ticket__', this.ticket);

    return this.http.requestWithError<T>(url, options, foundCacheCallback).then(result => {
      return result;
    }).catch(err => {
      if (err && ((_.isString(err) && err.toString() === ticket_expired) ||
        (_.isString(err.data) && err.data.toString() === ticket_expired))) {
        this.events.publish(ticket_expired);
      }
      return Promise.reject(err);
    });
  }
}