import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  InjectionToken,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  FlDialogModule,
  FlLuxonDateAdapter,
  flLuxonDateFormat,
  flMatFormFieldConfig,
  FlPortalModule,
  FlSnackBarModule,
  FlThemeService,
  flTooltipConfig,
  FlTranslateModule,
} from '@monorepo/front-core-lib';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Token use to inject config from streamlit to angular app
export const DC_APP_DATA = new InjectionToken('DC_APP_DATA');

function loadThemeOnInit(themeService: FlThemeService): () => void {
  return (): void => themeService.init();
}

export function dcTextEditorGetAppConfig(data: any): ApplicationConfig {
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
      importProvidersFrom(FlDialogModule.forRoot()),
      importProvidersFrom(FlPortalModule.forRoot()),
      importProvidersFrom(FlSnackBarModule.forRoot()),
      importProvidersFrom(BrowserAnimationsModule),
      provideHttpClient(withInterceptorsFromDi()),
      provideRouter([]),
      { provide: APP_INITIALIZER, useFactory: loadThemeOnInit, deps: [FlThemeService], multi: true },
    ],
  };
}
