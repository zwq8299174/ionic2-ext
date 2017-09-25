import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { NavButtonBar } from './nav-button-bar';

export { NavButton } from './nav-button-bar';

@NgModule({
  imports: [
    IonicModule
  ],
  exports: [
    NavButtonBar
  ],
  declarations: [
    NavButtonBar
  ]
})
export class NavButtonBarModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NavButtonBarModule, providers: []
    };
  }
}