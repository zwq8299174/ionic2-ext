import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { NavParams, Searchbar, ViewController } from 'ionic-angular';
import { AutoCompleteDataProvider } from './auto-complete';

export interface AutoCompleteModalOptions {
  dataProvider: AutoCompleteDataProvider;
  template: TemplateRef<any>;
  minChar: number;
  placeholder: string;
  providerParams: any;
  keyword: string;
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons left>
          <button ion-button icon-only (click)="dismiss()">
          <ion-icon name="arrow-back"></ion-icon>
          </button>
        </ion-buttons>
        <ion-searchbar type="text"
                       cancelButtonText="清除"
                       (ionFocus)="selectText($event)"
                       (ionChange)="getItems()"
                       [(ngModel)]="options.keyword"
                       [placeholder]="options.placeholder">
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item *ngFor="let item of items" (click)="dismiss(item)">
          <ng-template [ngTemplateOutlet]="options.template" [ngOutletContext]="{'item': item}"></ng-template>
        </ion-item>
      </ion-list>
    </ion-content>
   `
})
export class AutoCompleteModalCmp implements AfterViewInit {
  @ViewChild(Searchbar)
  private searchbar: Searchbar;

  items: Array<any> = [];
  options: AutoCompleteModalOptions;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.options = this.navParams.get('options');
    if (this.options.keyword) {
      this.getItems();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.searchbar.setFocus(); }, 500);
  }

  selectText($event) {
    $event._searchbarInput.nativeElement.select();
  }

  dismiss(item) {
    this.viewCtrl.dismiss(item).catch(() => { });
  }

  getItems() {
    if (this.options.keyword.length < this.options.minChar) {
      return;
    }

    this.options.dataProvider.loadItems({
      keyword: this.options.keyword,
      ...this.options.providerParams
    }).then(result => {
      this.items = result;
    }).catch(e => console.log(e));
  }
}