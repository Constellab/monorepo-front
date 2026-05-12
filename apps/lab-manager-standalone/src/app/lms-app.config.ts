import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlApiModule } from '@monorepo/front-core-lib/fl-api';
import { flLuxonDateFormat, flMatFormFieldConfig, flTooltipConfig } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalActionsModule } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { FL_ICONS_DEFAULT,FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { LmsApiServiceConfig } from './config/lms-api-module.config';
import { lmsAppRoutes } from './lms-app.routes';
import { LmsApiErrorService } from './service/lms-api-error.service';

export const LMS_APP_CONFIG: ApplicationConfig = {
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
        iconsToRegister: FL_ICONS_DEFAULT,
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
