import { CommonModule } from '@angular/common';
import { inject, ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlCaptchaModule } from '../fl-captcha/fl-captcha.module';
import { FlCardModule } from '../fl-card/fl-card.module';
import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { FlDialogModule } from '../fl-dialog/fl-dialog.module';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlSnackBarModule } from '../fl-snack-bar/fl-snack-bar.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlCheckCredentialsDialogComponent } from './component/fl-check-credentials-dialog/fl-check-credentials-dialog.component';
import { FlCompleteLoginComponent } from './component/fl-complete-login/fl-complete-login.component';
import { FlLoginComponent } from './component/fl-login/fl-login.component';
import { FlLoginFooterComponent } from './component/fl-login-footer/fl-login-footer.component';
import { FlLoginFormComponent } from './component/fl-login-form/fl-login-form.component';
import { FlLoginPageComponent } from './component/fl-login-page/fl-login-page.component';
import { FlLoginTwoFAComponent } from './component/fl-login-two-f-a/fl-login-two-f-a.component';
import { FlPasswordForgottenComponent } from './component/fl-password-forgotten/fl-password-forgotten.component';
import { FlResetPasswordPageComponent } from './component/fl-reset-password-page/fl-reset-password-page.component';
import { FlSignupFormComponent } from './component/fl-signup-form/fl-signup-form.component';
import { FlSignupPageComponent } from './component/fl-signup-page/fl-signup-page.component';
import { FL_AUTH_I18N } from './i18n/fl-auth.i18n';
import { FlAuthService } from './service/fl-auth.service';
import { FlUserAccountService } from './service/fl-user-account.service';

/**
 * Module containing component for authentication, sign up, password reset
 */
@NgModule({
  declarations: [
    FlLoginComponent,
    FlPasswordForgottenComponent,
    FlResetPasswordPageComponent,
    FlSignupFormComponent,
    FlCompleteLoginComponent,
    FlLoginTwoFAComponent,
    FlLoginPageComponent,
    FlSignupPageComponent,
    FlCheckCredentialsDialogComponent,
    FlLoginFormComponent,
    FlLoginFooterComponent,
  ],
  exports: [
    FlPasswordForgottenComponent,
    FlResetPasswordPageComponent,
    FlSignupFormComponent,
    FlCompleteLoginComponent,
    FlLoginPageComponent,
    FlSignupPageComponent,
    FlLoginFooterComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,

    FlCoreComponentModule,
    FlCorePipeModule,
    FlCoreDirectiveModule,
    FlDialogModule,
    FlSnackBarModule,
    FlTranslateModule,
    FlLoaderModule,
    FlCardModule,
    FlCaptchaModule,
  ],
})
export class FlAuthModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlAuthModule', FL_AUTH_I18N);
  }

  /**
   * Configure the auth module
   * @param authService provide a service with login and logout routes
   * @param userAccountService (optional) provide a service for signup and user password routes
   *                            (if not provided, the footer of the FlLoginComponent must be disabled)
   */
  public static forRoot(
    authService: Type<FlAuthService>,
    userAccountService?: Type<FlUserAccountService>
  ): ModuleWithProviders<FlAuthModule> {
    const providers: Provider[] = [{ provide: FlAuthService, useExisting: authService }];

    if (userAccountService) {
      providers.push({
        provide: FlUserAccountService,
        useExisting: userAccountService,
      });
    }

    return {
      ngModule: FlAuthModule,
      providers: providers,
    };
  }
}
