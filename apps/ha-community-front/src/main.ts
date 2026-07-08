import { HttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  enableProdMode,
  mergeApplicationConfig,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { flLoadEnvironmentFromAssets } from '@monorepo/front-core-lib/fl-core';
import {
  FL_TRANSLATE_MODULE_CONFIG,
  FlTranslateModuleConfig,
  FlTranslationLoader,
} from '@monorepo/front-core-lib/fl-translate';
import { TeFixInit } from '@monorepo/text-editor';
import { TranslateLoader } from '@ngx-translate/core';

import { HaAppComponent } from './app/ha-app.component';
import { haAppConfig } from './app/ha-app.config';
import { HA_ENVIRONMENT } from './environments/ha-environment';
import { HA_ENVIRONMENT_PATH, HaEnvironmentSettings } from './environments/ha-environment.class';

function translationLoaderFactory(http: HttpClient, config: FlTranslateModuleConfig): FlTranslationLoader {
  return new FlTranslationLoader(http, config.filenames, config.folder, config.fileSuffix);
}

function bootstrapApp(): void {
  const browserConfig: ApplicationConfig = {
    providers: [
      {
        provide: TranslateLoader,
        useFactory: translationLoaderFactory,
        deps: [HttpClient, FL_TRANSLATE_MODULE_CONFIG],
      },
      provideAppInitializer(() => TeFixInit.fixEditorInit()),
    ],
  };

  const config = mergeApplicationConfig(haAppConfig, browserConfig);

  bootstrapApplication(HaAppComponent, {
    ...config,
    providers: [provideZoneChangeDetection(), ...config.providers],
  }).catch((err) => console.error(err));
}

if (HA_ENVIRONMENT.production) {
  enableProdMode();
  flLoadEnvironmentFromAssets(HA_ENVIRONMENT_PATH).then((env: HaEnvironmentSettings) => {
    // set the environment setting from the json file
    HA_ENVIRONMENT.settings = env;
    bootstrapApp();
  });
} else {
  // set the environment here to simulate the production mode
  // (environment is not loaded before bootstraping the app)
  HA_ENVIRONMENT.settings = {
    apiUrl: 'http://localhost:3333',
    constellabApiUrl: 'https://api.preconstellab.com',
    constellabFrontUrl: 'https://preconstellab.com',
    communityFrontUrl: 'http://localhost:4200',
    captchaSiteKey: '',
    googleAnalyticsId: 'G-HDSPQ44FBS',
    discordLink: 'https://discord.com/invite/7nmH5qKM',
    algoliaAppId: 'S233I3C24Z',
    algoliaSearchKey: '8fd4e2048efc6363ff0dca169b6522af',
    algoliaIndexName: 'Community Preprod',
    algoliaSiteVerificationKey: null,
    homeVideoLink: null,
  };

  bootstrapApp();
}
