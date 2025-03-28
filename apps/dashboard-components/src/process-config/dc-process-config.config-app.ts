import { ApplicationConfig } from '@angular/core';
import { dcProcessConfigI18n } from './dc-process-config.i18n';
import { dcCoreWithAuthConfig } from '../core/dc-core-with-auth-config';

export function dcProcessConfigGetAppConfig(): ApplicationConfig {
  return dcCoreWithAuthConfig(dcProcessConfigI18n);
}
