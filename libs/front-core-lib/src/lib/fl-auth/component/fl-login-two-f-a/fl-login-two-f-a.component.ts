import { ChangeDetectionStrategy,Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FlQueryParamHandler } from '@monorepo/front-core-lib/fl-core';
import { switchMap } from 'rxjs/operators';

import { FlAuthLogin2FaResponse, FlAuthService } from '../../service/fl-auth.service';
import { FlCompleteLoginQueryParam } from '../fl-complete-login/fl-complete-login.component';

@Component({
  selector: 'fl-login-two-f-a',
  templateUrl: './fl-login-two-f-a.component.html',
  styleUrls: ['./fl-login-two-f-a.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlLoginTwoFAComponent implements OnInit {
  private authService = inject(FlAuthService);
  private queryParamHandler = inject<FlQueryParamHandler<FlCompleteLoginQueryParam>>(FlQueryParamHandler);

  @Output() login2FASuccess: EventEmitter<FlAuthLogin2FaResponse> = new EventEmitter();

  formControl: FormControl;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.formControl = new FormControl(null, Validators.required);
  }

  submit(): void {
    if (!this.isLoading && this.formControl.valid) {
      this.login2FA(this.formControl.value);
    }
  }

  private login2FA(twoFACode: string): void {
    this.isLoading = true;

    // retrieve 2FA url code from query params and call check 2FA
    this.queryParamHandler
      .getFirstQueryParams()
      .pipe(
        switchMap((queryParams) =>
          this.authService.checkTwoFA({
            twoFACode: twoFACode,
            twoFAUrlCode: queryParams.twoFAUrlCode,
          })
        )
      )
      .subscribe({
        next: (result) => this.onLogin2FASuccess(result),
        error: () => (this.isLoading = false),
      });
  }

  private onLogin2FASuccess(result: FlAuthLogin2FaResponse): void {
    this.login2FASuccess.emit(result);
    this.isLoading = false;
  }
}
