import { enableProdMode, importProvidersFrom, inject, Injector, provideAppInitializer } from '@angular/core';
import { environment } from './environments/lab-environment';
import { labEnvironmentPath, LabEnvironmentSettings } from './environments/lab-environment.class';
import {
  FL_CAPTCHA_MODULE_CONFIG,
  FL_TRANSLATE_MODULE_CONFIG,
  FlApiModule,
  FlAuthModule,
  FlCaptchaModuleConfig,
  FlDialogModule,
  FlHttpInterceptorService,
  FlIconModule,
  flLoadEnvironmentFromAssets,
  FlLocalStorageService,
  FlLuxonDateAdapter,
  flLuxonDateFormat,
  flMatFormFieldConfig,
  FlPortalActionsModule,
  FlPortalModule,
  flSetRootInjector,
  FlSnackBarModule,
  FlTagModule,
  FlThemeService,
  flTooltipConfig,
  FlTranslateModule,
  FlTranslateModuleConfig,
  FlTranslationLoader,
  FlUserModule,
} from '@monorepo/front-core-lib';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { LabEnvironmentHelper } from './app/lab-core/utils/lab-environment.helper';
import { LabEnvStore, LabEnvStoreLocalStorage, LabEnvStoreUrl } from './app/lab-core/service/lab-env.store';
import { ClHelpService, ClSupportedLanguage } from '@monorepo/core-lib';
import { RV_MODULE_CONFIG } from '@monorepo/resource-view';
import { LabResourceViewModuleConfig } from './app/lab-core/model/entities/resource/lab-resource-view.config';
import { TranslateLoader } from '@ngx-translate/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LabAppComponent } from './app/lab-app.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import { LabApiServiceConfig } from './app/lab-core/service/lab-api-module.config';
import { LabApiErrorService } from './app/lab-core/service/lab-api-error.service';
import { labSvgIcons } from './app/lab-core/utils/lab-svg-icon-config';
import { LabAuthService } from './app/lab-core/service/lab-auth.service';
import { LabTagService } from './app/lab-core/entity-service/lab-tag.service';
import { BnBioNetworkModule } from '@monorepo/bio-network';
import { LabBioNetworkService } from './app/lab-core/entity-service/lab-bio-network.service';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { LabTdServiceConfig } from './app/lab-core/service/lab-td-service.config';
import { LabUserConfig } from './app/lab-core/model/config/lab-user-config.service';
import { PrProtocolModule } from '@monorepo/protocol';
import { LabWorkflowResourcesState } from './app/lab-scenario/lab-scenario-detail-page/state/lab-workflow-resources.state';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { LabCoServiceConfig } from './app/lab-core/model/config/lab-co-service-config.service';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { labMainRoutes } from './app/lab-main/lab-main-routes';

function translationLoaderFactory(http: HttpClient, config: FlTranslateModuleConfig): FlTranslationLoader {
  return new FlTranslationLoader(http, config.filenames, config.filePrefix, config.fileSuffix);
}

function loadThemeOnInit(themeService: FlThemeService): () => void {
  return (): void => themeService.init();
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

function initRootInjector(injector: Injector): () => void {
  return (): void => flSetRootInjector(injector);
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
          filenames: ['lab-global-', 'lab-biox-', 'lab-biota-', 'lab-databox-', 'lab-monitoring-'],
        }),
        FlTranslateModule.forRoot2(),
        // configuration of Front library
        FlIconModule.forRoot({
          iconFolder: 'assets/fl-mat-icons/',
          iconsToRegister: labSvgIcons,
        }),
        FlDialogModule.forRoot(),
        FlSnackBarModule.forRoot(),
        FlPortalModule.forRoot(),
        FlPortalActionsModule.forRoot(),
        FlAuthModule.forRoot(LabAuthService),
        FlTagModule.forRoot(LabTagService),
        BnBioNetworkModule.forRoot(LabBioNetworkService),
        TdTechnicalDocModule.forRoot(LabTdServiceConfig),
        FlUserModule.forRoot(LabUserConfig),
        PrProtocolModule.forRoot(LabWorkflowResourcesState),
        CoCommunityLibModule.forRoot(LabCoServiceConfig)
      ),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: FlHttpInterceptorService,
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
      { provide: RV_MODULE_CONFIG, useClass: LabResourceViewModuleConfig },
      {
        provide: TranslateLoader,
        useFactory: translationLoaderFactory,
        deps: [HttpClient, FL_TRANSLATE_MODULE_CONFIG],
      },
      { provide: LabEnvStore, useFactory: provideLabEnvStore, deps: [FlLocalStorageService] },
      provideHttpClient(withInterceptorsFromDi()),
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
