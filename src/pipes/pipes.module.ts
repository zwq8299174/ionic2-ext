import { ModuleWithProviders, NgModule } from '@angular/core';
import { MapToIterable } from './map-to-iterable';
import { OrderBy } from './order-by';
import { TrustResourceUrl } from './bypass-trust-res-url';
import { TrustMcpUrl } from './bypass-mcp-trust-url';

export { MapToIterable } from './map-to-iterable';
export { OrderBy } from './order-by';
export { TrustResourceUrl } from './bypass-trust-res-url';
export { TrustMcpUrl } from './bypass-mcp-trust-url';

@NgModule({
  exports: [
    MapToIterable,
    OrderBy,
    TrustResourceUrl,
    TrustMcpUrl
  ],
  declarations: [
    MapToIterable,
    OrderBy,
    TrustResourceUrl,
    TrustMcpUrl
  ]
})
export class PipesModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: PipesModule,
      providers: [
        MapToIterable,
        OrderBy,
        TrustResourceUrl,
        TrustMcpUrl
      ]
    };
  }
}