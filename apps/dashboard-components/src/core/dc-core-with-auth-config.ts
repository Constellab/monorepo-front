import { FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { dcCoreConfig } from './dc-core-config';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DcHttpInterceptorService } from './service/dc-http-interceptor.service';
import { FlApiModule } from '@monorepo/front-core-lib/fl-api';
import { DcApiServiceConfig } from './service/dc-api-module.config';
import { DcApiErrorService } from './service/dc-api-error.service';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';

/**
 * Dc config for components that supports auth and request to lab api
 */
export function dcCoreWithAuthConfig(translations: FlTranslateObject): ApplicationConfig {
  const appConfig = dcCoreConfig(translations);

  appConfig.providers.push(
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DcHttpInterceptorService,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),

    importProvidersFrom(
      FlApiModule.forRoot(DcApiServiceConfig, DcApiErrorService),
      FlDialogModule.forRoot(),
      FlSnackBarModule.forRoot(),
    )
  );
  return appConfig;
}
