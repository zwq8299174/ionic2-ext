import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Ribbon } from './ribbon';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    Ribbon
  ],
  declarations: [
    Ribbon
  ]
})
export class RibbonModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: RibbonModule, providers: []
    };
  }
}