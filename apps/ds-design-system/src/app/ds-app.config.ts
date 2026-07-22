import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FL_ICONS_DEFAULT,FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

import { dsAppRoutes } from './ds-app.routes';

export const dsAppConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(dsAppRoutes),
    // Registers the Material Symbols Rounded default font set (via initIcons) and the
    // shared SVG icons, so <mat-icon> renders glyphs instead of literal icon names.
    importProvidersFrom(
      FlIconModule.forRoot({
        iconFolder: 'assets/fl-mat-icons/',
        iconsToRegister: FL_ICONS_DEFAULT,
      })
    ),
  ],
};
