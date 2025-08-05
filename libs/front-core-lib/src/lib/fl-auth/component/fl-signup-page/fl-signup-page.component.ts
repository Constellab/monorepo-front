import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlCaptchaService } from '@monorepo/front-core-lib/fl-captcha';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { Observable, switchMap } from 'rxjs';

import { FlSignUpUser } from '../../model/fl-sign-up-user.class';
import { FlUserAccountService } from '../../service/fl-user-account.service';
import { FlSignupFormComponent } from '../fl-signup-form/fl-signup-form.component';

@Component({
  selector: 'fl-signup-page',
  templateUrl: './fl-signup-page.component.html',
  styleUrls: ['./fl-signup-page.component.scss'],
  standalone: false,
})
export class FlSignupPageComponent implements OnInit {
  private themeService: FlThemeService = inject(FlThemeService);
  private userAccountService: FlUserAccountService = inject(FlUserAccountService);
  private snackBarService: FlSnackBarService = inject(FlSnackBarService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private captchaService: FlCaptchaService = inject(FlCaptchaService);

  /**
   * Redirection route after the signup is successful, do nothing if not provided
   */
  @Input() redirectionRoute?: string;

  @Input() lightThemeLogo: string = 'assets/fl-logo/constellab-logo-text-black.svg';

  @Input() darkThemeLogo: string = 'assets/fl-logo/constellab-logo-text-white.svg';

  logo: string;

  formGp = FlSignupFormComponent.buildFormGroup();

  isLoading: boolean = false;

  ngOnInit(): void {
    this.logo = this.themeService.isDarkTheme() ? this.darkThemeLogo : this.lightThemeLogo;

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['email'] && ClStringHelper.isEmail(params['email'])) {
        this.formGp.get('email').setValue(params['email']);
      }
    });
  }

  submit(): void {
    if (this.formGp.valid && !this.isLoading) {
      this.signupUser(this.formGp.getRawValue());
    } else {
      this.formGp.markAllAsTouched();
    }
  }

  private signupUser(user: FlSignUpUser): void {
    this.isLoading = true;

    this.generateCaptcha()
      .pipe(
        switchMap((token) => {
          user.captcha = token;

          return this.userAccountService.signup(user);
        })
      )
      .subscribe({
        next: () => this.onSignupSuccess(),
        error: () => (this.isLoading = false),
      });
  }

  private generateCaptcha(): Observable<string> {
    return this.captchaService.executeCaptcha('action_one');
  }

  private onSignupSuccess(): void {
    this.snackBarService.openSuccessMessage({ text: 'flAuth.account_created', translateText: true }, 10000);

    this.isLoading = false;

    if (this.redirectionRoute) {
      this.router.navigate([this.redirectionRoute]);
    }
  }
}
