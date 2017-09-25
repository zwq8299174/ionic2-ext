import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { File, FileEntry } from '@ionic-native/file';

import { CorsHttpProvider } from './http';

export interface FileUploderOptions {
  dir: string;
  notemp?: boolean;
  size?: number;
}

@Injectable()
export class FileUploder {
  constructor(private http: CorsHttpProvider, private file: File) { }

  upload(url: string, files: Array<string>, options: FileUploderOptions): Promise<Array<string>> {
    return this.formData(files, options).then(formData => {
      return this.http.request<Array<string>>(url, { method: RequestMethod.Post, body: formData });
    }).catch(e => Promise.reject(e));
  }

  private formData(files: Array<string>, options: FileUploderOptions): Promise<FormData> {
    if (files.length === 0) {
      return Promise.reject('没有要上传的文件');
    }

    let formData = new FormData();
    for (let key in options) {
      formData.append(key, options[key]);
    }

    return new Promise<FormData>((resolve, reject) => {
      this.readFiles(files).then(result => {
        result.forEach(file => {
          formData.append('file', file.blob, file.name);
        });
        resolve(formData);
      }).catch(e => reject(e));
    });
  }

  private readFiles(filepaths: Array<string> = []): Promise<Array<{ blob: Blob, name: string }>> {
    let promises = [];
    filepaths.forEach(filepath => {
      if (!filepath.startsWith('file://')) {
        filepath = 'file://' + filepath;
      }

      promises.push(this.readFile(filepath));
    });

    return Promise.all(promises);
  }

  private readFile(filepath: string): Promise<{ blob: Blob, name: string }> {
    return new Promise<{ blob: Blob, name: string }>((resolve, reject) => {
      this.file.resolveLocalFilesystemUrl(filepath).then(entry => {
        (<FileEntry>entry).file(file => {
          const reader = new FileReader();
          reader.onerror = (e) => {
            reject(e);
          };
          reader.onloadend = () => {
            const blob = new Blob([reader.result], { type: file.type });
            resolve({ blob: blob, name: file.name });
          };
          reader.readAsArrayBuffer(file);
        });
      }).catch(e => reject(e));
    });
  }
}