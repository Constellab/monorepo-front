import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { lmsAppRoutes } from './lms-app.routes';
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
  FlSnackBarModule,
  flTooltipConfig,
  FlTranslateModule,
  FlTranslateModuleConfig,
  FlTranslationLoader,
} from '@monorepo/front-core-lib';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LmsApiServiceConfig } from './config/lms-api-module.config';
import { LmsApiErrorService } from './service/lms-api-error.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function translationLoaderFactory(
  http: HttpClient,
  config: FlTranslateModuleConfig
): FlTranslationLoader {
  console.log('translationLoaderFactory');
  return new FlTranslationLoader(http, config.filenames, config.filePrefix, config.fileSuffix);
}



export const lmsAppConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(lmsAppRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: TranslateLoader,
      useFactory: translationLoaderFactory,
      deps: [HttpClient, FL_TRANSLATE_MODULE_CONFIG],
    },
    importProvidersFrom(
      FlTranslateModule.forRoot({
        defaultLang: ClSupportedLanguage.en,
        availableLang: [ClSupportedLanguage.en, ClSupportedLanguage.fr],
        filenames: ['lms-global-'],
      })
    ),
    importProvidersFrom(FlTranslateModule.forRoot2()),
    importProvidersFrom(TranslateModule.forRoot({})),
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
    { provide: DateAdapter, useExisting: FlLuxonDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: flLuxonDateFormat },
  ],
};
