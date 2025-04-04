import { enableProdMode, importProvidersFrom, inject, Injector, provideAppInitializer } from '@angular/core';
import { environment } from './environments/lab-environment';
import { labEnvironmentPath, LabEnvironmentSettings } from './environments/lab-environment.class';
import { FL_CAPTCHA_MODULE_CONFIG, FlCaptchaModuleConfig } from '@monorepo/front-core-lib/fl-captcha';
import { FlHttpInterceptorService, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlApiModule } from '@monorepo/front-core-lib/fl-api';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import {
  flLoadEnvironmentFromAssets,
  FlLocalStorageService,
  flLuxonDateFormat,
  flMatFormFieldConfig,
  flSetRootInjector,
  flTooltipConfig,
} from '@monorepo/front-core-lib/fl-core';
import { FlPortalActionsModule } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ClHelpService, ClSupportedLanguage } from '@monorepo/core-lib';
import { RV_MODULE_CONFIG } from '@monorepo/resource-view';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LabAppComponent } from './app/lab-app.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import { BnBioNetworkModule } from '@monorepo/bio-network';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { PrProtocolModule } from '@monorepo/protocol';
import { LabWorkflowResourcesState } from './app/lab-scenario/lab-scenario-detail-page/state/lab-workflow-resources.state';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { labMainRoutes } from './app/lab-main/lab-main-routes';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { TeFixInit } from '@monorepo/text-editor';
import { LabEnvironmentHelper } from './app/lab-core/lab-environment.helper';
import { LabEnvStore, LabEnvStoreLocalStorage, LabEnvStoreUrl } from './app/lab-core/lab-env.store';
import { LabApiServiceConfig } from './app/lab-core/lab-api-module.config';
import {
  LiAuthService,
  LiBioNetworkService,
  LiConfig,
  liSvgIcons,
  LiTagService,
  LiTdServiceConfig,
} from '@monorepo/lab-lib/li-core';
import { LabApiErrorService } from './app/lab-core/lab-api-error.service';
import { LabCoServiceConfig } from './app/lab-core/lab-co-service-config.service';
import { LabUserConfig } from './app/lab-core/lab-user-config.service';
import { LabResourceViewModuleConfig } from './app/lab-core/lab-resource-view.config';
import { LabLibConfig } from './app/lab-core/lab-lib.config';

function loadThemeOnInit(themeService: FlThemeService): void {
  themeService.init();
}

function configureCaptcha(): FlCaptchaModuleConfig {
  return {
    siteKey: LabEnvironmentHelper.getRecaptchaSiteKey(),
    isLocal: !LabEnvironmentHelper.isProduction(),
  };
}

function provideLabEnvStore(localStorage: FlLocalStorageService): LabEnvStore {
  const prodFrontUrls = LabEnvironmentHelper.getProdFrontUrls();
  const devFrontUrls = LabEnvironmentHelper.getDevFrontUrls();
  if (ClHelpService.isNullOrEmpty(prodFrontUrls) || ClHelpService.isNullOrEmpty(devFrontUrls)) {
    return new LabEnvStoreLocalStorage(localStorage);
  }

  // if the dev and prod front have the same first url,
  // we use the local storage mode to switch the environment
  if (prodFrontUrls[0] === devFrontUrls[0]) {
    return new LabEnvStoreLocalStorage(localStorage);
  } else {
    // otherwise we use the url mode
    return new LabEnvStoreUrl();
  }
}

function initRootInjector(injector: Injector): void {
  flSetRootInjector(injector);
}

function bootstrapApp(): void {
  bootstrapApplication(LabAppComponent, {
    providers: [
      provideRouter(
        labMainRoutes,
        withPreloading(PreloadAllModules),
        withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
      ),
      importProvidersFrom(
        BrowserModule,
        FlApiModule.forRoot(LabApiServiceConfig, LabApiErrorService),
        // Fl setup modules
        // Setup translate module
        FlTranslateModule.forRoot({
          defaultLang: ClSupportedLanguage.en,
          availableLang: [ClSupportedLanguage.en, ClSupportedLanguage.fr],
          filenames: ['lab-global-', 'lab-biox-', 'lab-biota-', 'lab-databox-', 'lab-monitoring-', 'li-'],
        }),
        FlTranslateModule.forRoot2(),
        // configuration of Front library
        FlIconModule.forRoot({
          iconFolder: 'assets/fl-mat-icons/',
          iconsToRegister: liSvgIcons,
        }),
        FlDialogModule.forRoot(),
        FlSnackBarModule.forRoot(),
        FlPortalModule.forRoot(),
        FlPortalActionsModule.forRoot(),
        FlAuthModule.forRoot(LiAuthService),
        FlTagModule.forRoot(LiTagService),
        BnBioNetworkModule.forRoot(LiBioNetworkService),
        TdTechnicalDocModule.forRoot(LiTdServiceConfig),
        FlUserModule.forRoot(LabUserConfig),
        PrProtocolModule.forRoot(LabWorkflowResourcesState),
        CoCommunityLibModule.forRoot(LabCoServiceConfig)
      ),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: FlHttpInterceptorService,
        multi: true,
      },
      provideAppInitializer(() => loadThemeOnInit(inject(FlThemeService))),
      provideAppInitializer(() => initRootInjector(inject(Injector))),
      provideAppInitializer(() => TeFixInit.fixEditorInit()),
      { provide: FL_CAPTCHA_MODULE_CONFIG, useFactory: configureCaptcha },
      { provide: RV_MODULE_CONFIG, useClass: LabResourceViewModuleConfig },
      { provide: LabEnvStore, useFactory: provideLabEnvStore, deps: [FlLocalStorageService] },
      { provide: LiConfig, useClass: LabLibConfig },
      provideHttpClient(withInterceptorsFromDi()),
      provideAnimations(),
      // form field default config
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: flMatFormFieldConfig },
      // tooltip default config
      { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: flTooltipConfig },
      // configure the date picker to work with luxon
      { provide: DateAdapter, useClass: LuxonDateAdapter },
      { provide: MAT_DATE_FORMATS, useValue: flLuxonDateFormat },
    ],
  }).catch((err) => console.error(err));
}

if (environment.production) {
  enableProdMode();

  flLoadEnvironmentFromAssets(labEnvironmentPath).then((env: LabEnvironmentSettings) => {
    // set the environment setting from the json file
    environment.settings = env;
    bootstrapApp();
  });
} else {
  // set the environment here to simulate the production mode
  // (environment is not loaded before bootstraping the app)
  environment.settings = {
    apiBaseUrl: 'http://localhost:3000',
    devApiBaseUrl: 'http://localhost:3000',
    codelabUrl: 'http://localhost:80',
    virtualHost: 'localhost',
    spaceFrontUrl: 'http://localhost:4200',
    spaceApiUrl: 'http://localhost:3001',
    communityFrontUrl: 'https://hub-pre-prod.gencovery.com',
    communityApiUrl: 'http://localhost:3333',
    captchaSiteKey: '123456',
    prodFrontUrls: 'http://localhost:4200',
    devFrontUrls: 'http://localhost:4200',
  };

  // in dev no environment loading
  bootstrapApp();
}
