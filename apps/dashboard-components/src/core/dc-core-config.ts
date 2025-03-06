import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import {
  FlTranslateModule,
  FlTranslateObject,
  FlTranslateService,
} from '@monorepo/front-core-lib/fl-translate';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  Injector,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  flLuxonDateFormat,
  flMatFormFieldConfig,
  flSetRootInjector,
  flTooltipConfig,
} from '@monorepo/front-core-lib/fl-core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

function loadThemeOnInit(themeService: FlThemeService): void {
  themeService.init();
}

function loadTranslation(translateService: FlTranslateService, translations: FlTranslateObject): void {
  translateService.addModuleTranslation('dc', translations);
}

function initRootInjector(injector: Injector): void {
  flSetRootInjector(injector);
}

export function dcCoreConfig(translations: FlTranslateObject): ApplicationConfig {
  return {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),

      // configure the date picker to work with luxon
      { provide: DateAdapter, useClass: LuxonDateAdapter },
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
      provideRouter([]),
      provideAppInitializer(() => loadThemeOnInit(inject(FlThemeService))),
      provideAppInitializer(() => loadTranslation(inject(FlTranslateService), translations)),
      provideAppInitializer(() => initRootInjector(inject(Injector))),
    ],
  };
}
