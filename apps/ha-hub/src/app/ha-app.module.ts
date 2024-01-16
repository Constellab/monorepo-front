import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, Injector, NgModule, TransferState} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HaAppComponent} from './ha-app.component';
import {
  FL_CAPTCHA_MODULE_CONFIG,
  FlApiModule,
  FlAuthModule,
  FlCaptchaModule,
  FlCaptchaModuleConfig,
  FlDialogModule,
  FlHttpInterceptorService,
  FlIconModule,
  flIconsDefault,
  FlPortalActionsModule,
  FlPortalModule, flSetRootInjector,
  FlSnackBarModule,
  FlThemeService,
  FlTranslateModule,
  FlUserModule
} from '@monorepo/front-core-lib';
import {HaApiServiceConfig} from './ha-core/ha-model/ha-config/ha-api-module.config';
import {HaApiErrorService} from './ha-core/ha-model/ha-config/ha-api-error.service';
import {ClSupportedLanguage} from '@monorepo/core-lib';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HaAppRoutingModule} from './ha-app-routing-module';
import {HaCoreModule} from './ha-core/ha-core.module';
import {HaAuthService} from './ha-core/ha-service/ha-auth.service';
import {HaAuthenticatedUserService} from './ha-core/ha-service/ha-authenticated-user.service';
import {TdTechnicalDocModule} from '@monorepo/technical-doc';
import {HaTdServiceConfig} from './ha-core/ha-model/ha-config/ha-td-service.config';
import {HaUserConfig} from './ha-core/ha-model/ha-config/ha-user-config.config';
import {HaMainModule} from './ha-main/ha-main.module';
import {HaEnvironmentHelper} from './ha-core/ha-model/ha-config/ha-environment.helper';
import {HaHttpInterceptorSsrService} from './ha-core/ha-service/ha-http-interceptor-ssr.service';
import {rvDefaultViewTypeInfos, RvResourceViewModule} from '@monorepo/resource-view';

function loadUserOnInit(authenticatedUserService: HaAuthenticatedUserService): () => void {
  return (): void => authenticatedUserService.init();
}

function loadThemeOnInit(themeService: FlThemeService): () => void {
  return (): void => themeService.init();
}

function configureCaptcha(): FlCaptchaModuleConfig {
  return {
    siteKey: HaEnvironmentHelper.getRecaptchaSiteKey(),
    isLocal: !HaEnvironmentHelper.isProduction()
  };
}

@NgModule({
  declarations: [HaAppComponent],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    BrowserAnimationsModule,
    HttpClientModule,

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
      iconsToRegister: flIconsDefault,
    }),

    RvResourceViewModule.forRoot({availableViews: rvDefaultViewTypeInfos}),

    HaMainModule
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
    {
      provide: APP_INITIALIZER,
      useFactory: loadUserOnInit,
      deps: [HaAuthenticatedUserService],
      multi: true,
    },
    {provide: APP_INITIALIZER, useFactory: loadThemeOnInit, deps: [FlThemeService], multi: true},
    {provide: FL_CAPTCHA_MODULE_CONFIG, useFactory: configureCaptcha}
  ],
  bootstrap: [HaAppComponent],
})
export class HaAppModule {
  constructor(injector: Injector) {
    // set the root injector in a variable
    flSetRootInjector(injector);
  }
}
