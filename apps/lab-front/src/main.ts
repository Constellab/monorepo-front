import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {LabAppModule} from './app/lab-app.module';
import {environment} from './environments/lab-environment';
import {labEnvironmentPath, LabEnvironmentSettings} from './environments/lab-environment.class';
import {flLoadEnvironmentFromAssets} from '@monorepo/front-core-lib';

if (environment.production) {
  enableProdMode();

  flLoadEnvironmentFromAssets(labEnvironmentPath).then((env: LabEnvironmentSettings) => {
    // set the environment setting from the json file
    environment.settings = env;

    platformBrowserDynamic()
      .bootstrapModule(LabAppModule)
      .catch((err) => console.error(err));
  });

} else {

  // set the environment here to simulate the production mode
  // (environment is not loaded before bootstraping the app)
  environment.settings = {
    apiBaseUrl: 'http://localhost:3000',
    devApiBaseUrl: 'http://localhost:3000',
    codelabUrl: 'http://localhost:80',
    virtualHost: 'localhost',
    spaceFrontUrl: 'http://localhost:4200',
    spaceApiUrl: 'http://localhost:3001',
    communityFrontUrl: 'https://hub-pre-prod.gencovery.com',
    communityApiUrl: 'https://api.constellab.community',
    captchaSiteKey: '123456',
  };

  // in dev no environment loading
  platformBrowserDynamic()
    .bootstrapModule(LabAppModule)
    .catch((err) => console.error(err));
}

