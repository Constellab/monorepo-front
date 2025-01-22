import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule, TransferState, inject, provideAppInitializer } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HaAppComponent } from './ha-app.component';
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
  FlPortalActionsModule,
  FlPortalModule,
  flSetRootInjector,
  FlSnackBarModule,
  FlThemeService,
  FlTranslateModule,
  FlTranslateModuleConfig,
  FlTranslationLoader,
  FlUserModule,
} from '@monorepo/front-core-lib';
import { HaApiServiceConfig } from './ha-core/ha-model/ha-config/ha-api-module.config';
import { HaApiErrorService } from './ha-core/ha-model/ha-config/ha-api-error.service';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HaAppRoutingModule } from './ha-app-routing-module';
import { HaCoreModule } from './ha-core/ha-core.module';
import { HaAuthService } from './ha-core/ha-service/ha-auth.service';
import { HaAuthenticatedUserService } from './ha-core/ha-service/ha-authenticated-user.service';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { HaTdServiceConfig } from './ha-core/ha-model/ha-config/ha-td-service.config';
import { HaUserConfig } from './ha-core/ha-model/ha-config/ha-user-config.config';
import { HaEnvironmentHelper } from './ha-core/ha-model/ha-config/ha-environment.helper';
import { HaHttpInterceptorSsrService } from './ha-core/ha-service/ha-http-interceptor-ssr.service';
import {
  RV_MODULE_CONFIG,
  RvResourceViewModule,
  RvResourceViewModuleBasicConfig,
} from '@monorepo/resource-view';
import { TranslateLoader } from '@ngx-translate/core';
import { haSvgIcons } from './ha-core/utils/ha-svg-icon-config';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { HaCoServiceConfig } from './ha-core/ha-model/ha-config/ha-co-service.config';

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

export function TranslationLoaderFactory(
  http: HttpClient,
  config: FlTranslateModuleConfig
): FlTranslationLoader {
  return new FlTranslationLoader(http, config.filenames, config.filePrefix, config.fileSuffix);
}

@NgModule({
  declarations: [HaAppComponent],
  bootstrap: [HaAppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HaAppRoutingModule,
    HaCoreModule,
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
    CoCommunityLibModule.forRoot(HaCoServiceConfig),
  ],
  providers: [
    TransferState,
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
    { provide: FL_CAPTCHA_MODULE_CONFIG, useFactory: configureCaptcha },
    { provide: RV_MODULE_CONFIG, useClass: RvResourceViewModuleBasicConfig },
    {
      provide: TranslateLoader,
      useFactory: TranslationLoaderFactory,
      deps: [HttpClient, FL_TRANSLATE_MODULE_CONFIG],
    },
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
  ],
})
export class HaAppModule {
  constructor() {
    const injector = inject(Injector);

    // set the root injector in a variable
    flSetRootInjector(injector);
  }
}
