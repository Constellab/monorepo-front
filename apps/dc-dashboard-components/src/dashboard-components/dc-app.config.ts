import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  ApplicationConfig,
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlApiModule } from '@monorepo/front-core-lib/fl-api';
import {
  flLuxonDateFormat,
  flMatFormFieldConfig,
  flSetRootInjector,
  flTooltipConfig,
} from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalActionsModule } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlThemeModule, FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiConfig, liSvgIcons, LiTagService, LiTdServiceConfig } from '@monorepo/lab-lib/li-core';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

import { DcApiErrorService } from './dc-core/service/dc-api-error.service';
import { DcApiServiceConfig } from './dc-core/service/dc-api-module.config';
import { DcCoServiceConfig } from './dc-core/service/dc-co-service.config';
import { DcHttpInterceptorService } from './dc-core/service/dc-http-interceptor.service';
import { DcLabLibConfig } from './dc-core/service/dc-lab-lib.config';
import { DcUserConfig } from './dc-core/service/dc-user.config';

function loadThemeOnInit(themeService: FlThemeService): void {
  themeService.init();
}

function initRootInjector(injector: Injector): void {
  flSetRootInjector(injector);
}

export function dcAppConfig(baseHref: string, routes: Routes = []): ApplicationConfig {
  // configure the lab-lib config
  return {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),

      { provide: LiConfig, useClass: DcLabLibConfig },
      importProvidersFrom(
        BrowserAnimationsModule,
        FlThemeModule.forRoot({
          cssThemeFileLocation: baseHref,
        }),
        FlIconModule.forRoot({
          iconFolder: baseHref + '/assets/fl-mat-icons/',
          iconsToRegister: liSvgIcons,
        }),
        FlApiModule.forRoot(DcApiServiceConfig, DcApiErrorService),
        FlTranslateModule.forRoot({
          defaultLang: ClSupportedLanguage.en,
          availableLang: [ClSupportedLanguage.en, ClSupportedLanguage.fr],
          filenames: ['dc-', 'li-'],
          folder: baseHref + '/assets/i18n/',
        }),
        FlTranslateModule.forRoot2(),
        FlDialogModule.forRoot(),
        FlSnackBarModule.forRoot(),
        FlUserModule.forRoot(DcUserConfig),
        FlPortalModule.forRoot(),
        FlPortalActionsModule.forRoot(),
        FlTagModule.forRoot(LiTagService),
        TdTechnicalDocModule.forRoot(LiTdServiceConfig),
        CoCommunityLibModule.forRoot(DcCoServiceConfig)
      ),
      provideHttpClient(withInterceptorsFromDi()),
      provideRouter(routes),
      provideAppInitializer(() => loadThemeOnInit(inject(FlThemeService))),
      provideAppInitializer(() => initRootInjector(inject(Injector))),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: DcHttpInterceptorService,
        multi: true,
      },
      // configure the date picker to work with luxon
      { provide: DateAdapter, useClass: LuxonDateAdapter },
      { provide: MAT_DATE_FORMATS, useValue: flLuxonDateFormat },

      // form field default config
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: flMatFormFieldConfig },

      // tooltip default config
      { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: flTooltipConfig },
    ],
  };
}
