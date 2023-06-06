import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';

import {LabAppComponent} from './lab-app.component';
import {LabMainModule} from './lab-main/lab-main.module';
import {LabCoreModule} from './lab-core/lab-core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {
  FL_CAPTCHA_MODULE_CONFIG,
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
  FlTagModule,
  FlTextEditorModule,
  FlThemeService,
  FlTranslateModule,
  FlUserModule
} from '@monorepo/front-core-lib';
import {labSvgIcons} from './lab-core/utils/lab-svg-icon-config';
import {ClSupportedLanguage} from '@monorepo/core-lib';
import {LabLoginModule} from './lab-login/lab-login.module';
import {LabAuthService} from './lab-core/service/lab-auth.service';
import {LabApiErrorService} from './lab-core/service/lab-api-error.service';
import {LabApiServiceConfig} from './lab-core/service/lab-api-module.config';
import {LabAppRoutingModule} from './lab-app-routing.module';
import {LabTagService} from './lab-core/entity-service/lab-tag.service';
import {LabReportContentViewBlot} from './lab-report/module/lab-report-detail-page/lab-report-content-view.class';
import {
  LabReportContentViewComponent
} from './lab-report/module/lab-report-detail-page/component/lab-report-content-view/lab-report-content-view.component';
import {RvResourceViewModule} from '@monorepo/resource-view';
import {TdTechnicalDocModule} from '@monorepo/technical-doc';
import {LabTdServiceConfig} from './lab-core/service/lab-td-service.config';
import {labConstResourceViewTypeInfos} from './lab-core/model/entities/resource/lab-resource-view-type.class';
import {PrProtocolModule} from '@monorepo/protocol';
import {LabBioNetworkService} from './lab-core/entity-service/lab-bio-network.service';
import {LabUserConfig} from './lab-core/model/config/lab-user-config.service';
import {BnBioNetworkModule} from '@monorepo/bio-network';
import {
  LabWorkflowResourcesState
} from './lab-biox/module/lab-experiment-detail-page/state/lab-workflow-resources.state';
import {LabEnvironmentHelper} from './lab-core/utils/lab-environment.helper';


function loadThemeOnInit(themeService: FlThemeService): () => void {
  return (): void => themeService.init();
}

function configureCaptcha(): FlCaptchaModuleConfig {
  return {
    siteKey: LabEnvironmentHelper.getRecaptchaSiteKey(),
    isLocal: !LabEnvironmentHelper.isProduction()
  };
}

@NgModule({
  declarations: [LabAppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

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
      availableLang: [ClSupportedLanguage.en],
      filenames: ['lab-global-', 'lab-biox-', 'lab-biota-', 'lab-databox-', 'lab-monitoring-']
    }),
    FlTranslateModule.forRoot2(),

    // configuration of Front library
    FlIconModule.forRoot({
      iconFolder: 'assets/fl-mat-icons/',
      iconsToRegister: labSvgIcons
    }),

    FlDialogModule.forRoot(),
    FlSnackBarModule.forRoot(),
    FlPortalModule.forRoot(),
    FlPortalActionsModule.forRoot(),
    FlAuthModule.forRoot(LabAuthService),
    FlTagModule.forRoot(LabTagService),
    FlTextEditorModule.forRoot({
      blots: [
        {blot: LabReportContentViewBlot, componentType: LabReportContentViewComponent},
      ]
    }),
    BnBioNetworkModule.forRoot(LabBioNetworkService),
    RvResourceViewModule.forRoot({availableViews: labConstResourceViewTypeInfos}),
    TdTechnicalDocModule.forRoot(LabTdServiceConfig),
    FlUserModule.forRoot(LabUserConfig),
    FlCaptchaModule,

    PrProtocolModule.forRoot(LabWorkflowResourcesState),


    LabAppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FlHttpInterceptorService,
      multi: true
    },
    {provide: APP_INITIALIZER, useFactory: loadThemeOnInit, deps: [FlThemeService], multi: true},
    {provide: FL_CAPTCHA_MODULE_CONFIG, useFactory: configureCaptcha},
  ],
  bootstrap: [LabAppComponent],
})
export class LabAppModule {
  constructor(injector: Injector) {
    // set the root injector in a variable
    flSetRootInjector(injector);
  }
}
