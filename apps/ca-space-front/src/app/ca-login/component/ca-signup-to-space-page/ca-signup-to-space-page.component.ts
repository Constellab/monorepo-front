import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { FlAuthModule, FlSignupFormComponent, FlSignUpUser } from '@monorepo/front-core-lib/fl-auth';
import { FlCaptchaService } from '@monorepo/front-core-lib/fl-captcha';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, switchMap, tap } from 'rxjs';

import { CaSpacePhotoPipe } from '../../../ca-core/entity-module/ca-space-core/pipe/ca-space-photo.pipe';
import { CaSpaceInvitReadDTO } from '../../../ca-core/model/entities/space/ca-space-invit.class';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { CaSpaceInvitService } from '../../../ca-core/service-api/ca-space-invit.service';
import { CaUserAccountsService } from '../../../ca-core/service-api/ca-user-accounts.service';
import { CaAuthService } from '../../service/ca-auth.service';

/**
 * Page on which the user can join an space. He can create an account or use an existing one.
 */
@Component({
  selector: 'ca-signup-to-space-page',
  templateUrl: './ca-signup-to-space-page.component.html',
  styleUrls: ['./ca-signup-to-space-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlSectionModule,
    FlCardModule,
    ReactiveFormsModule,
    FlAuthModule,
    MatButton,
    FlLoaderModule,
    TranslatePipe,
    CaSpacePhotoPipe,
  ],
})
export class CaSignupToSpacePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private spaceInvitService = inject(CaSpaceInvitService);
  private snackBarService = inject(FlSnackBarService);
  private routerService = inject(CaRouterService);
  private userAccountService = inject(CaUserAccountsService);
  private authService = inject(CaAuthService);
  private authenticatedUserService = inject(CaAuthenticatedUserService);
  private captchaService = inject(FlCaptchaService);

  invitation$: Observable<CaSpaceInvitReadDTO>;

  invitationCode: string;

  signupFormGp: UntypedFormGroup;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.getInvitation(params.code));
  }

  private getInvitation(code: string): void {
    this.invitationCode = code;
    this.invitation$ = this.spaceInvitService
      .getInvitationByCode(code)
      .pipe(tap((invitation) => this.getInvitationSuccess(invitation)));
  }

  private getInvitationSuccess(invitation: CaSpaceInvitReadDTO): void {
    this.signupFormGp = FlSignupFormComponent.buildFormGroup();
    this.signupFormGp.get('email').setValue(invitation.invitation.userMail);
    this.signupFormGp.get('email').disable();
  }

  signupSubmit(): void {
    if (this.signupFormGp.valid && !this.isLoading) {
      this.signup(this.signupFormGp.getRawValue());
    } else {
      this.signupFormGp.markAllAsTouched();
    }
  }

  private signup(user: FlSignUpUser): void {
    this.isLoading = true;

    this.generateCaptcha()
      .pipe(
        switchMap((token) => {
          user.captcha = token;
          return this.userAccountService.createUserAndJoinSpace(this.invitationCode, user);
        })
      )
      .subscribe({
        next: () => this.signupSuccess(),
        error: () => (this.isLoading = false),
      });
  }

  private generateCaptcha(): Observable<string> {
    return this.captchaService.executeCaptcha('signup');
  }

  private signupSuccess(): void {
    this.snackBarService.openSuccessMessage(
      { text: 'join_space_new_user_success', translateText: true },
      7000
    );
    this.routerService.navigatorToLoginRoute();
    this.isLoading = false;
  }

  acceptInvitation(): void {
    this.isLoading = true;
    this.spaceInvitService.acceptInvitationExistingUser(this.invitationCode).subscribe({
      next: () => this.acceptInvitationSuccess(),
      error: () => (this.isLoading = false),
    });
  }

  private acceptInvitationSuccess(): void {
    this.isLoading = false;
    this.snackBarService.openSuccessMessage({
      text: 'join_space_existing_user_success',
      translateText: true,
    });

    if (!this.authService.hasAuthorizationCookie()) {
      this.routerService.navigatorToLoginRoute();
      return;
    }

    // the marker only says "maybe", and it now outlives the session: sending someone to the
    // dashboard on its word alone would land them there just to be bounced back to the login page
    this.authenticatedUserService
      .hasLiveSession()
      .subscribe((live: boolean) =>
        live ? this.routerService.navigateToDashboard() : this.routerService.navigatorToLoginRoute()
      );
  }
}
