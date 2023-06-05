import {BrowserModule, TransferState} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HaAppComponent} from './ha-app.component';
import {
  FlApiModule,
  FlAuthModule,
  FlDialogModule,
  FlHttpInterceptorService,
  FlIconModule,
  flIconsDefault,
  FlPortalModule,
  FlSnackBarModule,
  FlTextEditorModule,
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
import {REQUEST} from '@nguniversal/express-engine/tokens';
import {HaHttpInterceptorSsrService} from './ha-core/ha-service/ha-http-interceptor-ssr.service';

function loadUserOnInit(authenticatedUserService: HaAuthenticatedUserService): () => void {
  return (): void => authenticatedUserService.init();
}

function loadThemeOnInit(themeService: FlThemeService): () => void {
  return (): void => themeService.init();
}

@NgModule({
  declarations: [HaAppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
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

    FlIconModule.forRoot({
      iconFolder: 'assets/fl-mat-icons/',
      iconsToRegister: flIconsDefault,
    }),
    FlTextEditorModule.forRoot({
      blots: [],
    }),
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
  ],
  bootstrap: [HaAppComponent],
})
export class HaAppModule {
}
