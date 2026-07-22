import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { importProvidersFrom, inject, Injector, provideAppInitializer } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import {
  FL_LUXON_DATE_FORMAT,
  FL_MAT_FORM_FIELD_CONFIG,
  FL_TOOLTIP_CONFIG,
  flSetRootInjector,
} from '@monorepo/front-core-lib/fl-core';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { DsAppComponent } from './app/ds-app.component';
import { dsAppConfig } from './app/ds-app.config';

bootstrapApplication(DsAppComponent, {
  ...dsAppConfig,
  providers: [
    ...(dsAppConfig.providers ?? []),
    provideAnimations(),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    // FlSnackBarService depends on FlTranslateService, so the translate module must
    // be configured before the snackbar module is provided.
    importProvidersFrom(
      FlTranslateModule.forRoot({
        defaultLang: ClSupportedLanguage.en,
        availableLang: [ClSupportedLanguage.en],
      }),
      FlTranslateModule.forRoot2(),
      FlSnackBarModule.forRoot()
    ),
    // The FlThemeService (and other library helpers) resolve dependencies through
    // the root injector, so it must be registered before the theme is loaded.
    provideAppInitializer(() => flSetRootInjector(inject(Injector))),
    provideAppInitializer(() => inject(FlThemeService).init()),
    // Apply the library's default Material form-field / tooltip configuration
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: FL_MAT_FORM_FIELD_CONFIG },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: FL_TOOLTIP_CONFIG },
    // FlTranslateService depends on DateAdapter — configure it to use luxon like the other apps
    { provide: DateAdapter, useClass: LuxonDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: FL_LUXON_DATE_FORMAT },
  ],
}).catch((err) => console.error(err));
