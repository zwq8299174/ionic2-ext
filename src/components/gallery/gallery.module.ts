import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Gallery } from './gallery';
import { ImageLoaderModule } from '../image-loader/image-loader.module';

export { GalleryOptions } from './gallery';

@NgModule({
  imports: [
    CommonModule,
    ImageLoaderModule.forRoot()
  ],
  exports: [
    Gallery
  ],
  declarations: [
    Gallery
  ]
})
export class GalleryModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: GalleryModule, providers: []
    };
  }
}