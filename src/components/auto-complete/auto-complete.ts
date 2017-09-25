import { Component, ElementRef, Input, Optional, Renderer, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInput } from 'ionic-angular/util/base-input';
import { Config, Form, Item, Modal, ModalController } from 'ionic-angular';
import * as _ from 'lodash';
import { AutoCompleteModalCmp } from './auto-complete-modal';

export interface AutoCompleteDataProvider {
  init(params: any): Promise<any>;
  loadItems(params: any): Promise<Array<any>>;
}

@Component({
  selector: 'ion-auto-complete',
  template: `
    <ion-input
      type="text"
      (tap)="showModal()"
      [(ngModel)]="keyword"
      [placeholder]="placeholder">
    </ion-input>
    <ion-icon *ngIf="showClear" item-end name="close" style="color: darkgray;" (tap)="clear()"></ion-icon>
    <ion-icon *ngIf="icon" item-end [name]="icon" [style.color]="iconColor"></ion-icon>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AutoCompleteCmp,
    multi: true
  }]
})
export class AutoCompleteCmp extends BaseInput<any> {
  @Input() dataProvider: AutoCompleteDataProvider;
  @Input() minChar: number = 2;
  @Input() placeholder: string = '';
  @Input() valueField: string = '';
  @Input() textField: string = '';
  @Input() providerParams: any = {};
  @Input() template: TemplateRef<any>;
  @Input() icon: string = '';
  @Input() iconColor: string = 'dodgerblue';
  @Input() showClear: boolean = false;

  keyword: string = '';

  private _modal: Modal;
  private isInit = true;

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    form: Form,
    @Optional() item: Item,
    private modalCtrl: ModalController
  ) {
    super(config, elementRef, renderer, 'auto-complete', '', form, item, null);
  }

  clear() {
    this.keyword = '';
    this.value = null;
  }

  showModal() {
    this._modal = this.modalCtrl.create(AutoCompleteModalCmp, {
      options: {
        dataProvider: this.dataProvider,
        keyword: this.keyword,
        minChar: this.minChar,
        placeholder: this.placeholder,
        providerParams: this.providerParams,
        template: this.template
      }
    });
    this._modal.onDidDismiss(item => {
      if (!item) {
        return;
      }

      if (_.isObject(item)) {
        if (this.textField) {
          this.keyword = <string>_.get(item, this.textField);
        }
        if (this.valueField) {
          this.value = _.get(item, this.valueField);
        }
        return;
      }

      this.keyword = item;
      this.value = item;
    });
    this._modal.present();
  }

  _inputUpdated() {
    super._inputUpdated();

    if (!this.value || !this.isInit) {
      return;
    }

    this.isInit = false;

    this.dataProvider.init({
      initValue: this.value,
      ...this.providerParams
    }).then(result => {
      this.keyword = result;
    }).catch(e => console.log(e));
  }
}