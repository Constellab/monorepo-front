import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { HaAppModule } from './app/ha-app.module';
import {flLoadEnvironmentFromAssets} from '@monorepo/front-core-lib';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/ha-environment';
import {haEnvironmentPath, HaEnvironmentSettings} from './environments/ha-environment.class';

function bootstrap(): void {
  if (environment.production) {
    enableProdMode();

    flLoadEnvironmentFromAssets(haEnvironmentPath).then((env: HaEnvironmentSettings) => {
      // set the environment setting from the json file
      environment.settings = env;

      platformBrowserDynamic()
        .bootstrapModule(HaAppModule)
        .catch((err) => console.error(err));
    });

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
