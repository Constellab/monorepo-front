import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  FL_TRANSLATE_MODULE_CONFIG,
  FlApiModule,
  FlDialogModule,
  FlIconModule,
  flIconsDefault,
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
import { LmsAppComponent } from './lms-app.component';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { TranslateLoader } from '@ngx-translate/core';
import { LmsApiServiceConfig } from './config/lms-api-module.config';
import { LmsApiErrorService } from './service/lms-api-error.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LmlBrickService, LmlLabManagerLibModule } from '@monorepo/lab-manager-lib';
import { LmsLabManagerBrickService } from './service/lms-lab-manager-brick.service';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { lmsAppRoutes } from './lms-app.routes';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { LmsCoServiceConfig } from './config/lms-co-service.config';
import { LmsUserConfig } from './config/lms-user.config';
import { LmsPageComponent } from './components/lms-page/lms-page.component';

export function translationLoaderFactory(
  http: HttpClient,
  config: FlTranslateModuleConfig
): FlTranslationLoader {
  return new FlTranslationLoader(http, config.filenames, config.filePrefix, config.fileSuffix);
}

function loadThemeOnInit(themeService: FlThemeService): () => void {
  return (): void => themeService.init();
}

@NgModule({
  declarations: [LmsAppComponent],
  bootstrap: [LmsAppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      lmsAppRoutes,
      // load all lazy module on start
      {
        preloadingStrategy: PreloadAllModules,
        scrollPositionRestoration: 'enabled',
        paramsInheritanceStrategy: 'always',
        anchorScrolling: 'enabled',
      }
    ),

    FlApiModule.forRoot(LmsApiServiceConfig, LmsApiErrorService),
    // Setup translate module
    FlTranslateModule.forRoot({
      defaultLang: ClSupportedLanguage.en,
      availableLang: [ClSupportedLanguage.en, ClSupportedLanguage.fr],
      filenames: ['lms-global-'],
    }),
    FlTranslateModule.forRoot2(),
    // configuration of Front library
    FlIconModule.forRoot({
      iconFolder: 'assets/fl-mat-icons/',
      iconsToRegister: flIconsDefault,
    }),
    FlDialogModule.forRoot(),
    FlSnackBarModule.forRoot(),
    FlPortalModule.forRoot(),
    FlPortalActionsModule.forRoot(),
    CoCommunityLibModule.forRoot(LmsCoServiceConfig),
    // TODO to see, needed by community lib
    FlUserModule.forRoot(LmsUserConfig),

    LmlLabManagerLibModule,

    LmsPageComponent,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: loadThemeOnInit, deps: [FlThemeService], multi: true },

    {
      provide: TranslateLoader,
      useFactory: translationLoaderFactory,
      deps: [HttpClient, FL_TRANSLATE_MODULE_CONFIG],
    },
    // form field default config
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: flMatFormFieldConfig },

    // tooltip default config
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: flTooltipConfig },

    // configure the date picker to work with luxon
    { provide: DateAdapter, useExisting: FlLuxonDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: flLuxonDateFormat },
    { provide: LmlBrickService, useClass: LmsLabManagerBrickService },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class LmsAppModule {
  constructor(injector: Injector) {
    // set the root injector in a variable
    flSetRootInjector(injector);
  }
}
