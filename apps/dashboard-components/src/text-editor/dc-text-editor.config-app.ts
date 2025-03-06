import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { dcCoreConfig } from '../core/dc-core-config';
import { dcTextEditorI18n } from './dc-text-editor/dc-text-editor.i18n';

export function dcTextEditorGetAppConfig(): ApplicationConfig {
  const appConfig = dcCoreConfig(dcTextEditorI18n);
  appConfig.providers.push(
    importProvidersFrom(FlDialogModule.forRoot()),
    importProvidersFrom(FlPortalModule.forRoot()),
    importProvidersFrom(FlSnackBarModule.forRoot())
  );

  return appConfig;
}
