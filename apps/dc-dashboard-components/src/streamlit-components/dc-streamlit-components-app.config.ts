import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  Injector,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { LiConfig, liSvgIcons, LiTagService, LiTdServiceConfig } from '@monorepo/lab-lib/li-core';
import { DcLabLibConfig } from './dc-core/service/dc-lab-lib.config';
import { DcUserConfig } from './dc-core/service/dc-user.config';
import { FlPortalActionsModule } from '@monorepo/front-core-lib/fl-portal-actions';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { DcCoServiceConfig } from './dc-core/service/dc-co-service.config';
import { FlThemeModule, FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlApiModule } from '@monorepo/front-core-lib/fl-api';
import { DcApiServiceConfig } from './dc-core/service/dc-api-module.config';
import { DcApiErrorService } from './dc-core/service/dc-api-error.service';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DcHttpInterceptorService } from './dc-core/service/dc-http-interceptor.service';
import {
  flLuxonDateFormat,
  flMatFormFieldConfig,
  flSetRootInjector,
  flTooltipConfig,
} from '@monorepo/front-core-lib/fl-core';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

function loadThemeOnInit(themeService: FlThemeService): void {
  themeService.init();
}

function initRootInjector(injector: Injector): void {
  flSetRootInjector(injector);
}

export function dcStreamlitComponentsConfig(baseHref: string): ApplicationConfig {
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
      provideRouter([]),
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
