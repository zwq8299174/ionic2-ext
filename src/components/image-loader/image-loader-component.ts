import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer } from '@angular/core';
import { isTrueProperty } from '../../utils/util';

import { ImageLoaderController } from './image-loader';
import { ConfigProvider } from '../../config/config';

const propMap: any = {
  display: 'display',
  height: 'height',
  width: 'width',
  backgroundSize: 'background-size',
  backgroundRepeat: 'background-repeat'
};

@Component({
  selector: 'ion-image-loader',
  template: `
    <ion-spinner *ngIf="spinner && isLoading && !fallbackAsPlaceholder" [name]="spinnerName" [color]="spinnerColor"></ion-spinner>
    <ng-content></ng-content>
  `,
  styles: [`
    ion-spinner {
      float: none;
      display: block;
      margin: auto;
    }
  `]
})
export class ImageLoaderCmp implements OnInit {
  private _src: string;

  @Input()
  set src(imageUrl: string) {
    this._src = this.processImageUrl(imageUrl);
    this.updateImage(this._src);
  }

  get src(): string {
    return this._src;
  }

  @Input() cache: boolean = true;
  @Input('fallback') fallbackUrl: string = this.config.get().imageLoader.fallbackUrl;
  @Input() spinner: boolean = this.config.get().imageLoader.spinnerEnabled;
  @Input() fallbackAsPlaceholder: boolean = this.config.get().imageLoader.fallbackAsPlaceholder;
  @Input() useImg: boolean = this.config.get().imageLoader.useImg;
  @Input() width: string = this.config.get().imageLoader.width;
  @Input() height: string = this.config.get().imageLoader.height;
  @Input() display: string = this.config.get().imageLoader.display;
  @Input() backgroundSize: string = this.config.get().imageLoader.backgroundSize;
  @Input() backgroundRepeat: string = this.config.get().imageLoader.backgroundRepeat;
  @Input() spinnerName: string = this.config.get().imageLoader.spinnerName;
  @Input() spinnerColor: string = this.config.get().imageLoader.spinnerColor;

  @Output()
  load: EventEmitter<ImageLoaderCmp> = new EventEmitter<ImageLoaderCmp>();

  isLoading: boolean = true;

  private element: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer,
    private imageLoader: ImageLoaderController,
    private config: ConfigProvider
  ) { }

  ngOnInit(): void {
    this.useImg = isTrueProperty(this.useImg);
    this.cache = isTrueProperty(this.cache);
    this.fallbackAsPlaceholder = isTrueProperty(this.fallbackAsPlaceholder);

    if (this.fallbackAsPlaceholder && this.fallbackUrl) {
      this.setImage(this.fallbackUrl, false);
    }

    if (!this.src) {
      if (!this.fallbackAsPlaceholder && this.fallbackUrl) {
        this.setImage(this.fallbackUrl);
        return;
      }
      this.isLoading = false;
    }
  }

  private processImageUrl(imageUrl: string): string {
    if (this.cache === false) {
      if (imageUrl.indexOf('?') === -1) {
        imageUrl += '?';
      }

      if (['&', '?'].indexOf(imageUrl.charAt(imageUrl.length)) === -1) {
        imageUrl += '&';
      }

      imageUrl += 'cache_buster=' + Date.now();
    }

    return imageUrl;
  }

  private updateImage(imageUrl: string) {
    this.imageLoader.getImagePath(imageUrl).then((imageUrl: string) => this.setImage(imageUrl))
      .catch(() => this.setImage(this.fallbackUrl || imageUrl));
  }

  private setImage(imageUrl: string, stopLoading: boolean = true): void {
    this.isLoading = !stopLoading;

    if (this.useImg) {
      if (!this.element) {
        this.element = this.renderer.createElement(this.elementRef.nativeElement, 'img');
      }
      if (this.fallbackUrl && !this.imageLoader.nativeAvailable) {
        this.renderer.listen(this.element, 'error', () => {
          this.imageLoader.removeCacheFile(imageUrl);
          this.renderer.setElementAttribute(this.element, 'src', this.fallbackUrl);
        });
      }
      this.renderer.setElementAttribute(this.element, 'src', imageUrl);
    } else {
      this.element = this.elementRef.nativeElement;

      for (let prop in propMap) {
        if (this[prop]) {
          this.renderer.setElementStyle(this.element, propMap[prop], this[prop]);
        }
      }

      this.renderer.setElementStyle(this.element, 'background-image', 'url(\'' + (imageUrl || this.fallbackUrl) + '\')');
    }
    this.load.emit(this);
  }
}