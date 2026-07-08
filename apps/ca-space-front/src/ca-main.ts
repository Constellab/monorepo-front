import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  enableProdMode,
  importProvidersFrom,
  inject,
  Injector,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import { BnBioNetworkModule } from '@monorepo/bio-network';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlApiModule } from '@monorepo/front-core-lib/fl-api';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { FL_CAPTCHA_MODULE_CONFIG, FlCaptchaModuleConfig } from '@monorepo/front-core-lib/fl-captcha';
import {
  FL_LUXON_DATE_FORMAT,
  FL_MAT_FORM_FIELD_CONFIG,
  FL_TOOLTIP_CONFIG,
  flLoadEnvironmentFromAssets,
  flSetRootInjector,
} from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalActionsModule } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlHttpInterceptorService, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { PrProtocolModule } from '@monorepo/protocol';
import { RV_MODULE_CONFIG, RvResourceViewModuleBasicConfig } from '@monorepo/resource-view';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { TeFixInit } from '@monorepo/text-editor';
import { CookieService } from 'ngx-cookie-service';

import { CaAppComponent } from './app/ca-app.component';
import { CA_APP_ROUTES } from './app/ca-app-routes';
import { CaSpaceInterceptor } from './app/ca-core/interceptor/ca-space-interceptor.service';
import { CaApiServiceConfig } from './app/ca-core/model/config/ca-api-module.config';
import { CaCommunityLibConfigService } from './app/ca-core/model/config/ca-community-lib-config.service';
import { CA_SVG_ICONS } from './app/ca-core/model/config/ca-svg-icon-config';
import { CaTdServiceConfig } from './app/ca-core/model/config/ca-td-service.config';
import { CaUserConfig } from './app/ca-core/model/config/ca-user-config.service';
import { CaApiErrorService } from './app/ca-core/service/ca-api-error.service';
import { CaUserAccountsService } from './app/ca-core/service-api/ca-user-accounts.service';
import { CaEnvironmentHelper } from './app/ca-core/utils/ca-environment.helper';
import { CaAuthService } from './app/ca-login/service/ca-auth.service';
import { CA_ENVIRONMENT } from './environments/ca-environment';
import { CA_ENVIRONMENT_PATH, CaEnvironmentSettings } from './environments/ca-environment.class';

function loadThemeOnInit(themeService: FlThemeService): void {
  themeService.init();
}

function configureCaptcha(): FlCaptchaModuleConfig {
  return {
    siteKey: CaEnvironmentHelper.getRecaptchaSiteKey(),
    isLocal: !CaEnvironmentHelper.isProduction(),
  };
}

function initRootInjector(injector: Injector): void {
  flSetRootInjector(injector);
}

function bootstrapApp(): void {
  bootstrapApplication(CaAppComponent, {
    providers: [
      provideZoneChangeDetection(),
      provideRouter(
        CA_APP_ROUTES,
        withPreloading(PreloadAllModules),
        withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
        withRouterConfig({ paramsInheritanceStrategy: 'always' })
      ),
      importProvidersFrom(
        BrowserModule,
        // Other modules
        PrProtocolModule.forRoot(),
        FlApiModule.forRoot(CaApiServiceConfig, CaApiErrorService, 'front-errors'),
        // Setup translate module
        FlTranslateModule.forRoot({
          defaultLang: ClSupportedLanguage.en,
          availableLang: [ClSupportedLanguage.en, ClSupportedLanguage.fr],
          filenames: ['ca-global-', 'ca-dashboard-', 'ca-server-info-', 'ca-lab-'],
        }),
        FlTranslateModule.forRoot2(),
        // configuration of Front library
        FlIconModule.forRoot({
          iconFolder: 'assets/fl-mat-icons/',
          iconsToRegister: CA_SVG_ICONS,
        }),
        FlDialogModule.forRoot(),
        FlSnackBarModule.forRoot(),
        FlPortalModule.forRoot(),
        FlAuthModule.forRoot(CaAuthService, CaUserAccountsService),
        FlPortalActionsModule.forRoot(),
        FlUserModule.forRoot(CaUserConfig),
        BnBioNetworkModule.forRoot(),
        TdTechnicalDocModule.forRoot(CaTdServiceConfig),
        CoCommunityLibModule.forRoot(CaCommunityLibConfigService)
      ),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: FlHttpInterceptorService,
        multi: true,
      },
      {
        provide: HTTP_INTERCEPTORS,
        useExisting: CaSpaceInterceptor,
        multi: true,
      },
      provideAppInitializer(() => loadThemeOnInit(inject(FlThemeService))),
      provideAppInitializer(() => initRootInjector(inject(Injector))),
      provideAppInitializer(() => TeFixInit.fixEditorInit()),
      { provide: FL_CAPTCHA_MODULE_CONFIG, useFactory: configureCaptcha },
      { provide: RV_MODULE_CONFIG, useClass: RvResourceViewModuleBasicConfig },
      CookieService,
      provideHttpClient(withInterceptorsFromDi()),
      provideAnimations(),

      // form field default config
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: FL_MAT_FORM_FIELD_CONFIG },

      // tooltip default config
      { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: FL_TOOLTIP_CONFIG },

      // configure the date picker to work with luxon
      { provide: DateAdapter, useClass: LuxonDateAdapter },
      { provide: MAT_DATE_FORMATS, useValue: FL_LUXON_DATE_FORMAT },
    ],
  }).catch((err) => console.error(err));
}

if (CA_ENVIRONMENT.production) {
  enableProdMode();

  flLoadEnvironmentFromAssets(CA_ENVIRONMENT_PATH).then((env: CaEnvironmentSettings) => {
    // set the environment setting from the json file
    CA_ENVIRONMENT.settings = env;
    bootstrapApp();
  });
} else {
  // set the environment here to simulate the production mode
  // (environment is not loaded before bootstraping the app)
  CA_ENVIRONMENT.settings = {
    apiUrl: 'http://localhost:3001',
    communityApiUrl: 'https://community-api-pre-prod.constellab-pre-prod.gencovery.com',
    communityFrontUrl: 'http://localhost:4200',
    frontDomain: 'localhost',
    captchaSiteKey: '',
  };
  bootstrapApp();
}
