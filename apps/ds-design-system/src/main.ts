import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { inject, Injector, provideAppInitializer } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  FL_MAT_FORM_FIELD_CONFIG,
  FL_TOOLTIP_CONFIG,
  flSetRootInjector,
} from '@monorepo/front-core-lib/fl-core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { DsAppComponent } from './app/ds-app.component';
import { dsAppConfig } from './app/ds-app.config';

bootstrapApplication(DsAppComponent, {
  ...dsAppConfig,
  providers: [
    ...(dsAppConfig.providers ?? []),
    provideAnimations(),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    // The FlThemeService (and other library helpers) resolve dependencies through
    // the root injector, so it must be registered before the theme is loaded.
    provideAppInitializer(() => flSetRootInjector(inject(Injector))),
    provideAppInitializer(() => inject(FlThemeService).init()),
    // Apply the library's default Material form-field / tooltip configuration
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: FL_MAT_FORM_FIELD_CONFIG },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: FL_TOOLTIP_CONFIG },
  ],
}).catch((err) => console.error(err));
