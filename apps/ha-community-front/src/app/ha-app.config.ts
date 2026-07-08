import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  APP_ID,
  ApplicationConfig,
  importProvidersFrom,
  inject,
  Injector,
  provideAppInitializer,
  TransferState,
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import {
  BrowserModule,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlApiModule } from '@monorepo/front-core-lib/fl-api';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { FL_CAPTCHA_MODULE_CONFIG, FlCaptchaModuleConfig } from '@monorepo/front-core-lib/fl-captcha';
import {
  FL_LUXON_DATE_FORMAT,
  FL_MAT_FORM_FIELD_CONFIG,
  flSetRootInjector,
  FL_TOOLTIP_CONFIG,
} from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalActionsModule } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlHttpInterceptorService, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { RV_MODULE_CONFIG, RvResourceViewModuleBasicConfig } from '@monorepo/resource-view';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

import { haAppRoutes } from './ha-app-routes';
import { HaApiErrorService } from './ha-core/ha-model/ha-config/ha-api-error.service';
import { HaApiServiceConfig } from './ha-core/ha-model/ha-config/ha-api-module.config';
import { HaCoServiceConfig } from './ha-core/ha-model/ha-config/ha-co-service.config';
import { HaEnvironmentHelper } from './ha-core/ha-model/ha-config/ha-environment.helper';
import { HaTdServiceConfig } from './ha-core/ha-model/ha-config/ha-td-service.config';
import { HaUserConfig } from './ha-core/ha-model/ha-config/ha-user-config.config';
import { HaAuthService } from './ha-core/ha-service/ha-auth.service';
import { HaAuthenticatedUserService } from './ha-core/ha-service/ha-authenticated-user.service';
import { HaHttpInterceptorSsrService } from './ha-core/ha-service/ha-http-interceptor-ssr.service';
import { HA_SVG_ICONS } from './ha-core/utils/ha-svg-icon-config';

function loadUserOnInit(authenticatedUserService: HaAuthenticatedUserService): () => void {
  return (): void => authenticatedUserService.init();
}

function loadThemeOnInit(themeService: FlThemeService): () => void {
  return (): void => themeService.init();
}

function configureCaptcha(): FlCaptchaModuleConfig {
  return {
    siteKey: HaEnvironmentHelper.getRecaptchaSiteKey(),
    isLocal: !HaEnvironmentHelper.isProduction(),
  };
}

function initRootInjector(injector: Injector): void {
  return flSetRootInjector(injector);
}

/**
 * Root application configuration.
 *
 * Key architectural decisions:
 * - SSR support: provideClientHydration + TransferState ensure data fetched on the server
 *   is reused on the client without duplicate API calls (see HaBrickPageState for usage).
 * - Two HTTP interceptors: FlHttpInterceptorService (adds auth/lang headers) and
 *   HaHttpInterceptorSsrService (rewrites relative URLs to absolute for SSR).
 * - provideAppInitializer hooks run at startup: load theme, set root injector, fetch authenticated user.
 * - Library modules (Fl*, Co*, Td*) are configured via forRoot() with app-specific config classes
 *   (e.g. HaApiServiceConfig provides the API base URL to FlApiModule).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const haAppConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      haAppRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withRouterConfig({ paramsInheritanceStrategy: 'always', onSameUrlNavigation: 'reload' })
    ),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
    importProvidersFrom(
      BrowserModule,
      FlApiModule.forRoot(HaApiServiceConfig, HaApiErrorService),
      FlAuthModule.forRoot(HaAuthService),
      // Setup translate module
      FlTranslateModule.forRoot({
        defaultLang: ClSupportedLanguage.en,
        availableLang: [ClSupportedLanguage.en, ClSupportedLanguage.fr],
        filenames: ['global-'],
      }),
      FlTranslateModule.forRoot2(true),
      FlSnackBarModule.forRoot(),
      FlDialogModule.forRoot(),
      FlPortalModule.forRoot(),
      FlPortalActionsModule.forRoot(),
      FlIconModule.forRoot({
        iconFolder: 'assets/fl-mat-icons/',
        iconsToRegister: HA_SVG_ICONS,
      }),
      FlUserModule.forRoot(HaUserConfig),
      TdTechnicalDocModule.forRoot(HaTdServiceConfig),
      CoCommunityLibModule.forRoot(HaCoServiceConfig)
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FlHttpInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HaHttpInterceptorSsrService,
      multi: true,
    },
    TransferState,
    {
      provide: APP_ID,
      useValue: 'serverApp',
    },
    provideAppInitializer(() => {
      loadThemeOnInit(inject(FlThemeService));
    }),
    provideAppInitializer(() => {
      initRootInjector(inject(Injector));
    }),
    { provide: FL_CAPTCHA_MODULE_CONFIG, useFactory: configureCaptcha },
    { provide: RV_MODULE_CONFIG, useClass: RvResourceViewModuleBasicConfig },
    provideAnimations(),
    provideAppInitializer(() => {
      const initializerFn = loadUserOnInit(inject(HaAuthenticatedUserService));
      return initializerFn();
    }),

    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    // form field default config
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: FL_MAT_FORM_FIELD_CONFIG },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: FL_TOOLTIP_CONFIG },
    // configure the date picker to work with luxon
    { provide: DateAdapter, useClass: LuxonDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: FL_LUXON_DATE_FORMAT },
  ],
};
