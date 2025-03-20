import {
  ApplicationConfig,
  enableProdMode,
  mergeApplicationConfig,
  provideAppInitializer,
} from '@angular/core';
import { environment } from './environments/ha-environment';
import {
  FL_TRANSLATE_MODULE_CONFIG,
  FlTranslateModuleConfig,
  FlTranslationLoader,
} from '@monorepo/front-core-lib/fl-translate';
import { flLoadEnvironmentFromAssets } from '@monorepo/front-core-lib/fl-core';

import { haEnvironmentPath, HaEnvironmentSettings } from './environments/ha-environment.class';
import { HaAppComponent } from './app/ha-app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { haAppConfig } from './app/ha-app.config';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { TeFixInit } from '@monorepo/text-editor';

function translationLoaderFactory(http: HttpClient, config: FlTranslateModuleConfig): FlTranslationLoader {
  return new FlTranslationLoader(http, config.filenames, config.filePrefix, config.fileSuffix);
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

  bootstrapApplication(HaAppComponent, config).catch((err) => console.error(err));
}

if (environment.production) {
  enableProdMode();
  flLoadEnvironmentFromAssets(haEnvironmentPath).then((env: HaEnvironmentSettings) => {
    // set the environment setting from the json file
    environment.settings = env;
    bootstrapApp();
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
    discordLink: 'https://discord.com/invite/7nmH5qKM',
    algoliaAppId: 'S233I3C24Z',
    algoliaSearchKey: '8fd4e2048efc6363ff0dca169b6522af',
    algoliaIndexName: 'Community Preprod',
    algoliaSiteVerificationKey: null,
    difyChatbotToken: '22bhCqCeaaGiVEhr',
  };

  bootstrapApp();
}
