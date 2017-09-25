import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Entry, File, Metadata } from '@ionic-native/file';
import { isPresent } from '../../utils/util';
import { LoadOptions, RemoveOptions, SaveOptions, Storage } from './storage';
import { MemoryStorage } from './mem-storage';

@Injectable()
export class TextFileStorage implements Storage {
  constructor(protected platform: Platform, protected file: File, protected memoryStorage: MemoryStorage) { }

  save(options: SaveOptions): Promise<any> {
    if (!isPresent(options.content)) {
      return Promise.reject('content is not present');
    }
    if (this.platform.is('cordova')) {
      return this.writeToFile(options);
    }
    return this.memoryStorage.save(options);
  }

  load<T>(options: LoadOptions): Promise<T> {
    if (this.platform.is('cordova')) {
      if (!options.maxAge) {
        return this.readFile<T>(options);
      }

      return this.file.resolveLocalFilesystemUrl(
        this.getFilepath(options.dirname) + '/' + options.filename
      ).then(fileEntry => {
        return this.getMetadata(fileEntry);
      }).then((metadata) => {
        if (metadata && (Date.now() - metadata.modificationTime.getTime()) > options.maxAge) {
          return this.removeFile(options).catch(() => { });
        }
      }).then(() => {
        return this.readFile<T>(options);
      }).catch(error => {
        return Promise.reject(error);
      });
    }

    return this.memoryStorage.load<T>(options);
  }

  remove(options: RemoveOptions): Promise<any> {
    if (this.platform.is('cordova')) {
      return this.removeFile(options);
    }
    return this.memoryStorage.remove(options);
  }

  protected serialize(content: any): string {
    return content;
  }

  protected deserialize(content: string): any {
    return content;
  }

  private writeToFile(options: SaveOptions): Promise<any> {
    const write = (options: SaveOptions): Promise<any> => {
      return this.file.writeFile(
        this.getFilepath(options.dirname),
        options.filename,
        this.serialize(options.content),
        { replace: true }
      ).then(value => {
        return value;
      }).catch(reason => {
        return Promise.reject(reason);
      });
    };

    if (options.dirname) {
      return this.createCacheDirectory(options.dirname).then(() => {
        return write(options);
      }).catch(reason => {
        return Promise.reject(reason);
      });
    }

    return write(options);
  }

  private readFile<T>(options: LoadOptions): Promise<T> {
    return this.file.readAsText(this.getFilepath(options.dirname), options.filename).then(value => {
      return this.deserialize(<string>value);
    }).catch(reason => {
      return Promise.reject(reason);
    });
  }

  private removeFile(options: RemoveOptions): Promise<any> {
    return this.file.removeFile(this.getFilepath(options.dirname), options.filename).then(value => {
      return value;
    }).catch(reason => {
      return Promise.reject(reason);
    });
  }

  private getMetadata(fileEntry: Entry): Promise<Metadata> {
    return new Promise<Metadata>((resolve) => {
      fileEntry.getMetadata(metadata => {
        resolve(metadata);
      }, () => resolve());
    });
  }

  private createCacheDirectory(dirname: string): Promise<any> {
    return this.file.checkDir(this.getRootpath(), dirname).catch(() => {
      return this.file.createDir(this.getRootpath(), dirname, false);
    });
  }

  private getRootpath(): string {
    return this.file.dataDirectory;
  }

  private getFilepath(dirname?: string): string {
    if (!dirname) {
      return this.getRootpath();
    }

    return this.getRootpath() + dirname;
  }
}