import { NgModule, TransferState } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

import { HaAppModule } from './ha-app.module';
import { HaAppComponent } from './ha-app.component';
import { FL_TRANSLATE_MODULE_CONFIG, FlTranslateModuleConfig } from '@monorepo/front-core-lib';

import { TranslateLoader } from '@ngx-translate/core';
import { TranslateServerLoader } from './ha-translation-server-loader';

export function TranslationServerLoader(
  transferState: TransferState,
  config: FlTranslateModuleConfig
): TranslateServerLoader {
  return new TranslateServerLoader(transferState, config.filenames, config.filePrefix, config.fileSuffix);
}

@NgModule({
  imports: [HaAppModule],
  providers: [
    provideServerRendering(),
    {
      provide: TranslateLoader,
      useFactory: TranslationServerLoader,
      deps: [TransferState, FL_TRANSLATE_MODULE_CONFIG],
    },
  ],
  bootstrap: [HaAppComponent],
})
export class AppServerModule {}
