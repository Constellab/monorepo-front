import { ModuleWithProviders, NgModule, inject, provideAppInitializer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissingTranslationHandler, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FlMissingTranslationLogService } from './service/fl-missing-translation-log.service';
import { FlTranslateService } from './service/fl-translate.service';
import { FL_TRANSLATE_MODULE_CONFIG, FlTranslateModuleConfig } from './model/fl-translate-module-config';
import { CookieService } from 'ngx-cookie-service';
import { FlTranslatableTextPipe } from './pipe/fl-translatable-text.pipe';

// AoT requires an exported function for factories
// load the translations

// init the translation
export function initTranslateService(service: FlTranslateService): () => void {
  // use a local variable otherwise the ng package build failed
  // noinspection UnnecessaryLocalVariableJS
  const func = (): void => service.init();
  return func;
}

@NgModule({
  declarations: [FlTranslatableTextPipe],
  exports: [TranslatePipe, FlTranslatableTextPipe],
  imports: [CommonModule, TranslateModule.forChild()],
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
        // Init the translate service
        provideAppInitializer(() => {
          const initializerFn = initTranslateService(inject(FlTranslateService));
          return initializerFn();
        }),
      ],
    };
  }

  /**
   * Call this method only once on the LabAppModule
   *
   * Both forRoot method
   * For root method to export TranslateModule
   */
  public static forRoot2(): ModuleWithProviders<TranslateModule> {
    return TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useExisting: FlMissingTranslationLogService,
      },
      // useful, this init translation even if translate object is not null
      extend: true,
    });
  }
}
