import { inject, Injectable, Injector } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { ReCaptchaV3Service } from 'ng-recaptcha-2';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { FlSnackBarService } from '../fl-snack-bar/fl-snack-bar.service';
import { FL_CAPTCHA_MODULE_CONFIG, FlCaptchaModuleConfig } from './fl-captcha.class';

@Injectable({ providedIn: 'root' })
export class FlCaptchaService {
  private injector = inject(Injector);
  private config = inject<FlCaptchaModuleConfig>(FL_CAPTCHA_MODULE_CONFIG);
  private snackBarService = inject(FlSnackBarService);

  public executeCaptcha(action: string): Observable<string> {
    // disable captcha on local
    if (ClHelpService.isNullOrEmpty(this.config.siteKey)) return of(null);

    const captchaService = this.injector.get(ReCaptchaV3Service);
    return captchaService.execute(action).pipe(
      catchError(() => {
        this.snackBarService.openErrorMessage({ text: 'flCaptcha.error', translateText: true });
        return throwError(() => new Error('Captcha error'));
      })
    );
  }
}
