import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AutoCompleteCmp } from './auto-complete';
import { BaiduPlacesProvider } from './baidu-places.provider';
import { AutoCompleteModalCmp } from './auto-complete-modal';

export { BaiduPlacesProvider } from './baidu-places.provider';

@NgModule({
  imports: [
    IonicModule
  ],
  exports: [
    AutoCompleteCmp,
    AutoCompleteModalCmp
  ],
  declarations: [
    AutoCompleteCmp,
    AutoCompleteModalCmp
  ],
  entryComponents: [
    AutoCompleteModalCmp
  ]
})
export class AutoCompleteModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AutoCompleteModule,
      providers: [
        BaiduPlacesProvider
      ]
    };
  }
}