import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { OpenUrlModalOptions } from './open-url-modal-options';

@Component({
  template: `
    <ion-header>
      <ion-navbar [color]="options.color">
        <ion-buttons end>
          <button ion-button icon-only (click)="dismiss()">
            <ion-icon name="close"></ion-icon>
          </button>
        </ion-buttons>
        <ion-title>{{options.title}}</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content class="content">
      <iframe class="iframe" [src]="options.url | trustResourceUrl"
              sandbox="allow-scripts allow-top-navigation allow-pointer-lock allow-same-origin allow-popups allow-forms">
      </iframe>
    </ion-content>
  `,
  styles: [`
    .scroll-content {
      overflow: hidden;
    }

    .content {
      height: 100%;
    }

    .iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  `]
})
export class OpenUrlModalCmp {
  options: OpenUrlModalOptions;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.options = this.navParams.get('openUrlModalOptions');
    window.addEventListener('message', this.options.onmessage, false);
  }

  dismiss() {
    this.viewCtrl.dismiss(this.options).catch(() => { });
  }
}