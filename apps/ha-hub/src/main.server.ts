import { ApplicationConfig, ApplicationRef, mergeApplicationConfig, TransferState } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { haAppConfig } from './app/ha-app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import { HaAppComponent } from './app/ha-app.component';
import { FL_TRANSLATE_MODULE_CONFIG } from '@monorepo/front-core-lib/fl-translate';
import { FlTranslateModuleConfig } from '@monorepo/front-core-lib/fl-translate';
import { TranslateServerLoader } from './app/ha-translation-server-loader';
import { TranslateLoader } from '@ngx-translate/core';

function translationServerLoader(
  transferState: TransferState,
  config: FlTranslateModuleConfig
): TranslateServerLoader {
  return new TranslateServerLoader(transferState, config.filenames, config.folder, config.fileSuffix);
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

export const config = mergeApplicationConfig(haAppConfig, serverConfig);

const bootstrap = (): Promise<ApplicationRef> => bootstrapApplication(HaAppComponent, config);

export default bootstrap;
