import { NgModule, inject } from '@angular/core';
import { FL_CAPTCHA_MODULE_CONFIG, FlCaptchaModuleConfig } from './fl-captcha.class';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha-2';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { flCaptchaI18n } from './fl-captcha.i18n';

function configureReCaptcha(config: FlCaptchaModuleConfig): string {
  return config.siteKey;
}

/**
 * To use this module, the FL_CAPTCHA_MODULE_CONFIG must be provided in the app module.
 */
@NgModule({
  imports: [RecaptchaV3Module],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useFactory: configureReCaptcha, deps: [FL_CAPTCHA_MODULE_CONFIG] },
  ],
})
export class FlCaptchaModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlCaptchaModule', flCaptchaI18n);
  }
}
