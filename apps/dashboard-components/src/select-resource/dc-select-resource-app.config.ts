import {
  ApplicationConfig,
  importProvidersFrom,
  InjectionToken,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  FlLuxonDateAdapter,
  flLuxonDateFormat,
  flMatFormFieldConfig,
  flTooltipConfig,
} from '@monorepo/front-core-lib/fl-core';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Token use to inject config from streamlit to angular app
export const DC_APP_DATA = new InjectionToken('DC_APP_DATA');

export function dcSelectResourceGetAppConfig(data: any): ApplicationConfig {
  return {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      { provide: DC_APP_DATA, useValue: data },

      // configure the date picker to work with luxon
      { provide: DateAdapter, useExisting: FlLuxonDateAdapter },
      { provide: MAT_DATE_FORMATS, useValue: flLuxonDateFormat },

      // form field default config
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: flMatFormFieldConfig },

      // tooltip default config
      { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: flTooltipConfig },

      importProvidersFrom(
        FlTranslateModule.forRoot({
          defaultLang: ClSupportedLanguage.en,
          availableLang: [ClSupportedLanguage.en, ClSupportedLanguage.fr],
          filenames: [],
        })
      ),
      importProvidersFrom(FlTranslateModule.forRoot2()),
      importProvidersFrom(BrowserAnimationsModule),
    ],
  };
}
