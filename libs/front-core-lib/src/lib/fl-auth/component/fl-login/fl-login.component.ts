import { ChangeDetectionStrategy,Component, EventEmitter, inject, Output } from '@angular/core';
import { FlCaptchaService } from '@monorepo/front-core-lib/fl-captcha';
import { Observable, switchMap } from 'rxjs';

import { FlAuthLoginResponse, FlAuthService } from '../../service/fl-auth.service';
import { FlLoginFormComponent } from '../fl-login-form/fl-login-form.component';

/**
 * Form to call a login request using FlAuthService
 */
@Component({
  selector: 'fl-login',
  templateUrl: './fl-login.component.html',
  styleUrls: ['./fl-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlLoginComponent {
  private authService = inject(FlAuthService);
  private captchaService = inject(FlCaptchaService);

  @Output() loginSuccess: EventEmitter<FlAuthLoginResponse> = new EventEmitter<FlAuthLoginResponse>();

  formGp = FlLoginFormComponent.buildForm();
  isLoading = false;

  login(): void {
    if (this.formGp.valid) {
      this.isLoading = true;

      this.generateCaptcha()
        .pipe(
          switchMap((token) => {
            const value = this.formGp.getRawValue();
            value.captcha = token;

            return this.authService.login(value);
          })
        )
        .subscribe({
          next: (response) => this.onLoginSuccess(response),
          error: () => this.error(),
        });
    } else {
      this.formGp.markAllAsTouched();
    }
  }

  private generateCaptcha(): Observable<string> {
    return this.captchaService.executeCaptcha('login');
  }

  private onLoginSuccess(response: FlAuthLoginResponse): void {
    this.isLoading = false;

    this.loginSuccess.next(response);
  }

  private error(): void {
    this.isLoading = false;
    this.formGp.get('password').reset();
  }
}
