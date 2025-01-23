import {
  APP_ID,
  ApplicationConfig,
  importProvidersFrom,
  inject,
  Injector,
  provideAppInitializer,
  TransferState,
} from '@angular/core';
import { haAppRoutes } from './ha-app-routes';
import {
  FL_CAPTCHA_MODULE_CONFIG,
  FlCaptchaModule,
  FlCaptchaModuleConfig,
} from '@monorepo/front-core-lib/fl-captcha';
import { FlApiModule } from '@monorepo/front-core-lib/fl-api';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlHttpInterceptorService, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlLuxonDateAdapter, flLuxonDateFormat } from '@monorepo/front-core-lib/fl-core';
import { flMatFormFieldConfig, flSetRootInjector, flTooltipConfig } from '@monorepo/front-core-lib/fl-core';
import { FlPortalActionsModule } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { HaUserConfig } from './ha-core/ha-model/ha-config/ha-user-config.config';
import { HaApiServiceConfig } from './ha-core/ha-model/ha-config/ha-api-module.config';
import { HaApiErrorService } from './ha-core/ha-model/ha-config/ha-api-error.service';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { HaTdServiceConfig } from './ha-core/ha-model/ha-config/ha-td-service.config';
import { HaAuthService } from './ha-core/ha-service/ha-auth.service';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { haSvgIcons } from './ha-core/utils/ha-svg-icon-config';
import {
  RV_MODULE_CONFIG,
  RvResourceViewModule,
  RvResourceViewModuleBasicConfig,
} from '@monorepo/resource-view';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { HaCoServiceConfig } from './ha-core/ha-model/ha-config/ha-co-service.config';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HaHttpInterceptorSsrService } from './ha-core/ha-service/ha-http-interceptor-ssr.service';
import { HaAuthenticatedUserService } from './ha-core/ha-service/ha-authenticated-user.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HaEnvironmentHelper } from './ha-core/ha-model/ha-config/ha-environment.helper';
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from '@angular/router';

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

function initRootInjector(injector: Injector): () => void {
  return (): void => flSetRootInjector(injector);
}

export const haAppConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      haAppRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withRouterConfig({ paramsInheritanceStrategy: 'always', onSameUrlNavigation: 'reload' })
    ),
    importProvidersFrom(
      FlUserModule.forRoot(HaUserConfig),
      FlApiModule.forRoot(HaApiServiceConfig, HaApiErrorService),
      TdTechnicalDocModule.forRoot(HaTdServiceConfig),
      FlAuthModule.forRoot(HaAuthService),
      // Setup translate module
      FlTranslateModule.forRoot({
        defaultLang: ClSupportedLanguage.en,
        availableLang: [ClSupportedLanguage.en, ClSupportedLanguage.fr],
        filenames: ['global-'],
      }),
      FlTranslateModule.forRoot2(),
      FlSnackBarModule.forRoot(),
      FlDialogModule.forRoot(),
      FlPortalModule.forRoot(),
      FlPortalActionsModule.forRoot(),
      FlCaptchaModule,
      FlIconModule.forRoot({
        iconFolder: 'assets/fl-mat-icons/',
        iconsToRegister: haSvgIcons,
      }),
      RvResourceViewModule,
      CoCommunityLibModule.forRoot(HaCoServiceConfig)
    ),
    TransferState,
    {
      provide: APP_ID,
      useValue: 'serverApp',
    },
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
    provideAppInitializer(() => {
      const initializerFn = loadUserOnInit(inject(HaAuthenticatedUserService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = loadThemeOnInit(inject(FlThemeService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = initRootInjector(inject(Injector));
      return initializerFn();
    }),
    { provide: FL_CAPTCHA_MODULE_CONFIG, useFactory: configureCaptcha },
    { provide: RV_MODULE_CONFIG, useClass: RvResourceViewModuleBasicConfig },

    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    // form field default config
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: flMatFormFieldConfig },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: flTooltipConfig },
    // configure the date picker to work with luxon
    { provide: DateAdapter, useExisting: FlLuxonDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: flLuxonDateFormat },
    provideAnimations(),
  ],
};
