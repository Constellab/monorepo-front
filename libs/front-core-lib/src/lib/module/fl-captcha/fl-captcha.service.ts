import {Inject, Injectable, Injector} from '@angular/core';
import {ReCaptchaV3Service} from 'ng-recaptcha';
import {Observable, of} from 'rxjs';
import {FL_CAPTCHA_MODULE_CONFIG, FlCaptchaModuleConfig} from './fl-captcha.class';


@Injectable({providedIn: 'root'})
export class FlCaptchaService {

  constructor(private injector: Injector,
              @Inject(FL_CAPTCHA_MODULE_CONFIG) private config: FlCaptchaModuleConfig) {
  }

  public executeCaptcha(action: string): Observable<string> {
    // disable captcha on local
    if (this.config.isLocal) return of(null);

    const captchaService = this.injector.get(ReCaptchaV3Service);
    return captchaService.execute(action);
  }
}
