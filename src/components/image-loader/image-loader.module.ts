import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ImageLoaderCmp } from './image-loader-component';
import { ImageLoaderController } from './image-loader';

export { ImageLoaderController } from './image-loader';

@NgModule({
  imports: [
    IonicModule
  ],
  exports: [
    ImageLoaderCmp
  ],
  declarations: [
    ImageLoaderCmp
  ]
})
export class ImageLoaderModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ImageLoaderModule,
      providers: [
        ImageLoaderController
      ]
    };
  }
}