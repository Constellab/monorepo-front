import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/ha-environment';
import {flLoadEnvironmentFromAssets} from '@monorepo/front-core-lib';
import {haEnvironmentPath, HaEnvironmentSettings} from './environments/ha-environment.class';
import {HaAppModule} from './app/ha-app.module';

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
