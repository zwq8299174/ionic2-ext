import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { StarRatingCmp } from './star-rating';

@NgModule({
  imports: [
    IonicModule
  ],
  exports: [
    StarRatingCmp
  ],
  declarations: [
    StarRatingCmp
  ]
})
export class StarRatingModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: StarRatingModule, providers: []
    };
  }
}