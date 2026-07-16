import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { dsAppRoutes } from './ds-app.routes';

export const dsAppConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(dsAppRoutes)],
};
