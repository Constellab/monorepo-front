import {
  ApplicationConfig,
  ApplicationRef,
  mergeApplicationConfig,
  provideZoneChangeDetection,
  TransferState,
} from '@angular/core';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/ssr';
import { FL_TRANSLATE_MODULE_CONFIG } from '@monorepo/front-core-lib/fl-translate';
import { FlTranslateModuleConfig } from '@monorepo/front-core-lib/fl-translate';
import { TranslateLoader } from '@ngx-translate/core';

import { HaAppComponent } from './app/ha-app.component';
import { haAppConfig } from './app/ha-app.config';
import { HaTranslateServerLoader } from './app/ha-translation-server-loader';

function translationServerLoader(
  transferState: TransferState,
  config: FlTranslateModuleConfig
): HaTranslateServerLoader {
  return new HaTranslateServerLoader(transferState, config.filenames, config.folder, config.fileSuffix);
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: TranslateLoader,
      useFactory: translationServerLoader,
      deps: [TransferState, FL_TRANSLATE_MODULE_CONFIG],
    },
  ],
};

const config = mergeApplicationConfig(haAppConfig, serverConfig);

export const HA_BOOTSTRAP = (context: BootstrapContext): Promise<ApplicationRef> =>
  bootstrapApplication(
    HaAppComponent,
    { ...config, providers: [provideZoneChangeDetection(), ...config.providers] },
    context
  );

export default HA_BOOTSTRAP;
