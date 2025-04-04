import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { lmsAppRoutes } from './lms-app.routes';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlApiModule } from '@monorepo/front-core-lib/fl-api';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule, flIconsDefault } from '@monorepo/front-core-lib/fl-svg-icon';
import { flLuxonDateFormat, flMatFormFieldConfig, flTooltipConfig } from '@monorepo/front-core-lib/fl-core';
import { FlPortalActionsModule } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';

import { ClSupportedLanguage } from '@monorepo/core-lib';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LmsApiServiceConfig } from './config/lms-api-module.config';
import { LmsApiErrorService } from './service/lms-api-error.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';

export const lmsAppConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(lmsAppRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      FlTranslateModule.forRoot({
        defaultLang: ClSupportedLanguage.en,
        availableLang: [ClSupportedLanguage.en, ClSupportedLanguage.fr],
        filenames: ['lms-global-'],
      })
    ),
    importProvidersFrom(FlTranslateModule.forRoot2()),
    importProvidersFrom(FlApiModule.forRoot(LmsApiServiceConfig, LmsApiErrorService)),
    importProvidersFrom(FlDialogModule.forRoot()),
    importProvidersFrom(FlSnackBarModule.forRoot()),
    importProvidersFrom(FlPortalModule.forRoot()),
    importProvidersFrom(FlPortalActionsModule.forRoot()),
    importProvidersFrom(
      // configuration of Front library
      FlIconModule.forRoot({
        iconFolder: 'assets/fl-mat-icons/',
        iconsToRegister: flIconsDefault,
      })
    ),

    // form field default config
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: flMatFormFieldConfig },

    // tooltip default config
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: flTooltipConfig },

    // configure the date picker to work with luxon
    { provide: DateAdapter, useClass: LuxonDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: flLuxonDateFormat },
  ],
};
