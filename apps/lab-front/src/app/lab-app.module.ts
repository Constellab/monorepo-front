import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule, inject, provideAppInitializer } from '@angular/core';

import { LabAppComponent } from './lab-app.component';
import { LabMainModule } from './lab-main/lab-main.module';
import { LabCoreModule } from './lab-core/lab-core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
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
  FlLocalStorageService,
  FlPortalActionsModule,
  FlPortalModule,
  flSetRootInjector,
  FlSnackBarModule,
  FlTagModule,
  FlThemeService,
  FlTranslateModule,
  FlTranslateModuleConfig,
  FlTranslationLoader,
  FlUserModule,
} from '@monorepo/front-core-lib';
import { labSvgIcons } from './lab-core/utils/lab-svg-icon-config';
import { ClHelpService, ClSupportedLanguage } from '@monorepo/core-lib';
import { LabLoginModule } from './lab-login/lab-login.module';
import { LabAuthService } from './lab-core/service/lab-auth.service';
import { LabApiErrorService } from './lab-core/service/lab-api-error.service';
import { LabApiServiceConfig } from './lab-core/service/lab-api-module.config';
import { LabAppRoutingModule } from './lab-app-routing.module';
import { LabTagService } from './lab-core/entity-service/lab-tag.service';
import { RV_MODULE_CONFIG, RvResourceViewModule } from '@monorepo/resource-view';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { LabTdServiceConfig } from './lab-core/service/lab-td-service.config';
import { LabResourceViewModuleConfig } from './lab-core/model/entities/resource/lab-resource-view.config';
import { PrProtocolModule } from '@monorepo/protocol';
import { LabBioNetworkService } from './lab-core/entity-service/lab-bio-network.service';
import { LabUserConfig } from './lab-core/model/config/lab-user-config.service';
import { BnBioNetworkModule } from '@monorepo/bio-network';
import { LabWorkflowResourcesState } from './lab-scenario/lab-scenario-detail-page/state/lab-workflow-resources.state';
import { LabEnvironmentHelper } from './lab-core/utils/lab-environment.helper';
import { LabNoteTemplateCoreModule } from './lab-core/entity-module/lab-note-template-core/lab-note-template-core.module';
import { LabCredentialsCoreModule } from './lab-core/entity-module/lab-credentials-core/lab-credentials-core.module';
import { LabRichTextCoreModule } from './lab-core/entity-module/lab-rich-text-core/lab-rich-text-core.module';
import { TranslateLoader } from '@ngx-translate/core';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { LabCoServiceConfig } from './lab-core/model/config/lab-co-service-config.service';
import { LabEnvStore, LabEnvStoreLocalStorage, LabEnvStoreUrl } from './lab-core/service/lab-env.store';

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

@NgModule({
  declarations: [LabAppComponent],
  bootstrap: [LabAppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // other app modules
    LabMainModule,
    LabLoginModule,
    // Core module
    LabCoreModule,
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
    RvResourceViewModule,
    TdTechnicalDocModule.forRoot(LabTdServiceConfig),
    FlUserModule.forRoot(LabUserConfig),
    FlCaptchaModule,
    PrProtocolModule.forRoot(LabWorkflowResourcesState),
    CoCommunityLibModule.forRoot(LabCoServiceConfig),
    // import core module here because they have dynamic field component required
    // in task config
    LabNoteTemplateCoreModule,
    LabCredentialsCoreModule,
    LabRichTextCoreModule,
    LabAppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FlHttpInterceptorService,
      multi: true,
    },
    provideAppInitializer(() => {
      const initializerFn = loadThemeOnInit(inject(FlThemeService));
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
  ],
})
export class LabAppModule {
  constructor() {
    const injector = inject(Injector);

    // set the root injector in a variable
    flSetRootInjector(injector);
  }
}
