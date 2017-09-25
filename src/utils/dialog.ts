import { Injectable } from '@angular/core';
import { AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class Dialog {
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  alert(title: string, message: string): void {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['确定']
    });
    alert.present();
  }

  confirm(title: string, message: string, handler: (value: any) => boolean | void) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: '取消',
        role: 'cancel'
      }, {
        text: '确定',
        handler: handler
      }]
    });
    alert.present();
  }

  loading(content: string): Loading {
    return this.loadingCtrl.create({
      content: content
    });
  }

  toast(message: string, position: string = 'top') {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position
    });
    toast.present();
  }
}