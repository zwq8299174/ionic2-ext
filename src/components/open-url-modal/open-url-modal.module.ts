import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { OpenUrlModalCmp } from './open-url-modal-component';
import { OpenUrlModalController } from './open-url-modal';
import { PipesModule } from '../../pipes/pipes.module';

export { OpenUrlModalController } from './open-url-modal';

@NgModule({
  imports: [
    IonicModule,
    PipesModule
  ],
  declarations: [
    OpenUrlModalCmp
  ],
  exports: [
    OpenUrlModalCmp
  ],
  entryComponents: [
    OpenUrlModalCmp
  ]
})
export class OpenUrlModalModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: OpenUrlModalModule,
      providers: [
        OpenUrlModalController
      ]
    };
  }
}