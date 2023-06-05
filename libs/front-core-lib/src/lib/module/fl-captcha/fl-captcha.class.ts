import {InjectionToken} from '@angular/core';

export interface FlCaptchaModuleConfig {
  siteKey: string;
  isLocal: boolean;
}

export const FL_CAPTCHA_MODULE_CONFIG =
  new InjectionToken<FlCaptchaModuleConfig>('FL_CAPTCHA_MODULE_CONFIG');
