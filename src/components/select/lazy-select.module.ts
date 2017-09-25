import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LazySelect } from './lazy-select';

@NgModule({
  imports: [
    IonicModule
  ],
  exports: [
    LazySelect
  ],
  declarations: [
    LazySelect
  ]
})
export class LazySelectModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LazySelectModule, providers: []
    };
  }
}