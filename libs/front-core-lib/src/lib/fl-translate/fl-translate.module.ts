import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, ModuleWithProviders, NgModule, provideAppInitializer, Provider } from '@angular/core';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
  TranslatePipe,
} from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

import { FlTranslationLoader } from './fl-translation-loader';
import { FL_TRANSLATE_MODULE_CONFIG, FlTranslateModuleConfig } from './model/fl-translate-module-config';
import { FlTranslatableTextPipe } from './pipe/fl-translatable-text.pipe';
import { FlMissingTranslationLogService } from './service/fl-missing-translation-log.service';
import { FlTranslateService } from './service/fl-translate.service';

// init the translation
export function flInitTranslateService(service: FlTranslateService): void {
  service.init();
}

function flTranslationLoaderFactory(
  httpClient: HttpClient,
  config: FlTranslateModuleConfig
): FlTranslationLoader {
  return new FlTranslationLoader(httpClient, config.filenames, config.folder, config.fileSuffix);
}

@NgModule({
  declarations: [FlTranslatableTextPipe],
  exports: [TranslatePipe, FlTranslatableTextPipe],
  imports: [CommonModule, TranslateModule],
})
export class FlTranslateModule {
  /**
   * Call this method only once on the LabAppModule
   *
   * Both forRoot method
   * For root method to export TranslateModule
   */
  public static forRoot(config: FlTranslateModuleConfig): ModuleWithProviders<FlTranslateModule> {
    return {
      ngModule: FlTranslateModule,
      providers: [
        CookieService,
        { provide: FL_TRANSLATE_MODULE_CONFIG, useValue: config },
        FlTranslateService,
        FlMissingTranslationLogService,
        // Init the translateService
        provideAppInitializer(() => flInitTranslateService(inject(FlTranslateService))),
      ],
    };
  }

  /**
   * Call this method only once on the LabAppModule
   *
   * Both forRoot method
   * For root method to export TranslateModule
   * @param skipDefaultLoader if true, the loader is not created. Useful for SSR to provide a custom loader
   */
  public static forRoot2(skipDefaultLoader: boolean = false): ModuleWithProviders<TranslateModule> {
    let loader: Provider | undefined = undefined;
    if (!skipDefaultLoader) {
      loader = {
        provide: TranslateLoader,
        useFactory: flTranslationLoaderFactory,
        deps: [HttpClient, FL_TRANSLATE_MODULE_CONFIG],
      };
    }

    return TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useExisting: FlMissingTranslationLogService,
      },
      loader: loader,
      // useful, this init translation even if translate object is not null
      extend: true,
    });
  }
}
