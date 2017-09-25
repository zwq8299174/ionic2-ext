import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import { HotCodePush } from '../native/hot-code-push';
import { ConfigProvider } from '../config/config';
import { Dialog } from '../utils/dialog';
import { ExtLocalNotifications } from '../native/local-notifications';

@Injectable()
export class HotUpdater {
  constructor(
    private platform: Platform,
    private dialog: Dialog,
    private config: ConfigProvider,
    private hotCodePush: HotCodePush,
    private localNotifications: ExtLocalNotifications,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener
  ) { }

  start() {
    this.hotCodePush.isUpdateAvailableForInstallation((error) => {
      if (!error) {
        this.hotCodePush.installUpdate().then(error => {
          console.log(error);
        });
        return;
      }
      this.hotCodePush.fetchUpdate((error) => {
        if (!error) {
          this.dialog.confirm('更新通知', '新版本更新成功,是否现在重启应用?', () => {
            this.hotCodePush.installUpdate().then(e => {
              console.log(e);
            });
          });
          return;
        }
        if (error.code === HotCodePush.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
          this.updateApp();
          return;
        }
        console.log(error);
      });
    });
  }

  updateApp() {
    if (!this.config.get().hotUpdateUrl) {
      return;
    }
    this.dialog.confirm('更新通知', '发现新版本,是否现在更新?', () => {
      if (this.platform.is('ios')) {
        this.updateIos();
        return;
      }
      this.updateAndroid();
    });
  }

  updateIos() {
    window.location.href = this.config.get().hotUpdateUrl.ios;
  }

  updateAndroid() {
    var targetPath = this.file.externalApplicationStorageDirectory + '/app/app.apk';
    this.localNotifications.schedule({
      id: 1000,
      title: '正在更新...',
      progress: true,
      maxProgress: 100,
      currentProgress: 0
    });
    let transfer = this.transfer.create();
    transfer.onProgress(event => {
      let progress = ((event.loaded / event.total) * 100).toFixed(2);
      this.localNotifications.update({
        id: 1000,
        title: '正在更新...',
        progress: true,
        maxProgress: 100,
        currentProgress: Math.round(Number(progress))
      });
    });
    transfer.download(this.config.get().hotUpdateUrl.android, targetPath).then(() => {
      this.localNotifications.clear(1000);
      this.dialog.confirm('更新通知', '新版本下载完成是否现在安装?', () => {
        this.fileOpener.open(targetPath, 'application/vnd.android.package-archive');
      });
    }, e => {
      console.log(e);
    });
  }
}