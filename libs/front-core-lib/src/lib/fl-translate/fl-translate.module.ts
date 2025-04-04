import { inject, ModuleWithProviders, NgModule, provideAppInitializer, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
  TranslatePipe,
} from '@ngx-translate/core';
import { FlMissingTranslationLogService } from './service/fl-missing-translation-log.service';
import { FlTranslateService } from './service/fl-translate.service';
import { FL_TRANSLATE_MODULE_CONFIG, FlTranslateModuleConfig } from './model/fl-translate-module-config';
import { CookieService } from 'ngx-cookie-service';
import { FlTranslatableTextPipe } from './pipe/fl-translatable-text.pipe';
import { HttpClient } from '@angular/common/http';
import { FlTranslationLoader } from './fl-translation-loader';

// init the translation
export function initTranslateService(service: FlTranslateService): void {
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
        provideAppInitializer(() => initTranslateService(inject(FlTranslateService))),
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
    let loader: Provider = undefined;
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
