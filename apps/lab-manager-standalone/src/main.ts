import { environment } from './environments/lms-environment';
import { flLoadEnvironmentFromAssets } from '@monorepo/front-core-lib';
import { lmsEnvironmentPath, LmsEnvironmentSettings } from './environments/lms-environment.class';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LmsAppModule } from './app/lms-app.module';

if (environment.production) {
  flLoadEnvironmentFromAssets(lmsEnvironmentPath).then((env: LmsEnvironmentSettings) => {
    // set the environment setting from the json file
    environment.settings = env;

    platformBrowserDynamic()
      .bootstrapModule(LmsAppModule)
      .catch((err) => console.error(err));
  });
} else {
  // set the environment here to simulate the production mode
  // (environment is not loaded before bootstraping the app)
  environment.settings = {
    apiUrl: 'http://localhost:3080',
    communityApiUrl: 'https://hub-back-pre-prod.constellab-pre-prod.gencovery.com',
    communityFrontUrl: 'http://localhost:4200',
  };
  platformBrowserDynamic()
    .bootstrapModule(LmsAppModule)
    .catch((err) => console.error(err));
}
