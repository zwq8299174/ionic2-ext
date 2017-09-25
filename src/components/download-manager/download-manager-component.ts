import { Component, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DownloadEvent, DownloadManagerController } from './download-manager';
import { DirectoryEntry, DirectoryReader, Entry, File } from '@ionic-native/file';
import * as _ from 'lodash';
import { isPresent } from '../../utils/util';

export interface DownloadManager {
  downloadingList: Array<DownloadEvent>;
  fileList: Array<Entry>;
}

@Component({
  selector: 'page-download-file',
  styles: [`
    .breadcrumb{
      display: flex;
      flex-direction: row;
      list-style:none;
      padding-left: 10px;
    }
    .breadcrumb ion-icon{
      padding-left: 5px;
      padding-right: 5px;
      font-size: 1em;
    }
  `],
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>文件下载</ion-title>
      </ion-navbar>
      <ion-segment [(ngModel)]="segmentValue">
        <ion-segment-button value="downloading">正在下载</ion-segment-button>
        <ion-segment-button value="history">下载历史</ion-segment-button>
      </ion-segment>
    </ion-header>
    <ion-content>
      <div [ngSwitch]="segmentValue">
        <ion-list *ngSwitchCase="'downloading'">
          <ion-item *ngFor="let item of downloadManager.downloadingList">
            <div>{{item.fileName}}({{item.progress}}%)</div>
            <div>
              <progress value="{{item.progress}}" max="100"></progress>
            </div>
          </ion-item>
        </ion-list>
        <ion-list *ngSwitchCase="'history'">
          <ul class="breadcrumb">
            <li *ngFor="let item of breadcrumbs; let last = last" tappable (click)="breadcrubCheck(item)">
              <a>{{item.name}}</a><ion-icon *ngIf="!last" name="ios-arrow-forward-outline"></ion-icon>
            </li>
          </ul>
          <ion-item-divider *ngFor="let item of downloadManager.fileList" tappable (click)="itemCheck(item)">
            <ion-icon name="{{item.isFile ? 'document': 'folder'}}" item-left></ion-icon>
            {{item.name}}
            <ion-icon *ngIf="!last" name="ios-arrow-forward-outline" item-right></ion-icon>
          </ion-item-divider>
        </ion-list>
      </div>
    </ion-content>
  `
})
export class DownloadManagerCmp implements OnInit, OnDestroy, OnChanges {
  downloadManager: DownloadManager;
  breadcrumbs: Array<DirectoryEntry>;
  segmentValue: string = 'downloading';
  private destroy: boolean;

  constructor(
    private downloadManagerCtl: DownloadManagerController,
    private file: File,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.destroy = false;
    this.downloadManager = { downloadingList: [], fileList: [] };
    this.subscribe();
    this.breadcrumbs = [];
    this.loadFileList(this.downloadManagerCtl.downloadDirectory, true);
  }

  ngOnDestroy(): void {
    this.destroy = true;
  }

  subscribe() {
    this.downloadManagerCtl.event.subscribe((event: DownloadEvent) => {
      if (this.destroy) return;
      this.update(event);
    });
  }

  update(event: DownloadEvent) {
    let file: DownloadEvent = _.find(this.downloadManager.downloadingList,
      { fileName: event.fileName, filePath: event.filePath });
    if (isPresent(file)) {
      if (file.progress === 100) {
        file.progress = 0;
      }
      if (event.progress > file.progress) {
        file.progress = event.progress;
      }
      return;
    }
    this.downloadManager.downloadingList.push(event);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  loadFileList(directoryPath: string, push: boolean) {
    this.file.resolveDirectoryUrl(directoryPath).then(directory => {
      if (push) {
        this.breadcrumbs.push(directory);
      }
      let reader: DirectoryReader = directory.createReader();
      this.downloadManager.fileList.length = 0;
      reader.readEntries(entries => {
        this.ngZone.run(() => {
          entries.forEach(e => {
            this.downloadManager.fileList.push(e);
          });
        });
      });
    });
  }

  itemCheck(entry: Entry) {
    if (entry.isDirectory) {
      this.loadFileList(entry.nativeURL, true);
    }
  }

  breadcrubCheck(entry: DirectoryEntry) {
    let index = _.findIndex(this.breadcrumbs, { fullPath: entry.fullPath });
    if (this.breadcrumbs.length - 1 !== index) {
      this.breadcrumbs.length = index + 1;
    }
    this.loadFileList(entry.nativeURL, false);
  }
}
