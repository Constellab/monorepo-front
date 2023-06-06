import {ModuleWithProviders, NgModule} from '@angular/core';
import {FL_CAPTCHA_MODULE_CONFIG, FlCaptchaModuleConfig} from './fl-captcha.class';
import {FlCaptchaService} from './fl-captcha.service';
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from 'ng-recaptcha';

@NgModule({
  imports: [RecaptchaV3Module],
})
export class FlCaptchaModule {

  constructor() {
  }

  /**
   * Call this method only once on the LabAppModule
   *
   * Both forRoot method
   * For root method to export TranslateModule
   */
  public static forRoot(config: FlCaptchaModuleConfig): ModuleWithProviders<FlCaptchaModule> {
    return {
      ngModule: FlCaptchaModule,
      providers: [
        {provide: FL_CAPTCHA_MODULE_CONFIG, useValue: config},
        {provide: RECAPTCHA_V3_SITE_KEY, useValue: config.siteKey},
        FlCaptchaService
      ]
    };
  }
}
