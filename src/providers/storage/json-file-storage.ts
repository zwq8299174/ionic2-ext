import { TextFileStorage } from './file-storage';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { MemoryStorage } from './mem-storage';

@Injectable()
export class JsonFileStorage extends TextFileStorage {
  constructor(protected platform: Platform, protected file: File, protected memoryStorage: MemoryStorage) {
    super(platform, file, memoryStorage);
  }

  protected serialize(content: any): string {
    return JSON.stringify(content);
  }

  protected deserialize(content: string): any {
    return JSON.parse(content);
  }
}
