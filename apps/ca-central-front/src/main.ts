import { enableProdMode, importProvidersFrom, inject, Injector, provideAppInitializer } from '@angular/core';

import { environment } from './environments/ca-environment';
import {
  FL_CAPTCHA_MODULE_CONFIG,
  FL_TRANSLATE_MODULE_CONFIG,
  FlApiModule,
  FlAuthModule,
  FlCaptchaModule,
  FlCaptchaModuleConfig,
  FlDialogModule,
  FlHttpInterceptorService,
  FlIconModule,
  flLoadEnvironmentFromAssets,
  FlLuxonDateAdapter,
  flLuxonDateFormat,
  flMatFormFieldConfig,
  FlPortalActionsModule,
  FlPortalModule,
  flSetRootInjector,
  FlSnackBarModule,
  FlThemeService,
  flTooltipConfig,
  FlTranslateModule,
  FlTranslateModuleConfig,
  FlTranslationLoader,
  FlUserModule,
} from '@monorepo/front-core-lib';
import { caEnvironmentPath, CaEnvironmentSettings } from './environments/ca-environment.class';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CaSpaceInterceptor } from './app/ca-core/interceptor/ca-space-interceptor.service';
import { CaEnvironmentHelper } from './app/ca-core/utils/ca-environment.helper';
import {
  RV_MODULE_CONFIG,
  RvResourceViewModule,
  RvResourceViewModuleBasicConfig,
} from '@monorepo/resource-view';
import { TranslateLoader } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LmlBrickService } from '@monorepo/lab-manager-lib';
import { CaLabManagerBrickService } from './app/ca-lab/state/ca-lab-manager-brick.service';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { caAppRoutes } from './app/ca-app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PrProtocolModule } from '@monorepo/protocol';
import { CaApiServiceConfig } from './app/ca-core/model/config/ca-api-module.config';
import { CaApiErrorService } from './app/ca-core/service/ca-api-error.service';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { caSvgIcons } from './app/ca-core/model/config/ca-svg-icon-config';
import { CaAuthService } from './app/ca-login/service/ca-auth.service';
import { CaUserAccountsService } from './app/ca-core/service-api/ca-user-accounts.service';
import { CaUserConfig } from './app/ca-core/model/config/ca-user-config.service';
import { BnBioNetworkModule } from '@monorepo/bio-network';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { CaTdServiceConfig } from './app/ca-core/model/config/ca-td-service.config';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { CaCoServiceConfig } from './app/ca-core/model/config/ca-co-service-config.service';
import { CaAppComponent } from './app/ca-app.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from '@angular/router';

export function translationLoaderFactory(
  http: HttpClient,
  config: FlTranslateModuleConfig
): FlTranslationLoader {
  return new FlTranslationLoader(http, config.filenames, config.filePrefix, config.fileSuffix);
}

function loadThemeOnInit(themeService: FlThemeService): () => void {
  return (): void => themeService.init();
}

function configureCaptcha(): FlCaptchaModuleConfig {
  return {
    siteKey: CaEnvironmentHelper.getRecaptchaSiteKey(),
    isLocal: !CaEnvironmentHelper.isProduction(),
  };
}

function initRootInjector(injector: Injector): () => void {
  return (): void => flSetRootInjector(injector);
}

function bootstrapApp(): void {
  bootstrapApplication(CaAppComponent, {
    providers: [
      provideRouter(
        caAppRoutes,
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
          iconsToRegister: caSvgIcons,
        }),
        FlDialogModule.forRoot(),
        FlSnackBarModule.forRoot(),
        FlPortalModule.forRoot(),
        FlCaptchaModule,
        FlAuthModule.forRoot(CaAuthService, CaUserAccountsService),
        FlPortalActionsModule.forRoot(),
        FlUserModule.forRoot(CaUserConfig),
        RvResourceViewModule,
        BnBioNetworkModule.forRoot(),
        TdTechnicalDocModule.forRoot(CaTdServiceConfig),
        CoCommunityLibModule.forRoot(CaCoServiceConfig)
      ),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: FlHttpInterceptorService,
        multi: true,
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: CaSpaceInterceptor,
        multi: true,
      },
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
      {
        provide: TranslateLoader,
        useFactory: translationLoaderFactory,
        deps: [HttpClient, FL_TRANSLATE_MODULE_CONFIG],
      },
      CookieService,
      provideHttpClient(withInterceptorsFromDi()),
      { provide: LmlBrickService, useClass: CaLabManagerBrickService },
      provideAnimations(),

      // form field default config
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: flMatFormFieldConfig },

      // tooltip default config
      { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: flTooltipConfig },

      // configure the date picker to work with luxon
      { provide: DateAdapter, useExisting: FlLuxonDateAdapter },
      { provide: MAT_DATE_FORMATS, useValue: flLuxonDateFormat },
    ],
  }).catch((err) => console.error(err));
}

if (environment.production) {
  enableProdMode();

  flLoadEnvironmentFromAssets(caEnvironmentPath).then((env: CaEnvironmentSettings) => {
    // set the environment setting from the json file
    environment.settings = env;
    bootstrapApp();
  });
} else {
  // set the environment here to simulate the production mode
  // (environment is not loaded before bootstraping the app)
  environment.settings = {
    apiUrl: 'http://localhost:3001',
    communityApiUrl: 'http://localhost:3333',
    communityFrontUrl: 'http://localhost:4200',
    frontDomain: 'localhost',
    captchaSiteKey: '123456',
  };
  bootstrapApp();
}
