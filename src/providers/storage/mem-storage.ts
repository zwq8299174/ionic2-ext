import { Injectable } from '@angular/core';
import { LoadOptions, RemoveOptions, SaveOptions, Storage } from './storage';
import { isPresent } from '../../utils/util';

@Injectable()
export class MemoryStorage implements Storage {
  private localStorage: any = {};

  save(options: SaveOptions): Promise<any> {
    if (!isPresent(options.content)) {
      return Promise.reject('content is not present');
    }
    this.localStorage[this.getKey(options.filename, options.dirname)] = options.content;
    return Promise.resolve();
  }

  load<T>(options: LoadOptions): Promise<T> {
    let content = this.localStorage[this.getKey(options.filename, options.dirname)];
    if (!content) {
      return Promise.reject('file not found.');
    }
    return Promise.resolve(content);
  }

  remove(options: RemoveOptions): Promise<any> {
    delete this.localStorage[this.getKey(options.filename, options.dirname)];
    return Promise.resolve<any>({ success: true });
  }

  private getKey(filename: string, dirname: string): string {
    return (dirname ? dirname : '') + '_' + filename;
  }
}