import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { HaAppModule } from './app/ha-app.module';

function bootstrap() {
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
