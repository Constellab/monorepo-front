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

    // set the environment here to simulate the production mode
    // (environment is not loaded before bootstraping the app)
    environment.settings = {
      apiUrl: 'http://localhost:3333',
      constellabApiUrl: 'https://api.preconstellab.com',
      constellabFrontUrl: 'https://preconstellab.com',
      communityFrontUrl: 'http://localhost:4200',
      captchaSiteKey: '123456',
      googleAnalyticsId: 'G-HDSPQ44FBS',
      discordLink: 'https://discord.com/invite/7nmH5qKM'
    };

    platformBrowserDynamic()
      .bootstrapModule(HaAppModule)
      .catch((err) => console.error(err));
  }
}

bootstrap();
