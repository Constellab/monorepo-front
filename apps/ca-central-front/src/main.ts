import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {CaAppModule} from './app/ca-app.module';
import {environment} from './environments/ca-environment';
import {flLoadEnvironmentFromAssets} from '@monorepo/front-core-lib';
import {caEnvironmentPath, CaEnvironmentSettings} from './environments/ca-environment.class';


if (environment.production) {
  enableProdMode();

  flLoadEnvironmentFromAssets(caEnvironmentPath).then((env: CaEnvironmentSettings) => {
    // set the environment setting from the json file
    environment.settings = env;

    platformBrowserDynamic()
      .bootstrapModule(CaAppModule)
      .catch((err) => console.error(err));
  });

} else {

  // set the environment here to simulate the production mode
  // (environment is not loaded before bootstraping the app)
  environment.settings = {
    apiUrl: 'http://localhost:3001',
    communityApiUrl: 'http://localhost:3333',
    communityFrontUrl: 'http://localhost:4200',
    frontDomain: 'localhost',
    captchaSiteKey: '123456'
  };
  // in dev no environment loading
  platformBrowserDynamic()
    .bootstrapModule(CaAppModule)
    .catch((err) => console.error(err));
}

