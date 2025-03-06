import { ApplicationConfig } from '@angular/core';
import { dcCoreConfig } from '../core/dc-core-config';
import { dcProcessConfigI18n } from './dc-process-config.i18n';

export function dcProcessConfigGetAppConfig(): ApplicationConfig {
  return dcCoreConfig(dcProcessConfigI18n);
}
