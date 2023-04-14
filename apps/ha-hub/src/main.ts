import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {HaAppModule} from './app/ha-app.module';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/ha-environment';

function bootstrap(): void {
  if (environment.production) {
    enableProdMode();

  } else {
    // in dev no environment loading
    platformBrowserDynamic()
      .bootstrapModule(HaAppModule)
      .catch((err) => console.error(err));
  }
}

if (document.readyState !== 'loading') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
